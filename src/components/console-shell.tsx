import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { Wordmark } from "./logo";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  GanttChart,
  Scale,
  Settings2,
  Shield,
} from "lucide-react";

const NAV = [
  { to: "/console", label: "Queue", icon: ClipboardList },
  { to: "/console/analytics", label: "Analytics", icon: GanttChart },
  { to: "/console/audit", label: "Audit", icon: Scale },
  { to: "/console/settings", label: "Settings", icon: Settings2 },
  { to: "/console/architecture", label: "Architecture", icon: Shield },
] as const;

export function ConsoleShell({
  children,
  role,
}: {
  children: ReactNode;
  role?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/">
            <Wordmark />
          </Link>
          <span className="hidden text-xs text-muted sm:inline">Responder desk</span>
          {role && (
            <span className="rounded-full bg-teal-mist px-2 py-0.5 text-xs font-medium text-teal-deep">
              {role}
            </span>
          )}
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
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
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
