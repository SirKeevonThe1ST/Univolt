import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { colors, radii, spacing, type } from '../components/theme';
import { useRecords } from '../context/RecordsContext';
import type { RootStackParamList } from '../navigation';
import { getPatient } from '../services/database';
import { averageRedFromPngBase64 } from '../services/pngRed';
import { analyzePpg, classifyHeartRate, generateSyntheticPpg } from '../services/ppgProcessor';
import type { Patient, PpgSample, PpgResult, VitalsStatus } from '../types';

const CAPTURE_MS = 12000;

type Phase = 'ready' | 'scanning' | 'result';

export function VitalsScanScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'VitalsScan'>>();
  const { addVitals } = useRecords();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const runningRef = useRef(false);
  const samplesRef = useRef<PpgSample[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [remaining, setRemaining] = useState(12);
  const [liveTrace, setLiveTrace] = useState<number[]>([]);
  const [result, setResult] = useState<(PpgResult & { status: VitalsStatus }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [usedDemo, setUsedDemo] = useState(false);

  useEffect(() => {
    getPatient(route.params.patientId).then(setPatient);
  }, [route.params.patientId]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
    };
  }, []);

  const finishWithSamples = (samples: PpgSample[], demo: boolean) => {
    const analysis = analyzePpg(samples);
    const bpm = analysis.bpm || 0;
    const status = classifyHeartRate(patient?.age ?? 30, bpm || 70);
    setUsedDemo(demo);
    setResult({ ...analysis, bpm, status });
    setPhase('result');
  };

  const captureRed = async (): Promise<number | null> => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0,
      skipProcessing: true,
      shutterSound: false,
    });
    if (!photo?.uri) return null;
    const small = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 12, height: 12 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
    );
    if (!small.base64) return null;
    return averageRedFromPngBase64(small.base64);
  };

  const runScan = async (mode: 'camera' | 'demo') => {
    if (phase === 'scanning') return;
    samplesRef.current = [];
    setResult(null);
    setLiveTrace([]);
    setPhase('scanning');
    setRemaining(12);
    runningRef.current = true;
    const started = Date.now();

    if (mode === 'demo') {
      const synthetic = generateSyntheticPpg(12, 68 + Math.round(Math.random() * 16), 28);
      for (const sample of synthetic) {
        if (!runningRef.current) return;
        samplesRef.current.push(sample);
        const elapsed = Date.now() - started;
        const target = sample.t * 1000;
        const wait = target - elapsed;
        if (wait > 8) await sleep(wait);
        setRemaining(Math.max(0, Math.ceil((CAPTURE_MS - (Date.now() - started)) / 1000)));
        setLiveTrace(samplesRef.current.slice(-40).map((s) => s.v));
      }
      runningRef.current = false;
      finishWithSamples(samplesRef.current, true);
      return;
    }

    while (runningRef.current && Date.now() - started < CAPTURE_MS) {
      const t = (Date.now() - started) / 1000;
      try {
        const red = await captureRed();
        if (red != null) {
          samplesRef.current.push({ t, v: red });
          setLiveTrace(samplesRef.current.slice(-40).map((s) => s.v));
        }
      } catch {
        // Keep looping; a dropped frame is fine for the demo.
      }
      setRemaining(Math.max(0, Math.ceil((CAPTURE_MS - (Date.now() - started)) / 1000)));
    }

    runningRef.current = false;
    finishWithSamples(samplesRef.current, false);
  };

  const onSave = async () => {
    if (!result || !result.bpm) {
      Alert.alert('No heart rate', 'Hold a fingertip over the rear camera lens and scan again.');
      return;
    }
    setSaving(true);
    try {
      await addVitals({
        patientId: route.params.patientId,
        heartRate: result.bpm,
        hrvMs: result.hrvMs,
        status: result.status,
        signalQuality: result.quality,
        note: usedDemo ? 'Demo signal path — on-device filter still applied' : 'Fingertip PPG',
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.screen}>
        <Text style={styles.help}>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Camera access</Text>
        <Text style={styles.help}>
          Needed for fingertip pulse capture. Processing stays on this phone. You can still run a
          demo signal if the camera is unavailable.
        </Text>
        <PrimaryButton label="Allow camera" onPress={() => requestPermission()} />
        <PrimaryButton label="Run 12s demo signal" tone="muted" onPress={() => runScan('demo')} />
      </View>
    );
  }

  if (phase === 'result' && result) {
    return (
      <View style={styles.screen}>
        <View style={styles.resultCard}>
          <Text style={styles.kicker}>{patient?.name ?? 'Patient'}</Text>
          <Text style={styles.bpm}>{result.bpm || '—'}</Text>
          <Text style={styles.bpmUnit}>BPM estimated heart rate</Text>
          <StatusBadge status={result.bpm ? result.status : null} />
          <Text style={styles.help}>
            HRV {result.hrvMs || '—'} ms · signal quality {Math.round(result.quality * 100)}% ·{' '}
            {result.peakCount} peaks
          </Text>
          {usedDemo ? (
            <Text style={styles.warn}>
              Demo waveform used. Same bandpass + peak logic as a live capture — not a live fingertip.
            </Text>
          ) : null}
          {!result.bpm ? (
            <Text style={styles.warn}>
              Weak pulse signal. Cover the lens fully, hold still, and keep the torch glowing red through the fingertip.
            </Text>
          ) : null}
        </View>
        <Waveform values={result.filtered.slice(-48)} />
        <DisclaimerBanner />
        <PrimaryButton label="Save to patient record" onPress={onSave} loading={saving} disabled={!result.bpm} />
        <PrimaryButton label="Scan again" tone="muted" onPress={() => setPhase('ready')} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={phase === 'scanning'}
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.overlay}>
        <View style={styles.guide}>
          <View style={styles.ring} />
          <Text style={styles.guideTitle}>
            {phase === 'scanning' ? `Hold steady… ${remaining}s remaining` : 'Place fingertip on rear camera lens'}
          </Text>
          <Text style={styles.guideBody}>
            Cover the camera completely. The torch stays on. Keep still for 12 seconds. All math runs on this device.
          </Text>
        </View>
        <Waveform values={liveTrace} />
        {phase === 'scanning' ? (
          <View style={styles.progressWrap}>
            <View style={[styles.progress, { width: `${((12 - remaining) / 12) * 100}%` }]} />
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            <PrimaryButton
              label={cameraReady ? 'Start 12-second scan' : 'Warming up camera…'}
              onPress={() => runScan('camera')}
              disabled={!cameraReady}
            />
            <PrimaryButton label="Demo signal (no fingertip)" tone="muted" onPress={() => runScan('demo')} />
          </View>
        )}
        {phase === 'scanning' ? (
          <Pressable
            onPress={() => {
              runningRef.current = false;
              setPhase('ready');
            }}
            style={styles.cancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function Waveform({ values }: { values: number[] }) {
  if (values.length < 2) {
    return <View style={styles.waveEmpty} />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(0.001, max - min);
  return (
    <View style={styles.wave}>
      {values.map((v, i) => (
        <View
          key={i}
          style={[styles.waveBar, { height: `${Math.max(8, ((v - min) / span) * 100)}%` }]}
        />
      ))}
    </View>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.md, gap: 14 },
  center: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, justifyContent: 'center', gap: 16 },
  camera: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
    gap: 12,
    backgroundColor: 'rgba(4,16,20,0.28)',
  },
  guide: {
    backgroundColor: colors.overlay,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 8,
  },
  ring: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: colors.accent,
    backgroundColor: 'rgba(46,230,166,0.12)',
  },
  guideTitle: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  guideBody: { color: colors.muted, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  progressWrap: {
    height: 10,
    borderRadius: 8,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  progress: { height: '100%', backgroundColor: colors.accent },
  cancel: { alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  cancelText: { color: colors.white, fontWeight: '800', fontSize: 16 },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kicker: { color: colors.accent, fontWeight: '800' },
  bpm: { color: colors.text, fontSize: type.huge, fontWeight: '800', lineHeight: 70 },
  bpmUnit: { color: colors.muted, fontSize: 16 },
  help: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  title: { color: colors.text, fontSize: type.h1, fontWeight: '800' },
  warn: { color: colors.warning, textAlign: 'center', fontSize: 13, lineHeight: 18 },
  wave: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 8,
    overflow: 'hidden',
  },
  waveEmpty: { height: 8 },
  waveBar: { flex: 1, backgroundColor: colors.accent, borderRadius: 2, minHeight: 4 },
});
