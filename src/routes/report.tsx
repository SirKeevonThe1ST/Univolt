import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ChildChrome } from "@/components/child-chrome";
import { SeverityPicker } from "@/components/severity-picker";
import { Button } from "@/components/ui/button";
import { Label, Textarea, Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n-provider";
import { submitAnonymousReport } from "@/lib/server/report";
import { analyzeEvidence } from "@/lib/server/ai";
import { useDemoStore } from "@/lib/demo/store";
import { ScreenshotUploader, type Shot } from "@/components/screenshot-uploader";
import { VoiceRecorder, type VoiceNote } from "@/components/voice-recorder";
import { transcribeVoice } from "@/lib/server/ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({ component: Report });

const STATES = [
  "AN", "AP", "AR", "AS", "BR", "CH", "CT", "DL", "GA", "GJ", "HP", "HR",
  "JH", "JK", "KA", "KL", "LA", "LD", "MH", "ML", "MN", "MP", "MZ", "NL",
  "OD", "PB", "PY", "RJ", "SK", "TN", "TS", "TR", "UK", "UP", "WB",
];

function Report() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const ingest = useDemoStore((s) => s.ingestChildReport);
  const [severity, setSeverity] = useState(2);
  const [text, setText] = useState("");
  const [callback, setCallback] = useState(false);
  const [contact, setContact] = useState("");
  const [region, setRegion] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [voice, setVoice] = useState<VoiceNote | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [sttUnavailable, setSttUnavailable] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showShots, setShowShots] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranscribe(note: VoiceNote) {
    setTranscribing(true);
    setSttUnavailable(false);
    try {
      const res = await transcribeVoice({ data: { base64: note.base64, mime: note.mime } });
      if (res.ok) setTranscription(res.text);
      else {
        setSttUnavailable(true);
        setTranscription(null);
      }
    } catch {
      setSttUnavailable(true);
    } finally {
      setTranscribing(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const combined = [text.trim(), transcription ? `Voice: ${transcription}` : ""].filter(Boolean).join("\n");
      const res = await submitAnonymousReport({
        data: {
          text: combined,
          severity,
          callback,
          contact: callback ? contact : undefined,
          region: region || null,
          screenshot: shots.length > 0,
          voice: Boolean(voice),
        },
      });

      let analysis = null;
      if (combined) {
        const ai = await analyzeEvidence({
          data: {
            messages: [{ speaker: "child", text: combined, source: "paste", sourceLabel: "Child report" }],
            images: shots.map((s) => ({ name: s.name, dataUrl: s.dataUrl })),
            transcriptionNote: voice && !transcription ? "Voice note attached. Automatic transcription unavailable." : undefined,
          },
        });
        if (ai.ok) analysis = ai.result;
      }

      ingest({
        text: combined || `Severity ${severity} — no written note.`,
        analysis,
        screenshots: shots.map((s) => ({ name: s.name, dataUrl: s.dataUrl })),
        voice: voice
          ? { durationSec: voice.durationSec, mime: voice.mime, transcription: transcription ?? undefined }
          : undefined,
        region: region || undefined,
        anonymous: !callback,
      });

      await navigate({
        to: "/report/done",
        search: { id: res.publicId },
      });
    } catch {
      setError("We couldn't send this right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ChildChrome>
      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-8">
        <header>
          <h1 className="font-display text-3xl font-medium tracking-tight">{t("reportTitle")}</h1>
          <p className="mt-3 text-ink-soft leading-relaxed">{t("reportLead")}</p>
        </header>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-ink">{t("feelTitle")}</legend>
          <SeverityPicker value={severity} onChange={setSeverity} />
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="what">{t("whatHappened")}</Label>
          <Textarea
            id="what"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            maxLength={4000}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant={showShots || shots.length ? "default" : "outline"}
            onClick={() => setShowShots((v) => !v)}
          >
            {t("attachPhoto")}
            {shots.length > 0 ? ` · ${shots.length}` : ""}
          </Button>
          <Button
            type="button"
            variant={showVoice || voice ? "default" : "outline"}
            onClick={() => setShowVoice((v) => !v)}
          >
            {t("attachVoice")}
            {voice ? " · recorded" : ""}
          </Button>
        </div>

        {showShots && <ScreenshotUploader shots={shots} onChange={setShots} compact />}
        {showVoice && (
          <VoiceRecorder
            note={voice}
            onChange={(n) => {
              setVoice(n);
              if (!n) {
                setTranscription(null);
                setSttUnavailable(false);
              }
            }}
            onTranscribe={(n) => void handleTranscribe(n)}
            transcription={transcription}
            transcribing={transcribing}
            transcriptionUnavailable={sttUnavailable}
          />
        )}

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Toggle selected={!callback} onClick={() => setCallback(false)} label={t("stayAnon")} />
            <Toggle selected={callback} onClick={() => setCallback(true)} label={t("wantCallback")} />
          </div>
          {callback && (
            <div className="space-y-2">
              <p className="text-xs text-muted">{t("callbackHint")}</p>
              <Label htmlFor="contact">{t("contactLabel")}</Label>
              <Input
                id="contact"
                inputMode="tel"
                autoComplete="off"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required={callback}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">{t("regionLabel")}</Label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-paper px-3 text-base"
          >
            <option value="">{t("regionSkip")}</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="space-y-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-center">
            <p className="text-sm font-medium text-danger">{error}</p>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-xs"
              disabled={busy}
            >
              Try again
            </Button>
          </div>
        )}

        <Button type="submit" size="xl" className="w-full" disabled={busy}>
          {busy ? t("sending") : t("send")}
        </Button>
        <p className="text-xs text-muted">{t("panicHint")}</p>
      </form>
    </ChildChrome>
  );
}

function Toggle({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-xl border px-3 py-2 text-sm font-medium",
        selected ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-paper",
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
