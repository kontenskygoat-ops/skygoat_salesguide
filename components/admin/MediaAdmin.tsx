"use client";
import { FormEvent, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { safeUrl } from "@/lib/validation";
import { videoSource } from "@/lib/googleDrive";
import type { MediaAsset } from "@/lib/types";
import { useAdminRows, useAdminMutation } from "./useAdmin";
const empty: MediaAsset = { id: "", title: "", slug: "", category: "mesin", description: "", image_url: "", video_url: "", sort_order: 0, is_active: true };
export default function MediaAdmin() {
  const { rows, loading, error, load } = useAdminRows<MediaAsset>("media_assets", "sort_order");
  const { busy, message, setMessage, run } = useAdminMutation();
  const [form, setForm] = useState<MediaAsset>(empty);
  async function save(event: FormEvent) {
    event.preventDefault();
    const slug = (form.slug || form.title).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!form.title.trim() || !slug) return setMessage("Judul dan slug harus diisi.");
    if (form.image_url && !safeUrl(form.image_url)) return setMessage("Gunakan URL gambar HTTPS yang valid.");
    if (form.video_url && !videoSource(form.video_url)) return setMessage("Gunakan link Google Drive atau file HTTPS MP4, WebM, atau OGG.");
    if (!Number.isSafeInteger(form.sort_order)) return setMessage("Urutan harus berupa bilangan bulat.");
    await run(async () => {
      const payload = { title: form.title.trim(), slug, category: form.category, description: form.description?.trim() || null, image_url: form.image_url?.trim() || null, video_url: form.video_url?.trim() || null, sort_order: form.sort_order, is_active: form.is_active, updated_at: new Date().toISOString() };
      const client = getBrowserSupabase();
      const query = form.id ? client.from("media_assets").update(payload).eq("id", form.id) : client.from("media_assets").insert(payload);
      const { error } = await query.select("id").single();
      if (error) throw error;
      setForm(empty); await load();
    });
  }
  async function remove(item: MediaAsset) {
    if (!confirm('Hapus media "' + item.title + '"? Tindakan ini tidak dapat dibatalkan.')) return;
    await run(async () => {
      const { error } = await getBrowserSupabase().from("media_assets").delete().eq("id", item.id).select("id").single();
      if (error) throw error;
      if (form.id === item.id) setForm(empty);
      await load();
    }, "Media dihapus.");
  }
  return <><p className="notice" role="status">{message}</p><div className="adminTwoCol">
    <section className="adminPanel"><h2>{form.id ? "Edit media" : "Tambah media"}</h2>
      <form className="adminForm" onSubmit={save}><fieldset disabled={busy || loading || !!error}>
        <label htmlFor="media-title">Judul</label><input id="media-title" value={form.title} maxLength={160} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <label htmlFor="media-slug">Slug</label><input id="media-slug" value={form.slug} maxLength={160} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Otomatis dari judul jika kosong" />
        <label htmlFor="media-category">Kategori</label><select id="media-category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as MediaAsset["category"] })}>{["mesin", "produksi", "peternakan", "produk", "video"].map(c => <option key={c}>{c}</option>)}</select>
        <label htmlFor="media-description">Deskripsi</label><textarea id="media-description" rows={4} maxLength={5000} value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} />
        <label htmlFor="media-image">URL gambar</label><input id="media-image" type="url" value={form.image_url ?? ""} onChange={e => setForm({ ...form, image_url: e.target.value })} />
        <label htmlFor="media-video">URL video</label><input id="media-video" type="url" aria-describedby="video-help" value={form.video_url ?? ""} onChange={e => setForm({ ...form, video_url: e.target.value })} /><small id="video-help">Google Drive (akses publik / Viewer), atau file MP4, WebM, OGG.</small>
        <label htmlFor="media-order">Urutan</label><input id="media-order" type="number" step="1" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} required />
        <label className="inline"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />Tampilkan di website</label>
        <div className="actionRow"><button type="submit">{busy ? "Menyimpan..." : "Simpan media"}</button>{form.id && <button type="button" className="ghostBtn" onClick={() => setForm(empty)}>Batal</button>}</div>
      </fieldset></form>
    </section>
    <section className="adminPanel"><h2>Daftar media</h2>{loading && <p role="status">Memuat media...</p>}{error && <div role="alert"><p>{error}</p><button onClick={load}>Coba lagi</button></div>}{!loading && !error && !rows.length && <p>Belum ada media. Tambahkan melalui formulir.</p>}
      <div className="adminList">{rows.map(item => <article key={item.id}><div><small>{item.category}</small><h3>{item.title}</h3><span>{item.is_active ? "Tampil" : "Tersembunyi"} ? urutan {item.sort_order}</span></div><div className="actionRow"><button disabled={busy} onClick={() => { setForm(item); setMessage(""); }}>Edit <span className="srOnly">{item.title}</span></button><button disabled={busy} className="danger" onClick={() => remove(item)}>Hapus <span className="srOnly">{item.title}</span></button></div></article>)}</div>
    </section></div></>;
}
