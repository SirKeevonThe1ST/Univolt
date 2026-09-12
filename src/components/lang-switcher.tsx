import { LOCALES } from "@/lib/i18n/dictionaries";
import { useI18n } from "./i18n-provider";
import { cn } from "@/lib/utils";

export function LangSwitcher({ compact }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      {!compact && <span className="hidden sm:inline">{t("lang")}</span>}
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className={cn(
          "h-10 rounded-xl border border-border bg-surface px-2 text-sm text-ink outline-none focus:ring-2 focus:ring-teal/30",
        )}
        aria-label={t("lang")}
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
