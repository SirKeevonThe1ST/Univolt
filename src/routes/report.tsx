import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mic, Paperclip } from "lucide-react";
import { ChildChrome } from "@/components/child-chrome";
import { SeverityPicker } from "@/components/severity-picker";
import { Button } from "@/components/ui/button";
import { Label, Textarea, Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n-provider";
import { submitAnonymousReport } from "@/lib/server/report";
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
  const [severity, setSeverity] = useState(2);
  const [text, setText] = useState("");
  const [callback, setCallback] = useState(false);
  const [contact, setContact] = useState("");
  const [region, setRegion] = useState("");
  const [screenshot, setScreenshot] = useState(false);
  const [voice, setVoice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitAnonymousReport({
        data: {
          text,
          severity,
          callback,
          contact: callback ? contact : undefined,
          region: region || null,
          screenshot,
          voice,
        },
      });
      await navigate({
        to: "/report/done",
        search: { id: res.publicId },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
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
            variant={screenshot ? "default" : "outline"}
            onClick={() => setScreenshot((v) => !v)}
          >
            <Paperclip /> {t("attachPhoto")}
          </Button>
          <Button
            type="button"
            variant={voice ? "default" : "outline"}
            onClick={() => setVoice((v) => !v)}
          >
            <Mic /> {t("attachVoice")}
          </Button>
        </div>
        {screenshot && <p className="text-xs text-muted">{t("screenshotStub")}</p>}
        {voice && <p className="text-xs text-muted">{t("voiceStub")}</p>}

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Toggle
              selected={!callback}
              onClick={() => setCallback(false)}
              label={t("stayAnon")}
            />
            <Toggle
              selected={callback}
              onClick={() => setCallback(true)}
              label={t("wantCallback")}
            />
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

        {error && <p className="text-sm text-danger">{error}</p>}

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
