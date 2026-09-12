import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Lock, Phone, ShieldCheck } from "lucide-react";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { HowItWorks } from "@/components/how-it-works";
import { HumanLoopMark, SimMark } from "@/components/sim-mark";
import { SimulationLauncher } from "@/components/simulation-overlay";
import { PrivacyFlow } from "@/components/privacy-flow";
import { ResponsibleAi } from "@/components/responsible-ai";
import { useDemoStore } from "@/lib/demo/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t } = useI18n();
  const openSupport = useDemoStore((s) => s.openSupport);
  const unlock = useDemoStore((s) => s.unlockDesk);

  return (
    <ChildChrome>
      <section className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium tracking-wide text-teal">Childline 1098 is always one tap away</p>
          <HumanLoopMark />
        </div>
        <h1 className="mt-4 font-display text-4xl font-medium leading-[1.12] tracking-tight text-ink sm:text-5xl">
          Don’t wait for a child to report harm after it happens.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          An AI-powered early-warning system: detect behavioural escalation, explain the concern, protect identity, and leave the decision with a human.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("landingLead")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button size="xl" asChild>
            <Link to="/report">
              {t("childPath")}
              <ArrowRight />
            </Link>
          </Button>
          <Button size="xl" variant="outline" type="button" onClick={() => openSupport(true)}>
            I don’t feel safe
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link to="/help">
              <Phone className="size-4" />
              {t("childline")} · 1098
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-ink px-5 py-6 text-paper sm:px-8">
        <p className="text-xs font-medium uppercase tracking-wide text-paper/55">Two-minute judge walkthrough</p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
          See the full safety loop
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/75">
          Detect → Understand → Predict → Protect → Human review → Intervene. Synthetic case {""}
          <span className="font-mono">SRK-DEMO-2048</span>. The model never acts alone.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <SimulationLauncher className="bg-paper text-ink hover:bg-paper-2" />
          <Button variant="outline" className="border-paper/30 bg-transparent text-paper hover:bg-paper/10" asChild>
            <Link to="/intelligence">Safety intelligence</Link>
          </Button>
        </div>
      </section>

      <HowItWorks />

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

      <section className="mt-14">
        <PrivacyFlow compact />
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-2">
        <ResponsibleAi />
        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-medium text-muted">For responders</p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">Child Safety Response Center</h2>
          <p className="mt-2 text-ink-soft">{t("landingStaff")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="invert"
              onClick={() => {
                unlock();
              }}
              asChild
            >
              <Link to="/console">Open demo desk</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">{t("signIn")}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/detect">{t("howItWorks")}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/privacy">{t("privacy")}</Link>
            </Button>
          </div>
          <div className="mt-4">
            <SimMark>Demo desk uses synthetic cases. Sign-in still reaches the live queue.</SimMark>
          </div>
        </article>
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
