"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { ui } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

function LoginForm() {
  const { sb, session, isAdmin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/admin") ? params.get("next")! : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session && isAdmin) router.replace(next);
  }, [loading, session, isAdmin, next, router]);

  if (!sb) {
    return (
      <p className="text-ink-soft">
        Supabase is not configured. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then redeploy.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
        setBusy(false);
        if (error) setError(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
      }}
    >
      {session && isAdmin === false && (
        <div role="alert" className="rounded-xl bg-[#fef3f2] p-3 text-sm text-[#b42318]">
          Signed in as {session.user.email}, but this account is not an admin.{" "}
          <button type="button" onClick={() => void signOut()} className="font-semibold underline">Sign out</button>
        </div>
      )}
      <label className={ui.label}>
        Email
        <input className={ui.input} type="email" autoComplete="username" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className={ui.label}>
        Password
        <input className={ui.input} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p role="alert" className="text-sm font-medium text-[#b42318]">{error}</p>}
      <button type="submit" disabled={busy} className={cn(ui.btn, ui.primary, "w-full")}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grain flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-white p-7 shadow-[0_30px_60px_-30px_rgba(30,26,23,.5)] ring-1 ring-ink/8">
        <p className="text-xs font-semibold tracking-[0.14em] text-maroon uppercase">Hunger Free Kasaragod</p>
        <h1 className="mt-1 mb-6 text-3xl font-semibold">Admin sign in</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
