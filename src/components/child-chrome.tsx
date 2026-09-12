import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Wordmark } from "./logo";
import { Button } from "./ui/button";
import { LangSwitcher } from "./lang-switcher";
import { useI18n } from "./i18n-provider";
import { installPanicHotkey, triggerSafeExit } from "./safe-exit";

export function ChildChrome({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  useEffect(() => installPanicHotkey(), []);

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-border/80 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/" aria-label="SurakshaNet home">
            <Wordmark />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LangSwitcher compact />
            <Button variant="exit" size="md" type="button" onClick={triggerSafeExit}>
              {t("safeExit")}
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>

      <div className="sticky bottom-0 z-30 border-t border-border bg-ink text-paper">
        <a
          href="tel:1098"
          className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm">
            <Phone className="size-4" />
            {t("childline")}
          </span>
          <span className="font-display text-2xl tabular-nums tracking-wide">
            {t("childlineNum")}
          </span>
        </a>
      </div>
    </div>
  );
}
