"use client";
import { FormEvent, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { safeUrl } from "@/lib/validation";
import type { SalesSection } from "@/lib/types";
import { useAdminRows, useAdminMutation } from "./useAdmin";
const empty: SalesSection = { id: "", section_key: "", title: "", subtitle: "", content: "", button_text: "", button_url: "", sort_order: 10, is_active: true };
export default function SalesAdmin() {
  const { rows, loading, error, load } = useAdminRows<SalesSection>("sales_sections", "sort_order");
  const { busy, message, setMessage, run } = useAdminMutation();
  const [edit, setEdit] = useState<SalesSection | null>(null);
  async function save(event: FormEvent) {
    event.preventDefault(); if (!edit) return;
    if (!/^[a-z][a-z0-9_]*$/.test(edit.section_key)) return setMessage("Kunci section memakai huruf kecil, angka, dan underscore.");
    if (edit.button_url && !safeUrl(edit.button_url, true)) return setMessage("URL tombol harus HTTPS, path /halaman, atau #anchor.");
    if (Boolean(edit.button_text?.trim()) !== Boolean(edit.button_url?.trim())) return setMessage("Isi teks dan URL tombol bersama, atau kosongkan keduanya.");
    if (!Number.isSafeInteger(edit.sort_order)) return setMessage("Urutan harus berupa bilangan bulat.");
    await run(async () => {
      const payload = { section_key: edit.section_key, title: edit.title?.trim() || null, subtitle: edit.subtitle?.trim() || null, content: edit.content?.trim() || null, button_text: edit.button_text?.trim() || null, button_url: edit.button_url?.trim() || null, sort_order: edit.sort_order, is_active: edit.is_active, updated_at: new Date().toISOString() };
      const client = getBrowserSupabase();
      const query = edit.id ? client.from("sales_sections").update(payload).eq("id", edit.id) : client.from("sales_sections").insert(payload);
      const { error } = await query.select("id").single(); if (error) throw error;
      setEdit(null); await load();
    });
  }
  return <><p className="notice" role="status">{message}</p><div className="adminTwoCol">
    <section className="adminPanel"><h2>Section Sales Guide</h2><p>Hero berada di atas panduan. Section lain ditampilkan setelah materi utama. Nonaktifkan untuk menyembunyikannya.</p><button disabled={busy} onClick={() => { setEdit(empty); setMessage(""); }}>Tambah section</button>
      {loading && <p role="status">Memuat...</p>}{error && <div role="alert"><p>{error}</p><button onClick={load}>Coba lagi</button></div>}{!loading && !error && !rows.length && <p>Belum ada section.</p>}
      <div className="adminList">{rows.map(row => <article key={row.id}><div><small>{row.section_key} ? {row.is_active ? "Tampil" : "Tersembunyi"}</small><h3>{row.title || "Tanpa judul"}</h3></div><button disabled={busy} onClick={() => { setEdit(row); setMessage(""); }}>Edit <span className="srOnly">{row.section_key}</span></button></article>)}</div>
    </section>
    <section className="adminPanel"><h2>{edit?.id ? "Edit section" : "Section baru"}</h2>{!edit ? <p>Pilih section atau tambahkan section baru.</p> : <form className="adminForm" onSubmit={save}><fieldset disabled={busy || loading || !!error}>
      <label htmlFor="section-key">Kunci section</label><input id="section-key" value={edit.section_key} disabled={!!edit.id} required pattern="[a-z][a-z0-9_]*" maxLength={80} onChange={e => setEdit({ ...edit, section_key: e.target.value })} />
      {([['title','Judul'],['subtitle','Subjudul'],['button_text','Teks tombol'],['button_url','URL tombol']] as const).map(([key,label]) => <div key={key}><label htmlFor={key}>{label}</label><input id={key} maxLength={key === 'button_url' ? 2048 : 250} value={edit[key] ?? ""} onChange={e => setEdit({ ...edit, [key]: e.target.value })} /></div>)}
      <label htmlFor="section-content">Konten</label><textarea id="section-content" rows={8} maxLength={20000} value={edit.content ?? ""} onChange={e => setEdit({ ...edit, content: e.target.value })} />
      <label htmlFor="section-order">Urutan</label><input id="section-order" type="number" step="1" required value={edit.sort_order} onChange={e => setEdit({ ...edit, sort_order: Number(e.target.value) })} />
      <label className="inline"><input type="checkbox" checked={edit.is_active} onChange={e => setEdit({ ...edit, is_active: e.target.checked })} />Tampilkan di website</label>
      <div className="actionRow"><button type="submit">{busy ? "Menyimpan..." : "Simpan section"}</button><button type="button" className="ghostBtn" onClick={() => setEdit(null)}>Batal</button></div>
    </fieldset></form>}</section></div></>;
}
