import { Eye, HeartHandshake, Shield, Waypoints, TrendingUp } from "lucide-react";
import { HumanLoopMark } from "./sim-mark";

const STEPS = [
  {
    n: "01",
    title: "Detect",
    body: "AI identifies suspicious behavioural patterns across conversations — not just flagged words.",
    icon: Eye,
  },
  {
    n: "02",
    title: "Understand",
    body: "The system explains why the pattern may be concerning, in language a responder can review.",
    icon: Waypoints,
  },
  {
    n: "03",
    title: "Predict",
    body: "A simulated risk trajectory shows whether the pattern is escalating — before harm reaches a final stage.",
    icon: TrendingUp,
  },
  {
    n: "04",
    title: "Protect",
    body: "The child receives a calm, private way to seek help. Identity stays sealed by default.",
    icon: Shield,
  },
  {
    n: "05",
    title: "Human intervention",
    body: "A trained human reviews the case and decides what happens next. The model never acts alone.",
    icon: HeartHandshake,
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium tracking-wide text-teal">How it works</p>
          <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Detect → Understand → Predict → Protect → Intervene
          </h2>
        </div>
        <HumanLoopMark />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <article
              key={s.title}
              className="sn-rise rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tabular-nums text-muted">{s.n}</span>
                <span className="flex size-9 items-center justify-center rounded-lg bg-teal-mist text-teal-deep">
                  <Icon className="size-4" />
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
