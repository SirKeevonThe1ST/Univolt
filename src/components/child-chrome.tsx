import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Wordmark } from "./logo";
import { Button } from "./ui/button";
import { LangSwitcher } from "./lang-switcher";
import { useI18n } from "./i18n-provider";
import { installPanicHotkey, triggerSafeExit } from "./safe-exit";
import { SupportPanel } from "./support-panel";
import { useDemoStore } from "@/lib/demo/store";

export function ChildChrome({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const openSupport = useDemoStore((s) => s.openSupport);

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
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" aria-label="SurakshaNet home">
            <Wordmark />
          </Link>
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            <Link to="/intelligence" className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink">
              Intelligence
            </Link>
            <Link to="/india" className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink">
              India map
            </Link>
            <Link to="/impact" className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink">
              Impact
            </Link>
            <Link to="/privacy" className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink">
              Privacy
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              type="button"
              className="hidden sm:inline-flex"
              onClick={() => openSupport(true)}
            >
              I don’t feel safe
            </Button>
            <LangSwitcher compact />
            <Button variant="exit" size="md" type="button" onClick={triggerSafeExit}>
              {t("safeExit")}
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>

      <div className="sticky bottom-0 z-30 border-t border-border bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="tel:1098" className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm">
              <Phone className="size-4" />
              {t("childline")}
            </span>
            <span className="font-display text-2xl tabular-nums tracking-wide">{t("childlineNum")}</span>
          </a>
          <Button
            size="sm"
            variant="outline"
            className="border-paper/30 bg-transparent text-paper hover:bg-paper/10 sm:hidden"
            type="button"
            onClick={() => openSupport(true)}
          >
            I don’t feel safe
          </Button>
        </div>
      </div>
      <SupportPanel />
    </div>
  );
}
