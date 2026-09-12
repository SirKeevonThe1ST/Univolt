import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyStaff } from "@/lib/server/staff";
import { ConsoleShell } from "@/components/console-shell";

export const Route = createFileRoute("/console")({
  component: ConsoleLayout,
});

function ConsoleLayout() {
  const { user, isPending } = useCurrentUserState();
  const staff = useQuery({
    queryKey: ["staff", "me"],
    queryFn: () => getMyStaff(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-paper">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-paper-2" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <ConsoleShell role={staff.data?.role}>
      <Outlet />
    </ConsoleShell>
  );
}
