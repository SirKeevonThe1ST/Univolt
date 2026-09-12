import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChildChrome } from "@/components/child-chrome";
import { useDemoStore } from "@/lib/demo/store";

export const Route = createFileRoute("/support")({ component: SupportPage });

function SupportPage() {
  const open = useDemoStore((s) => s.openSupport);
  useEffect(() => {
    open(true);
  }, [open]);
  return (
    <ChildChrome>
      <h1 className="font-display text-3xl font-medium tracking-tight">I don’t feel safe</h1>
      <p className="mt-3 max-w-xl text-ink-soft leading-relaxed">
        You are not in trouble. You can ask for help. You do not have to figure this out alone.
      </p>
    </ChildChrome>
  );
}
