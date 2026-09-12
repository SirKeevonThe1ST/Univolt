import type { PpgResult, PpgSample, VitalsStatus } from '../types';

function mean(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values: number[]) {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function movingAverage(values: number[], window: number) {
  if (window <= 1) return [...values];
  const half = Math.floor(window / 2);
  const out: number[] = [];
  for (let i = 0; i < values.length; i += 1) {
    const start = Math.max(0, i - half);
    const end = Math.min(values.length, i + half + 1);
    let sum = 0;
    for (let j = start; j < end; j += 1) sum += values[j];
    out.push(sum / (end - start));
  }
  return out;
}

/** High-pass (~0.75 Hz) then low-pass (~4 Hz) using moving averages. */
export function bandpass(samples: PpgSample[]): { times: number[]; filtered: number[] } {
  if (samples.length < 8) {
    return { times: samples.map((s) => s.t), filtered: samples.map((s) => 0) };
  }

  const duration = samples[samples.length - 1].t - samples[0].t;
  const fs = samples.length / Math.max(duration, 0.001);
  const highpassWindow = Math.max(5, Math.round(fs * 1.2));
  const lowpassWindow = Math.max(3, Math.round(fs * 0.18));

  const raw = samples.map((s) => s.v);
  const baseline = movingAverage(raw, highpassWindow);
  const detrended = raw.map((v, i) => v - baseline[i]);
  const filtered = movingAverage(detrended, lowpassWindow);

  return { times: samples.map((s) => s.t), filtered };
}

export function findPeakTimes(times: number[], filtered: number[]): number[] {
  if (filtered.length < 5) return [];

  const amp = stddev(filtered);
  const threshold = mean(filtered) + amp * 0.35;
  const duration = times[times.length - 1] - times[0];
  const fs = times.length / Math.max(duration, 0.001);
  const minGap = Math.max(2, Math.round(fs * 0.4));

  const peaks: number[] = [];
  let lastIdx = -minGap;

  for (let i = 1; i < filtered.length - 1; i += 1) {
    const isPeak = filtered[i] > filtered[i - 1] && filtered[i] >= filtered[i + 1] && filtered[i] > threshold;
    if (!isPeak) continue;
    if (i - lastIdx < minGap) {
      if (filtered[i] > filtered[lastIdx]) {
        peaks[peaks.length - 1] = times[i];
        lastIdx = i;
      }
      continue;
    }
    peaks.push(times[i]);
    lastIdx = i;
  }

  return peaks;
}

function interpolateUniform(times: number[], values: number[], fs: number) {
  const duration = times[times.length - 1] - times[0];
  const n = Math.max(8, Math.floor(duration * fs));
  const out: number[] = [];
  let j = 0;
  for (let i = 0; i < n; i += 1) {
    const t = times[0] + (i / fs);
    while (j < times.length - 2 && times[j + 1] < t) j += 1;
    const t0 = times[j];
    const t1 = times[j + 1];
    const mix = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
    out.push(values[j] * (1 - mix) + values[j + 1] * mix);
  }
  return { series: out, fs };
}

function bpmFromAutocorr(times: number[], filtered: number[]) {
  if (times.length < 16) return 0;
  const { series, fs } = interpolateUniform(times, filtered, 20);
  const x = series.map((v) => v - mean(series));
  const minLag = Math.round(0.4 * fs);
  const maxLag = Math.min(series.length - 2, Math.round(1.5 * fs));
  let bestLag = 0;
  let best = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let acc = 0;
    for (let i = 0; i < x.length - lag; i += 1) acc += x[i] * x[i + lag];
    if (acc > best) {
      best = acc;
      bestLag = lag;
    }
  }
  if (!bestLag) return 0;
  return Math.round(60 / (bestLag / fs));
}

export function analyzePpg(samples: PpgSample[]): PpgResult {
  const { times, filtered } = bandpass(samples);
  const peaks = findPeakTimes(times, filtered);

  if (peaks.length < 2) {
    const fallback = bpmFromAutocorr(times, filtered);
    return {
      bpm: fallback ? clamp(fallback, 40, 200) : 0,
      hrvMs: 0,
      quality: fallback ? 0.35 : 0,
      peakCount: peaks.length,
      filtered,
      times,
    };
  }

  const intervals: number[] = [];
  for (let i = 1; i < peaks.length; i += 1) {
    intervals.push(peaks[i] - peaks[i - 1]);
  }

  const medianInterval = [...intervals].sort((a, b) => a - b)[Math.floor(intervals.length / 2)];
  const inliers = intervals.filter((iv) => Math.abs(iv - medianInterval) / medianInterval < 0.4);
  const used = inliers.length ? inliers : intervals;
  const avgInterval = mean(used);
  const bpm = Math.round(60 / avgInterval);
  const hrvMs = Math.round(stddev(used.map((iv) => iv * 1000)));

  const duration = times[times.length - 1] - times[0];
  const expectedPeaks = duration / avgInterval;
  const consistency = used.length / Math.max(intervals.length, 1);
  const coverage = Math.min(1, peaks.length / Math.max(expectedPeaks, 1));
  const quality = Math.max(0, Math.min(1, consistency * 0.6 + coverage * 0.4));

  return {
    bpm: clamp(bpm, 40, 200),
    hrvMs,
    quality,
    peakCount: peaks.length,
    filtered,
    times,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function classifyHeartRate(age: number, bpm: number): VitalsStatus {
  let min = 60;
  let max = 100;
  if (age < 1) {
    min = 100;
    max = 160;
  } else if (age < 3) {
    min = 90;
    max = 150;
  } else if (age < 6) {
    min = 80;
    max = 140;
  } else if (age < 13) {
    min = 70;
    max = 120;
  } else if (age < 18) {
    min = 60;
    max = 100;
  }

  if (bpm < min - 20 || bpm > max + 25) return 'Critical';
  if (bpm < min || bpm > max) return 'Attention';
  return 'Normal';
}

export function generateSyntheticPpg(durationSec = 12, bpm = 72, fs = 25): PpgSample[] {
  const samples: PpgSample[] = [];
  const hz = bpm / 60;
  for (let i = 0; i < durationSec * fs; i += 1) {
    const t = i / fs;
    const pulse = Math.sin(2 * Math.PI * hz * t);
    const dicrotic = 0.25 * Math.sin(4 * Math.PI * hz * t + 0.6);
    const noise = (Math.random() - 0.5) * 0.08;
    const baseline = 140 + Math.sin(t * 0.3) * 2;
    samples.push({ t, v: baseline + pulse * 8 + dicrotic + noise });
  }
  return samples;
}
