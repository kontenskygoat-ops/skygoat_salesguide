"use client";
import { FormEvent, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { safeUrl, validEmail } from "@/lib/validation";
import { settingsFields, settingsGroups } from "@/lib/settings";
import { useAdminRows, useAdminMutation } from "./useAdmin";
import { resolveSettings } from "@/lib/official";
export default function SettingsAdmin({
  group = "contact",
}: {
  group?: keyof typeof settingsGroups;
}) {
  const { rows, loading, error, load } = useAdminRows<{
    setting_key: string;
    setting_value: string | null;
  }>("site_settings", "setting_key");
  const { busy, message, setMessage, run } = useAdminMutation();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const saved = Object.fromEntries(
    rows.map((row) => [row.setting_key, row.setting_value ?? ""]),
  );
  const values = { ...resolveSettings(saved), ...draft };
  const sections = settingsGroups[group];
  const keys = new Set(sections.flatMap((section) => section.keys));
  const fields = settingsFields.filter(([key]) => keys.has(key));
  async function save(event: FormEvent) {
    event.preventDefault();
    for (const [key, label, type] of fields) {
      const value = (values[key] ?? "").trim();
      if (value && type === "url" && !safeUrl(value))
        return setMessage(label + ": gunakan URL HTTPS yang valid.");
      if (value && type === "email" && !validEmail(value))
        return setMessage("Email tidak valid.");
    }
    await run(async () => {
      const payload = fields.map(([key]) => ({
        setting_key: key,
        setting_value: (values[key] ?? "").trim(),
        updated_at: new Date().toISOString(),
      }));
      if (group === "contact")
        payload.push({
          setting_key: "official_defaults_version",
          setting_value: "1",
          updated_at: new Date().toISOString(),
        });
      const { data, error } = await getBrowserSupabase()
        .from("site_settings")
        .upsert(payload, { onConflict: "setting_key" })
        .select("setting_key");
      if (error) throw error;
      if (data.length !== payload.length) throw new Error("Settings not saved");
      setDraft({});
      await load();
    });
  }
  return (
    <section className="adminPanel settingsPanel">
      <h2>{group === "products" ? "Informasi produk" : "Kontak & website"}</h2>
      <p>
        {group === "products"
          ? "Buka varian yang ingin diperbarui. Isi komposisi dan legalitas sesuai dokumen resmi."
          : "Perbarui kontak dan tautan yang dapat dibuka pelanggan."}{" "}
        Kosongkan informasi yang tidak ingin ditampilkan.
      </p>
      {loading && <p role="status">Memuat pengaturan...</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={load}>Coba lagi</button>
        </div>
      )}
      <form
        className="adminForm"
        onSubmit={save}
        onInvalidCapture={(event) => {
          let parent = (event.target as HTMLElement).parentElement;
          while (parent && parent !== event.currentTarget) {
            if (parent instanceof HTMLDetailsElement) parent.open = true;
            parent = parent.parentElement;
          }
        }}
      >
        <fieldset disabled={busy || loading || !!error}>
          {sections.map((section, index) => (
            <details
              className="adminFieldGroup"
              key={section.title}
              open={index === 0}
            >
              <summary>{section.title}</summary>
              <div className="adminFields">
                {fields
                  .filter(([key]) => section.keys.includes(key))
                  .map(([key, label, type]) => (
                    <div
                      key={key}
                      className={
                        type === "textarea" ? "adminFieldWide" : undefined
                      }
                    >
                      <label htmlFor={key}>{label}</label>
                      {type === "textarea" ? (
                        <textarea
                          id={key}
                          rows={3}
                          maxLength={5000}
                          value={values[key] ?? ""}
                          onChange={(e) =>
                            setDraft({ ...draft, [key]: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          id={key}
                          type={type}
                          inputMode={
                            type === "url"
                              ? "url"
                              : type === "email"
                                ? "email"
                                : "text"
                          }
                          placeholder={
                            type === "url" ? "https://..." : undefined
                          }
                          maxLength={2048}
                          value={values[key] ?? ""}
                          onChange={(e) =>
                            setDraft({ ...draft, [key]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
              </div>
            </details>
          ))}
          <div className="adminSaveBar">
            <span>
              {Object.keys(draft).length
                ? "Ada perubahan yang belum disimpan"
                : "Simpan setelah selesai mengubah data"}
            </span>
            <button type="submit">
              {busy
                ? "Menyimpan..."
                : group === "products"
                  ? "Simpan informasi produk"
                  : "Simpan kontak & website"}
            </button>
          </div>
          <p className="notice" role="status">
            {message}
          </p>
        </fieldset>
      </form>
    </section>
  );
}
