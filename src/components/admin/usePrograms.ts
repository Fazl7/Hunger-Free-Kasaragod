"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProgramRow } from "@/lib/supabase/types";
import { useAdminAuth } from "./AdminAuth";

/** All programs (active first, in admin order) for dropdowns and lookups. */
export function usePrograms() {
  const { sb } = useAdminAuth();
  const [programs, setPrograms] = useState<ProgramRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!sb) return;
    const { data, error } = await sb
      .from("programs")
      .select("id,slug,name_en,name_ml,icon,counts_as,sort_order,is_active")
      .order("sort_order");
    if (error) setError(error.message);
    else {
      setPrograms(data as ProgramRow[]);
      setError(null);
    }
  }, [sb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void reload();
  }, [reload]);

  return { programs, error, reload };
}
