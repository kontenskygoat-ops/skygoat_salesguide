"use client";
import { FormEvent, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { safeUrl, validEmail } from "@/lib/validation";
import { settingsFields } from "@/lib/settings";
import { useAdminRows, useAdminMutation } from "./useAdmin";
import { resolveSettings } from "@/lib/official";
export default function SettingsAdmin() {
  const { rows, loading, error, load } = useAdminRows<{setting_key: string; setting_value: string | null}>("site_settings", "setting_key");
  const { busy, message, setMessage, run } = useAdminMutation();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const saved = Object.fromEntries(rows.map(row => [row.setting_key, row.setting_value ?? ""]));
  const values = { ...resolveSettings(saved), ...draft };
  async function save(event: FormEvent) {
    event.preventDefault();
    for (const [key, label, type] of settingsFields) {
      const value = (values[key] ?? "").trim();
      if (value && type === "url" && !safeUrl(value)) return setMessage(label + ": gunakan URL HTTPS yang valid.");
      if (value && type === "email" && !validEmail(value)) return setMessage("Email tidak valid.");
    }
    await run(async () => {
      const payload = settingsFields.map(([key]) => ({ setting_key: key, setting_value: (values[key] ?? "").trim(), updated_at: new Date().toISOString() }));
      payload.push({ setting_key: "official_defaults_version", setting_value: "1", updated_at: new Date().toISOString() });
      const { data, error } = await getBrowserSupabase().from("site_settings").upsert(payload, { onConflict: "setting_key" }).select("setting_key");
      if (error) throw error;
      if (data.length !== payload.length) throw new Error("Settings not saved");
      setDraft({}); await load();
    });
  }
  return <section className="adminPanel settingsPanel"><h2>Kontak & informasi produk</h2><p>Kosongkan informasi yang tidak ingin ditampilkan. Isi komposisi dan legalitas sesuai dokumen resmi.</p>
    {loading && <p role="status">Memuat pengaturan...</p>}{error && <div role="alert"><p>{error}</p><button onClick={load}>Coba lagi</button></div>}
    <p className="notice" role="status">{message}</p>
    <form className="adminForm" onSubmit={save}><fieldset disabled={busy || loading || !!error}>{settingsFields.map(([key, label, type]) => <div key={key}><label htmlFor={key}>{label}</label>{type === "textarea" ? <textarea id={key} rows={4} maxLength={5000} value={values[key] ?? ""} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /> : <input id={key} type={type} maxLength={2048} value={values[key] ?? ""} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />}</div>)}<button type="submit">{busy ? "Menyimpan..." : "Simpan pengaturan"}</button></fieldset></form>
  </section>;
}
