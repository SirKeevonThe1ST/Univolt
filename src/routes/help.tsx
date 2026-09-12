import { createFileRoute } from "@tanstack/react-router";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export const Route = createFileRoute("/help")({ component: Help });

function Help() {
  const { t } = useI18n();
  return (
    <ChildChrome>
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl font-medium tracking-tight">{t("helpTitle")}</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">{t("helpLead")}</p>
        <a
          href="tel:1098"
          className="mt-8 flex items-center justify-between rounded-xl bg-ink px-6 py-6 text-paper"
        >
          <span className="text-sm">{t("childline")}</span>
          <span className="font-display text-4xl tabular-nums">1098</span>
        </a>
        <p className="mt-6 text-sm text-ink-soft">{t("panicHint")}</p>
        <div className="mt-8">
          <Button asChild variant="outline">
            <a href="https://www.childlineindia.org" rel="noreferrer">
              childlineindia.org
            </a>
          </Button>
        </div>
      </div>
    </ChildChrome>
  );
}
