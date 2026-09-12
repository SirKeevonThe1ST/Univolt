import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Lock, Phone, ShieldCheck } from "lucide-react";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t } = useI18n();
  return (
    <ChildChrome>
      <section className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-teal">Childline 1098 is always one tap away</p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-[1.12] tracking-tight text-ink sm:text-5xl">
          {t("tagline")}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {t("landingLead")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="xl" asChild>
            <Link to="/report">
              {t("childPath")}
              <ArrowRight />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link to="/help">
              <Phone className="size-4" />
              {t("childline")} · 1098
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        <QuietCard
          icon={<Lock className="size-4" />}
          title="No name needed"
          body="Anonymous tips store no IP, email, or device id. Callback numbers are sealed and opened only with a supervisor’s confirm."
        />
        <QuietCard
          icon={<ShieldCheck className="size-4" />}
          title="Leave in one tap"
          body="Leave quickly sits on every child screen. Esc twice, or Ctrl+Shift+X, also steps away and covers your tracks."
        />
        <QuietCard
          icon={<Phone className="size-4" />}
          title="A person decides"
          body="The model scores and explains. It never escalates, unseals, or closes a case. A human must confirm."
        />
      </section>

      <section className="mt-14 rounded-xl border border-border bg-surface px-5 py-6 sm:px-8">
        <p className="text-sm font-medium text-muted">For responders</p>
        <p className="mt-2 max-w-xl text-ink-soft">{t("landingStaff")}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="invert" asChild>
            <Link to="/login">{t("signIn")}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/detect">{t("howItWorks")}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/privacy">{t("privacy")}</Link>
          </Button>
        </div>
      </section>
      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">{t("footerLegal")}</p>
    </ChildChrome>
  );
}

function QuietCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-teal-mist text-teal-deep">
        {icon}
      </div>
      <h2 className="mt-4 font-display text-lg font-medium">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </article>
  );
}
