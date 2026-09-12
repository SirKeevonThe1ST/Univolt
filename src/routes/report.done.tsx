import { createFileRoute, Link } from "@tanstack/react-router";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { z } from "zod";

export const Route = createFileRoute("/report/done")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: Done,
});

function Done() {
  const { t } = useI18n();
  const { id } = Route.useSearch();
  return (
    <ChildChrome>
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl font-medium tracking-tight">{t("doneTitle")}</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">{t("doneBody")}</p>
        {id && (
          <div className="mt-6 rounded-xl border border-border bg-surface px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted">{t("caseId")}</p>
            <p className="mt-1 font-mono text-xl tracking-wider text-ink">{id}</p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="tel:1098">1098</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/report">{t("another")}</Link>
          </Button>
        </div>
      </div>
    </ChildChrome>
  );
}
