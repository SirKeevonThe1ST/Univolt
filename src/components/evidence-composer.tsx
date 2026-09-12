import { useRef, useState } from "react";
import { FileText, ImagePlus, Mic, Plus, Type } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/input";
import { ScreenshotUploader, type Shot } from "./screenshot-uploader";
import { VoiceRecorder, type VoiceNote } from "./voice-recorder";
import { OcrReview } from "./ocr-review";
import { extractScreenshots, transcribeVoice } from "@/lib/server/ai";
import { parseConversation, combineMessageLists } from "@/lib/ai/parse-conversation";
import type { DemoMessage } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

export type EvidenceBundle = {
  messages: DemoMessage[];
  images: { name: string; dataUrl: string }[];
  transcriptionNote?: string;
  isSynthetic: boolean;
};

type Tab = "paste" | "shots" | "file" | "voice";

const PLACEHOLDER = `Paste an entire conversation here...
Example:
OTHER:
hey how old are you?
CHILD:
why do you want to know?
OTHER:
what school do you go to?
OTHER:
do your parents check your phone?
OTHER:
don't tell them we're talking
OTHER:
send me a picture`;

export function EvidenceComposer({
  onAnalyze,
  analyzing,
  initialText,
}: {
  onAnalyze: (bundle: EvidenceBundle) => void;
  analyzing?: boolean;
  initialText?: string;
}) {
  const [tab, setTab] = useState<Tab>("paste");
  const [paste, setPaste] = useState(initialText ?? "");
  const [extraPastes, setExtraPastes] = useState<string[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [fileTexts, setFileTexts] = useState<{ name: string; text: string }[]>([]);
  const [voice, setVoice] = useState<VoiceNote | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [sttUnavailable, setSttUnavailable] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [ocrMessages, setOcrMessages] = useState<DemoMessage[] | null>(null);
  const [ocrLow, setOcrLow] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [synthetic, setSynthetic] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onTranscribe(note: VoiceNote) {
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

  async function extractShots() {
    if (!shots.length) return;
    setExtracting(true);
    setOcrError(null);
    try {
      const res = await extractScreenshots({
        data: { images: shots.map((s) => ({ name: s.name, dataUrl: s.dataUrl })) },
      });
      if (!res.ok) {
        setOcrError(res.error);
        return;
      }
      setOcrLow(res.extract.low_confidence || res.extract.ocr_confidence < 0.55);
      setOcrMessages(
        res.extract.messages.map((m) => ({
          speaker: m.speaker,
          text: m.text,
          source: "screenshot" as const,
          sourceLabel: m.source_label || "Screenshot",
        })),
      );
    } catch (e) {
      setOcrError(e instanceof Error ? e.message : "Could not extract text from screenshots.");
    } finally {
      setExtracting(false);
    }
  }

  async function onFile(files: FileList | null) {
    if (!files) return;
    const next: { name: string; text: string }[] = [];
    for (const file of [...files]) {
      if (!/\.(txt|md|csv|json)$/i.test(file.name) && file.type && !file.type.startsWith("text/")) {
        continue;
      }
      next.push({ name: file.name, text: await file.text() });
    }
    setFileTexts((prev) => [...prev, ...next]);
    setSynthetic(false);
  }

  function collectMessages(): DemoMessage[] {
    const lists: DemoMessage[][] = [];
    if (paste.trim()) lists.push(parseConversation(paste, "Pasted text"));
    for (const extra of extraPastes) {
      if (extra.trim()) lists.push(parseConversation(extra, "Pasted text"));
    }
    for (const f of fileTexts) lists.push(parseConversation(f.text, f.name));
    if (ocrMessages?.length) lists.push(ocrMessages);
    if (transcription?.trim()) {
      lists.push([{ speaker: "child", text: transcription.trim(), source: "voice", sourceLabel: "Voice note" }]);
    }
    return combineMessageLists(lists);
  }

  function analyzeNow(messages = collectMessages()) {
    onAnalyze({
      messages,
      images: shots.map((s) => ({ name: s.name, dataUrl: s.dataUrl })),
      transcriptionNote: voice
        ? transcription
          ? undefined
          : "Voice note attached. Automatic transcription unavailable."
        : undefined,
      isSynthetic: synthetic,
    });
  }

  const tabs: { id: Tab; label: string; icon: typeof Type }[] = [
    { id: "paste", label: "Paste conversation", icon: Type },
    { id: "shots", label: "Upload screenshots", icon: ImagePlus },
    { id: "file", label: "Upload file", icon: FileText },
    { id: "voice", label: "Voice note", icon: Mic },
  ];

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Conversation evidence</p>
      <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">Add evidence</h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Add messages, screenshots, voice notes, or an exported conversation for safety analysis.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button key={t.id} type="button" size="sm" variant={tab === t.id ? "default" : "outline"} onClick={() => setTab(t.id)}>
            <t.icon /> {t.label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setTab("paste");
            setExtraPastes((p) => [...p, ""]);
          }}
        >
          <Plus /> Add another source
        </Button>
      </div>

      <div className="mt-4">
        {tab === "paste" && (
          <div className="space-y-3">
            <Textarea
              className="min-h-56 font-mono text-sm"
              value={paste}
              placeholder={PLACEHOLDER}
              onChange={(e) => {
                setPaste(e.target.value);
                setSynthetic(false);
              }}
            />
            {extraPastes.map((text, i) => (
              <Textarea
                key={i}
                className="min-h-32 font-mono text-sm"
                value={text}
                placeholder={`Additional source ${i + 2}…`}
                onChange={(e) =>
                  setExtraPastes((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))
                }
              />
            ))}
          </div>
        )}
        {tab === "shots" && (
          <div className="space-y-3">
            <ScreenshotUploader shots={shots} onChange={(s) => { setShots(s); setSynthetic(false); setOcrMessages(null); }} />
            {shots.length > 0 && !ocrMessages && (
              <Button type="button" variant="outline" disabled={extracting} onClick={() => void extractShots()}>
                {extracting ? "Extracting text…" : "Reconstruct conversation"}
              </Button>
            )}
            {ocrError && <p className="text-sm text-danger">{ocrError}</p>}
          </div>
        )}
        {tab === "file" && (
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.csv,.json,text/plain"
              multiple
              className="sr-only"
              onChange={(e) => void onFile(e.target.files)}
            />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              <FileText /> Choose exported conversation
            </Button>
            {fileTexts.map((f) => (
              <p key={f.name} className="text-xs text-muted">
                Loaded {f.name} ({f.text.length} characters)
              </p>
            ))}
          </div>
        )}
        {tab === "voice" && (
          <VoiceRecorder
            note={voice}
            onChange={(n) => {
              setVoice(n);
              if (!n) {
                setTranscription(null);
                setSttUnavailable(false);
              }
            }}
            onTranscribe={(n) => void onTranscribe(n)}
            transcription={transcription}
            transcribing={transcribing}
            transcriptionUnavailable={sttUnavailable}
          />
        )}
      </div>

      {ocrMessages && (
        <div className="mt-5">
          <OcrReview
            messages={ocrMessages}
            onChange={setOcrMessages}
            lowConfidence={ocrLow}
            busy={analyzing}
            onConfirm={() => analyzeNow()}
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          disabled={analyzing}
          onClick={() => analyzeNow()}
          className={cn(analyzing && "opacity-80")}
        >
          {analyzing ? "Analyzing evidence…" : "Analyze evidence"}
        </Button>
        <p className="text-xs text-muted">AI-assisted, human-controlled. Nothing is sent to authorities.</p>
      </div>
    </section>
  );
}

export function applyInitialText(text: string, synthetic: boolean) {
  return { text, synthetic };
}
