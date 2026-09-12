import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@/lib/demo/store";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const unlock = useDemoStore((s) => s.unlockDesk);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return <div className="grid min-h-dvh place-items-center bg-paper text-muted">Loading…</div>;
  }
  if (user) return <Navigate to="/console" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
          callbackURL: "/console",
        });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/console",
        });
        if (res.error) throw new Error(res.error.message);
      }
      window.location.href = "/console";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex">
          <Wordmark />
        </Link>
        <Button
          variant="invert"
          className="w-full"
          onClick={() => {
            unlock();
            void navigate({ to: "/console" });
          }}
        >
          Enter demo response center
        </Button>
        <Card className="rounded-xl p-1">
          <CardHeader>
            <CardTitle>Responder sign-in</CardTitle>
            <p className="mt-1 text-sm text-ink-soft">
              For desks that review cases. Children and reporters never need an account.
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            {authEnabled ? (
              <>
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn(p.providerId, { callbackURL: "/console" })}
                  >
                    Continue with {p.label}
                  </Button>
                ))}
                <div className="flex items-center gap-3 py-2 text-xs uppercase tracking-wide text-muted">
                  <span className="h-px flex-1 bg-border" />
                  or email
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form className="space-y-3" onSubmit={onEmail}>
                  {mode === "up" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "up" ? "new-password" : "current-password"}
                    />
                  </div>
                  {error && <p className="text-sm text-danger">{error}</p>}
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Please wait…" : mode === "up" ? "Create staff account" : "Sign in with email"}
                  </Button>
                </form>
                <button
                  type="button"
                  className="text-sm text-teal underline-offset-4 hover:underline"
                  onClick={() => setMode(mode === "up" ? "in" : "up")}
                >
                  {mode === "up" ? "Have an account? Sign in" : "New desk? Create an account"}
                </button>
              </>
            ) : (
              <p className="text-sm text-muted">Sign-in is disabled.</p>
            )}
          </CardBody>
        </Card>
        <p className="text-center text-xs text-muted">
          First signed-in person becomes admin. Later accounts start as responders.
        </p>
      </div>
    </main>
  );
}
