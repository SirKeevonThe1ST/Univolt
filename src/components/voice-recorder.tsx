import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, RotateCcw, Square, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { blobToBase64, formatClock } from "@/lib/ai/media-client";

const MAX_SEC = 120;

export type VoiceNote = {
  blob: Blob;
  mime: string;
  durationSec: number;
  objectUrl: string;
  base64: string;
};

export function VoiceRecorder({
  note,
  onChange,
  onTranscribe,
  transcription,
  transcribing,
  transcriptionUnavailable,
}: {
  note: VoiceNote | null;
  onChange: (next: VoiceNote | null) => void;
  onTranscribe?: (note: VoiceNote) => void;
  transcription?: string | null;
  transcribing?: boolean;
  transcriptionUnavailable?: boolean;
}) {
  const [supported, setSupported] = useState(true);
  const [phase, setPhase] = useState<"idle" | "recording" | "recorded" | "playing">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setSupported(false);
    }
    return () => stopTracks();
  }, []);

  useEffect(() => {
    if (note && phase === "idle") setPhase("recorded");
    if (!note && phase !== "recording") setPhase("idle");
  }, [note, phase]);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stopTracks();
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const base64 = await blobToBase64(blob);
        const objectUrl = URL.createObjectURL(blob);
        const next: VoiceNote = {
          blob,
          mime: blob.type,
          durationSec: elapsedRef.current,
          objectUrl,
          base64,
        };
        onChange(next);
        setPhase("recorded");
        onTranscribe?.(next);
      };
      recRef.current = rec;
      elapsedRef.current = 0;
      setElapsed(0);
      rec.start(200);
      setPhase("recording");
      timerRef.current = window.setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
        if (elapsedRef.current >= MAX_SEC) stop();
      }, 1000);
    } catch {
      setError("Microphone permission was denied. You can still type your report.");
      setPhase("idle");
    }
  }

  const elapsedRef = useRef(0);

  function stop() {
    recRef.current?.stop();
    recRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  function cancel() {
    recRef.current?.stop();
    recRef.current = null;
    stopTracks();
    chunksRef.current = [];
    setPhase("idle");
    setElapsed(0);
    onChange(null);
  }

  function remove() {
    if (note?.objectUrl) URL.revokeObjectURL(note.objectUrl);
    onChange(null);
    setPhase("idle");
    setElapsed(0);
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (phase === "playing") {
      el.pause();
      setPhase("recorded");
    } else {
      void el.play();
      setPhase("playing");
    }
  }

  if (!supported) {
    return (
      <p className="rounded-xl border border-border bg-paper px-4 py-3 text-sm text-ink-soft">
        Voice recording is not supported on this browser. You can continue by typing your report.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-paper p-4">
      {phase === "idle" && (
        <Button type="button" variant="outline" onClick={() => void start()}>
          <Mic /> Record a voice note
        </Button>
      )}
      {phase === "recording" && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-danger">
            <span className="size-2.5 animate-pulse rounded-full bg-danger" />
            Recording
          </span>
          <span className="font-mono text-sm tabular-nums">
            {formatClock(elapsed)} / {formatClock(MAX_SEC)}
          </span>
          <Button type="button" size="sm" onClick={stop}>
            <Square className="size-3.5" /> Stop
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={cancel}>
            Cancel
          </Button>
        </div>
      )}
      {(phase === "recorded" || phase === "playing") && note && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Voice note recorded</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm tabular-nums">{formatClock(note.durationSec)}</span>
            <Button type="button" size="sm" variant="outline" onClick={togglePlay}>
              {phase === "playing" ? <Pause /> : <Play />} {phase === "playing" ? "Pause" : "Play"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                remove();
                void start();
              }}
            >
              <RotateCcw /> Re-record
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={remove}>
              <Trash2 /> Delete
            </Button>
          </div>
          <audio
            ref={audioRef}
            src={note.objectUrl}
            onEnded={() => setPhase("recorded")}
            className="hidden"
          />
          {transcribing && <p className="text-xs text-muted">Transcribing…</p>}
          {transcription && (
            <div className="rounded-lg bg-surface px-3 py-2 text-sm text-ink-soft">
              <p className="text-[11px] uppercase tracking-wide text-muted">Voice transcription</p>
              <p className="mt-1">“{transcription}”</p>
            </div>
          )}
          {transcriptionUnavailable && (
            <p className="text-xs text-muted">Voice note attached. Automatic transcription unavailable.</p>
          )}
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function pickMime(): string | undefined {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
}
