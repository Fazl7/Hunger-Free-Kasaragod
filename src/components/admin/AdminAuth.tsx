"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/browser";

/**
 * Admin session state. The UI guard here is for convenience only; the real
 * protection is Row Level Security: writes succeed only for users listed in
 * public.admins, whatever the browser does.
 */
type AuthState = {
  sb: SupabaseClient | null;
  session: Session | null;
  isAdmin: boolean | null; // null = still checking
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  sb: null,
  session: null,
  isAdmin: null,
  loading: true,
  signOut: async () => {},
});
export const useAdminAuth = () => useContext(AuthContext);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [sb] = useState(() => getBrowserSupabase());
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(Boolean(sb));

  useEffect(() => {
    if (!sb) return;
    let alive = true;
    const check = async (s: Session | null) => {
      setSession(s);
      if (!s) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data } = await sb.rpc("is_admin");
      if (!alive) return;
      setIsAdmin(data === true);
      setLoading(false);
    };
    void sb.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void check(s);
      else setSession(s); // TOKEN_REFRESHED etc.
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [sb]);

  const signOut = async () => {
    await sb?.auth.signOut();
  };

  return <AuthContext.Provider value={{ sb, session, isAdmin, loading, signOut }}>{children}</AuthContext.Provider>;
}
