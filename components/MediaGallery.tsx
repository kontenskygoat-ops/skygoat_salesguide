"use client";
import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types";
import { googleDriveImageUrl, videoSource } from "@/lib/googleDrive";
const categories = ["all", "mesin", "produksi", "peternakan", "produk", "video"] as const;
function MediaImage({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const src = googleDriveImageUrl(url);
  return failed || !src ? <div className="mediaPlaceholder"><strong>{title}</strong><span>Gambar belum tersedia</span></div> : <img src={src} alt={title} loading="lazy" onError={() => setFailed(true)} />;
}
export default function MediaGallery({ items }: { items: MediaAsset[] }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("all");
  const [active, setActive] = useState<{ item: MediaAsset; mode: "image" | "video" } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = filter === "all" ? items : items.filter(item => item.category === filter);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [active]);
  const source = active?.mode === "video" ? videoSource(active.item.video_url) : null;
  return <>
    <div className="filterBar" aria-label="Filter galeri">{categories.map(category => <button key={category} type="button" aria-pressed={filter === category} className={"filterButton " + (filter === category ? "active" : "")} onClick={() => setFilter(category)}>{category === "all" ? "Semua" : category}</button>)}</div>
    {!filtered.length && <p className="emptyState" role="status">Belum ada media untuk kategori ini.</p>}
    <div className="mediaGrid">{filtered.map(item => <article className="mediaCard" key={item.id}>
      <div className="mediaCover">{item.image_url ? <MediaImage key={item.image_url} url={item.image_url} title={item.title} /> : <div className="mediaPlaceholder"><span>{item.category}</span><strong>{item.title}</strong></div>}</div>
      <div className="mediaBody"><span>{item.category}</span><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}
        <div className="actionRow">{item.image_url && <button type="button" className="textButton" onClick={() => setActive({ item, mode: "image" })}>Lihat foto</button>}
        {videoSource(item.video_url) && <button type="button" className="textButton" onClick={() => setActive({ item, mode: "video" })}>Putar video</button>}</div>
      </div>
    </article>)}</div>
    {active && <dialog ref={dialog} className="videoModal" aria-labelledby="media-dialog-title" onCancel={() => setActive(null)} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setActive(null); } }}>
      <button type="button" className="modalClose" aria-label="Tutup media" autoFocus onClick={() => setActive(null)}>?</button>
      <h3 id="media-dialog-title">{active.item.title}</h3>
      {active.mode === "image" ? <div className="photoPreview"><MediaImage url={active.item.image_url ?? ""} title={active.item.title} /></div> : source && <div className="ratio169">{source.kind === "video" ? <video src={source.url} controls playsInline /> : <iframe src={source.url} title={active.item.title} allow="fullscreen" referrerPolicy="no-referrer" allowFullScreen />}</div>}
      <p>Jika media tidak dapat dimuat, <a href={source?.url ?? googleDriveImageUrl(active.item.image_url)} target="_blank" rel="noopener noreferrer">buka sumber media</a>.</p>
    </dialog>}
  </>;
}
