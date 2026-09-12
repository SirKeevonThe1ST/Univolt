import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/demo/store";

const ADULTS = [
  { id: "parent" as const, label: "Parent / Guardian" },
  { id: "teacher" as const, label: "Teacher" },
  { id: "counsellor" as const, label: "School counsellor" },
  { id: "relative" as const, label: "Relative" },
  { id: "other" as const, label: "Other trusted adult" },
];

export const Route = createFileRoute("/trusted-adult")({ component: TrustedAdult });

function TrustedAdult() {
  const chosen = useDemoStore((s) => s.trustedAdult);
  const setAdult = useDemoStore((s) => s.setTrustedAdult);
  const create = useDemoStore((s) => s.createChildCase);
  const choice = useDemoStore((s) => s.supportChoice);
  const navigate = useNavigate();

  return (
    <ChildChrome>
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-medium text-teal">You choose who you trust</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">A trusted adult</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          You do not have to disclose everything immediately. This only records who you might want nearby.
          Nothing is sent to them automatically.
        </p>
        <div className="mt-6 grid gap-2">
          {ADULTS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAdult(a.id)}
              className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                chosen === a.id ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-surface"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Button
            disabled={!chosen}
            onClick={() => {
              const c = create(choice ?? "help");
              void navigate({ to: "/report/done", search: { id: c.publicId } });
            }}
          >
            Continue privately
          </Button>
          <Button variant="outline" asChild>
            <Link to="/report">Skip — share something instead</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted">
          A responder will still need to confirm any contact. The model cannot reach out on its own.
        </p>
      </div>
    </ChildChrome>
  );
}
