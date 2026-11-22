"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { ImpactStats } from "@/lib/supabase/types";

export type LiveStatus = "loading" | "ready" | "error";

/**
 * Live impact numbers.
 * - Starts from the server-rendered `initial` value (no flash, no fake 0).
 * - Re-fetches get_impact_stats() on mount (so "days since started" is always today's).
 * - Subscribes to Supabase Realtime on `ledger_entries`; any insert/update/delete
 *   triggers a debounced re-fetch, so numbers move the moment the admin saves.
 * - Disconnects while the tab is hidden (saves realtime connections) and catches
 *   up when the visitor returns.
 */
export function useImpactStats(initial: ImpactStats | null, onLedgerChange?: () => void) {
  const [stats, setStats] = useState<ImpactStats | null>(initial);
  const [status, setStatus] = useState<LiveStatus>(initial ? "ready" : "loading");
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const changeCb = useRef(onLedgerChange);
  useEffect(() => {
    changeCb.current = onLedgerChange;
  }, [onLedgerChange]);

  const refresh = useCallback(async () => {
    const sb = getBrowserSupabase();
    if (!sb) return setStatus((s) => (s === "loading" ? "error" : s));
    const { data, error } = await sb.rpc("get_impact_stats");
    if (error || !data) {
      setStatus((s) => (s === "ready" ? s : "error"));
      return;
    }
    setStats(data as ImpactStats);
    setStatus("ready");
    setUpdatedAt(Date.now());
  }, []);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let channel: ReturnType<typeof sb.channel> | null = null;

    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        void refresh();
        changeCb.current?.();
      }, 400);
    };
    const connect = () => {
      if (channel) return;
      channel = sb
        .channel(`ledger-live-${Math.random().toString(36).slice(2)}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "ledger_entries" }, onChange)
        .subscribe();
    };
    const disconnect = () => {
      if (channel) void sb.removeChannel(channel);
      channel = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        connect();
        void refresh();
      } else disconnect();
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; state is set after the response
    void refresh();
    connect();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      disconnect();
    };
  }, [refresh]);

  return { stats, status, updatedAt, refresh };
}
