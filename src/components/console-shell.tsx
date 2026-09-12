import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { Wordmark } from "./logo";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  GanttChart,
  Map,
  Scale,
  Settings2,
  Shield,
} from "lucide-react";
import { SimulationLauncher } from "./simulation-overlay";
import { useDemoStore } from "@/lib/demo/store";
import type { DemoRole } from "@/lib/demo/types";
import { Button } from "./ui/button";

const NAV = [
  { to: "/console", label: "Queue", icon: ClipboardList },
  { to: "/console/analytics", label: "Analytics", icon: GanttChart },
  { to: "/india", label: "India map", icon: Map },
  { to: "/console/audit", label: "Audit", icon: Scale },
  { to: "/console/settings", label: "Settings", icon: Settings2 },
  { to: "/console/architecture", label: "Architecture", icon: Shield },
] as const;

export function ConsoleShell({
  children,
  role,
  demo,
}: {
  children: ReactNode;
  role?: string;
  demo?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setRole = useDemoStore((s) => s.setRole);
  const current = useDemoStore((s) => s.role);
  const displayRole = (role as DemoRole | undefined) ?? current;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/">
            <Wordmark />
          </Link>
          <span className="hidden text-xs text-muted sm:inline">Child Safety Response Center</span>
          {displayRole && (
            <span className="rounded-full bg-teal-mist px-2 py-0.5 text-xs font-medium capitalize text-teal-deep">
              {displayRole}
              {demo ? " · demo" : ""}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <SimulationLauncher className="hidden sm:inline-flex" />
            {demo ? (
              <Link to="/login" className="text-sm text-ink-soft underline-offset-4 hover:underline">
                Sign in
              </Link>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pb-2">
          <nav className="flex gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active =
                item.to === "/console"
                  ? pathname === "/console"
                  : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-xl px-3 text-sm",
                    active ? "bg-teal-mist text-teal-deep" : "text-ink-soft hover:bg-paper-2",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            {(["responder", "counsellor", "supervisor"] as DemoRole[]).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={current === r ? "default" : "ghost"}
                className="capitalize"
                onClick={() => setRole(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
