import { createFileRoute } from "@tanstack/react-router";
import { ChildChrome } from "@/components/child-chrome";
import { IndiaMap } from "@/components/india-map";
import { SimMark } from "@/components/sim-mark";

export const Route = createFileRoute("/india")({ component: IndiaPage });

function IndiaPage() {
  return (
    <ChildChrome>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-teal">Aggregated trends</p>
          <SimMark>Simulated data — for prototype demonstration</SimMark>
        </div>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">India Safety Intelligence</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Statewide patterns only. This map never plots a child, a school, or a home.
        </p>
      </div>
      <IndiaMap />
    </ChildChrome>
  );
}
