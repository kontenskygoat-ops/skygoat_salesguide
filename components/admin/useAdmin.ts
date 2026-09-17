"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { errorMessage } from "@/lib/validation";
export function useAdminRows<T>(table: string, order: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data, error } = await getBrowserSupabase().from(table).select("*").order(order);
      if (error) throw error;
      setRows((data ?? []) as T[]);
    } catch (e) { setError(errorMessage(e)); }
    finally { setLoading(false); }
  }, [table, order]);
  useEffect(() => { void load(); }, [load]);
  return { rows, loading, error, load };
}
export function useAdminMutation() {
  const locked = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function run(action: () => Promise<void>, success = "Perubahan tersimpan.") {
    if (locked.current) return;
    locked.current = true; setBusy(true); setMessage("");
    try { await action(); setMessage(success); }
    catch (e) { setMessage(errorMessage(e)); }
    finally { locked.current = false; setBusy(false); }
  }
  return { busy, message, setMessage, run };
}
