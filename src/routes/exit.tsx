import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { triggerSafeExit } from "@/components/safe-exit";

export const Route = createFileRoute("/exit")({ component: Exit });

function Exit() {
  useEffect(() => {
    triggerSafeExit();
  }, []);
  return (
    <main className="grid min-h-dvh place-items-center bg-paper text-ink">
      <p className="text-sm text-muted">Leaving…</p>
    </main>
  );
}
