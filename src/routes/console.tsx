import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyStaff } from "@/lib/server/staff";
import { ConsoleShell } from "@/components/console-shell";
import { useDemoStore } from "@/lib/demo/store";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/logo";

export const Route = createFileRoute("/console")({
  component: ConsoleLayout,
});

function ConsoleLayout() {
  const { user, isPending } = useCurrentUserState();
  const deskUnlocked = useDemoStore((s) => s.deskUnlocked);
  const demoRole = useDemoStore((s) => s.role);
  const unlock = useDemoStore((s) => s.unlockDesk);
  const staff = useQuery({
    queryKey: ["staff", "me"],
    queryFn: () => getMyStaff(),
    enabled: Boolean(user),
  });

  if (isPending && !deskUnlocked) {
    return (
      <div className="grid min-h-dvh place-items-center bg-paper">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-paper-2" />
      </div>
    );
  }

  if (!user && !deskUnlocked) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper px-4">
        <div className="w-full max-w-md space-y-5">
          <Wordmark />
          <h1 className="font-display text-3xl font-medium">Child Safety Response Center</h1>
          <p className="text-sm leading-relaxed text-ink-soft">
            Open the demo desk with synthetic cases, or sign in as a responder to the live queue.
            Children never need an account.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => unlock()}>Enter demo response center</Button>
            <Button variant="outline" asChild>
              <Link to="/login">Sign in as responder</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/">Back to child path</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ConsoleShell role={staff.data?.role ?? demoRole} demo={!user}>
      <Outlet />
    </ConsoleShell>
  );
}
