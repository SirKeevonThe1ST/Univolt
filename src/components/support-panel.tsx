import { Link, useNavigate } from "@tanstack/react-router";
import { Phone, X } from "lucide-react";
import { Button } from "./ui/button";
import { useDemoStore } from "@/lib/demo/store";
import type { ReactNode } from "react";

const OPTIONS = [
  { id: "help" as const, label: "I want help" },
  { id: "talk" as const, label: "I want to talk to someone" },
  { id: "report" as const, label: "I want to report something" },
  { id: "danger" as const, label: "I am in immediate danger" },
  { id: "unsure" as const, label: "I am not sure what is happening" },
];

export function SupportPanel() {
  const open = useDemoStore((s) => s.supportOpen);
  const choice = useDemoStore((s) => s.supportChoice);
  const setChoice = useDemoStore((s) => s.setSupportChoice);
  const close = useDemoStore((s) => s.openSupport);
  const create = useDemoStore((s) => s.createChildCase);
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/30 p-3 sm:items-center">
      <div
        role="dialog"
        aria-labelledby="support-title"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-teal">You are not in trouble</p>
            <h2 id="support-title" className="mt-1 font-display text-2xl font-medium tracking-tight">
              I don’t feel safe
            </h2>
          </div>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg hover:bg-paper-2"
            onClick={() => close(false)}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          You can ask for help. You do not have to figure this out alone. You do not have to give your name.
        </p>
        <div className="mt-5 grid gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setChoice(o.id)}
              className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                choice === o.id ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-paper"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {choice === "danger" && (
          <CalmBox>
            <p className="text-sm font-medium">If you are in danger right now</p>
            <p className="mt-1 text-sm text-ink-soft">
              Call Childline. It is free. A person will answer. This app will not call anyone for you.
            </p>
            <a
              href="tel:1098"
              className="mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-paper"
            >
              <span className="flex items-center gap-2 text-sm">
                <Phone className="size-4" /> Talk to someone now
              </span>
              <span className="font-display text-2xl tabular-nums">1098</span>
            </a>
          </CalmBox>
        )}

        {choice && choice !== "danger" && (
          <CalmBox>
            <p className="text-sm text-ink-soft">
              {choice === "report"
                ? "You can write as little or as much as you want. A person will look at it."
                : "A trained person can look at this. You stay anonymous unless you choose otherwise."}
            </p>
          </CalmBox>
        )}

        {choice && (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {choice === "report" ? (
              <Button
                className="flex-1"
                onClick={() => {
                  close(false);
                  void navigate({ to: "/report" });
                }}
              >
                Continue to share
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={() => {
                  const c = create(choice);
                  void navigate({ to: "/report/done", search: { id: c.publicId } });
                }}
              >
                Ask for help privately
              </Button>
            )}
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/trusted-adult" onClick={() => close(false)}>
                Choose a trusted adult
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function CalmBox({ children }: { children: ReactNode }) {
  return <div className="mt-4 rounded-xl bg-teal-mist/60 px-4 py-3">{children}</div>;
}
