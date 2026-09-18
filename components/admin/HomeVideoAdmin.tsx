"use client";

import { DragEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { safeUrl } from "@/lib/validation";
import { videoSource } from "@/lib/googleDrive";
import { useAdminMutation, useAdminRows } from "./useAdmin";

const BUCKET = "site-media";
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/ogg"];

type ArchiveItem = {
  url: string;
  path?: string;
  name: string;
  size?: number;
  savedAt: string;
};

function bytes(value?: number) {
  if (!value || value < 1) return "—";
  return value >= 1024 * 1024
    ? `${(value / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(value / 1024)} KB`;
}

function parseArchive(value?: string) {
  if (!value) return [] as ArchiveItem[];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ArchiveItem =>
        !!item &&
        typeof item.url === "string" &&
        typeof item.name === "string" &&
        typeof item.savedAt === "string",
    );
  } catch {
    return [] as ArchiveItem[];
  }
}

function safeFileName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "skygoat-video.mp4";
}

function validVideoFile(file: File) {
  const extensionOk = /\.(mp4|webm|ogg)$/i.test(file.name);
  return (
    (ACCEPTED_TYPES.includes(file.type) || (!file.type && extensionOk)) &&
    extensionOk
  );
}

export default function HomeVideoAdmin() {
  const { rows, loading, error, load } = useAdminRows<{
    setting_key: string;
    setting_value: string | null;
  }>("site_settings", "setting_key");
  const { busy, message, setMessage, run } = useAdminMutation();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [keepPrevious, setKeepPrevious] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const saved = useMemo(
    () =>
      Object.fromEntries(
        rows.map((row) => [row.setting_key, row.setting_value ?? ""]),
      ),
    [rows],
  );
  const values = { ...saved, ...draft };
  const archive = parseArchive(values.home_video_archive);
  const currentUrl = safeUrl(values.home_video_url);
  const currentSource = videoSource(currentUrl);

  function selectFile(next: File | null) {
    if (!next) return;
    if (!validVideoFile(next)) {
      setFile(null);
      return setMessage("Format video harus MP4, WebM, atau OGG.");
    }
    if (next.size > MAX_VIDEO_BYTES) {
      setFile(null);
      return setMessage(
        "Ukuran video maksimal 50 MB. File 40 MB masih dapat digunakan.",
      );
    }
    setMessage("");
    setFile(next);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (busy) return;
    selectFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function upsertSettings(items: Record<string, string>) {
    const now = new Date().toISOString();
    const payload = Object.entries(items).map(
      ([setting_key, setting_value]) => ({
        setting_key,
        setting_value,
        updated_at: now,
      }),
    );
    const { error } = await getBrowserSupabase()
      .from("site_settings")
      .upsert(payload, { onConflict: "setting_key" });
    if (error) throw error;
  }

  async function saveText(event: FormEvent) {
    event.preventDefault();
    const poster = (values.home_video_poster_url ?? "").trim();
    if (poster && !safeUrl(poster))
      return setMessage("URL thumbnail harus menggunakan HTTPS yang valid.");
    await run(async () => {
      await upsertSettings({
        home_video_title: (values.home_video_title ?? "").trim(),
        home_video_description: (values.home_video_description ?? "").trim(),
        home_video_poster_url: poster,
      });
      setDraft({});
      await load();
    }, "Teks dan thumbnail video tersimpan.");
  }

  async function uploadVideo() {
    if (!file) return setMessage("Pilih atau drop file video terlebih dahulu.");
    await run(
      async () => {
        const client = getBrowserSupabase();
        const oldUrl = safeUrl(saved.home_video_url);
        const oldPath = saved.home_video_storage_path || "";
        const oldName = saved.home_video_file_name || "Video sebelumnya";
        const oldSize = Number(saved.home_video_file_size || 0) || undefined;
        let nextArchive = parseArchive(saved.home_video_archive);

        if (keepPrevious && oldUrl) {
          nextArchive = [
            {
              url: oldUrl,
              path: oldPath || undefined,
              name: oldName,
              size: oldSize,
              savedAt: new Date().toISOString(),
            },
            ...nextArchive.filter((item) => item.url !== oldUrl),
          ];
        }

        const path = `home-videos/${Date.now()}-${safeFileName(file.name)}`;
        const { error: uploadError } = await client.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            contentType: file.type || undefined,
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const { data: publicData } = client.storage
          .from(BUCKET)
          .getPublicUrl(path);
        const newUrl = publicData.publicUrl;

        try {
          await upsertSettings({
            home_video_url: newUrl,
            home_video_storage_path: path,
            home_video_file_name: file.name,
            home_video_file_size: String(file.size),
            home_video_archive: JSON.stringify(nextArchive),
            home_video_title: (
              values.home_video_title || "THE STORY BEHIND SKYGOAT"
            ).trim(),
            home_video_description: (
              values.home_video_description ||
              "Kenali perjalanan SKYGOAT lebih dekat melalui video."
            ).trim(),
            home_video_poster_url: (values.home_video_poster_url ?? "").trim(),
          });
        } catch (settingsError) {
          await client.storage.from(BUCKET).remove([path]);
          throw settingsError;
        }

        if (!keepPrevious && oldPath && oldPath !== path) {
          const { error: removeError } = await client.storage
            .from(BUCKET)
            .remove([oldPath]);
          if (removeError)
            console.warn(
              "Video lama tidak dapat dihapus dari storage",
              removeError.message,
            );
        }

        setFile(null);
        setKeepPrevious(false);
        setDraft({});
        if (fileInput.current) fileInput.current.value = "";
        await load();
      },
      keepPrevious
        ? "Video baru aktif. Video sebelumnya disimpan di arsip."
        : "Video baru aktif. Video sebelumnya diganti.",
    );
  }

  async function restore(item: ArchiveItem) {
    if (!confirm(`Gunakan kembali “${item.name}” sebagai video aktif?`)) return;
    await run(async () => {
      const current = safeUrl(saved.home_video_url);
      let nextArchive = parseArchive(saved.home_video_archive).filter(
        (entry) => entry.url !== item.url,
      );
      if (current && current !== item.url) {
        nextArchive = [
          {
            url: current,
            path: saved.home_video_storage_path || undefined,
            name: saved.home_video_file_name || "Video sebelumnya",
            size: Number(saved.home_video_file_size || 0) || undefined,
            savedAt: new Date().toISOString(),
          },
          ...nextArchive.filter((entry) => entry.url !== current),
        ];
      }
      await upsertSettings({
        home_video_url: item.url,
        home_video_storage_path: item.path || "",
        home_video_file_name: item.name,
        home_video_file_size: String(item.size || ""),
        home_video_archive: JSON.stringify(nextArchive),
      });
      await load();
    }, "Video arsip sekarang menjadi video aktif.");
  }

  async function removeArchive(item: ArchiveItem) {
    if (!confirm(`Hapus arsip “${item.name}”?`)) return;
    await run(async () => {
      const client = getBrowserSupabase();
      if (item.path) {
        const { error: removeError } = await client.storage
          .from(BUCKET)
          .remove([item.path]);
        if (removeError) throw removeError;
      }
      const nextArchive = parseArchive(saved.home_video_archive).filter(
        (entry) => entry.url !== item.url,
      );
      await upsertSettings({ home_video_archive: JSON.stringify(nextArchive) });
      await load();
    }, "Video arsip dihapus.");
  }

  return (
    <section className="adminPanel homeVideoAdmin">
      <div className="homeVideoAdminHead">
        <div>
          <span className="adminEyebrow">VIDEO LANDSCAPE</span>
          <h2>Video cerita SKYGOAT</h2>
          <p>
            Tampil di beranda sebelum bagian Tentang SKYGOAT. Pengunjung menekan
            Play untuk menonton.
          </p>
        </div>
        {currentSource && (
          <a
            className="adminVideoLink"
            href={currentSource.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat video aktif ↗
          </a>
        )}
      </div>

      {loading && <p role="status">Memuat pengaturan video...</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={load}>
            Coba lagi
          </button>
        </div>
      )}
      <p className="notice" role="status">
        {message}
      </p>

      {!loading && !error && (
        <>
          <div className="currentVideoInfo">
            <span>Saat ini</span>
            <strong>
              {saved.home_video_file_name ||
                (currentUrl ? "Video sudah terpasang" : "Belum ada video")}
            </strong>
            {saved.home_video_file_size && (
              <small>{bytes(Number(saved.home_video_file_size))}</small>
            )}
          </div>
          <h3 className="adminStep">1. Pilih video pengganti</h3>
          <fieldset disabled={busy}>
            <div
              className={`videoDropzone ${dragging ? "dragging" : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget === event.target) setDragging(false);
              }}
              onDrop={onDrop}
              onClick={() => {
                if (!busy) fileInput.current?.click();
              }}
              role="button"
              tabIndex={busy ? -1 : 0}
              aria-disabled={busy}
              onKeyDown={(event) => {
                if (!busy && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  fileInput.current?.click();
                }
              }}
              aria-label="Pilih file video landscape dari perangkat"
            >
              <input
                ref={fileInput}
                type="file"
                accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg"
                onChange={(event) =>
                  selectFile(event.target.files?.[0] ?? null)
                }
                hidden
              />
              <div className="videoDropIcon">＋</div>
              <strong>{file ? file.name : "Ketuk untuk pilih video"}</strong>
              <span>
                {file
                  ? `${bytes(file.size)} · siap diunggah`
                  : "Pilih dari file di perangkat, atau tarik file ke sini"}
              </span>
              <small>MP4, WebM, atau OGG. Maksimal 50 MB.</small>
            </div>

            <label className="keepOldVideo">
              <input
                type="checkbox"
                checked={keepPrevious}
                onChange={(event) => setKeepPrevious(event.target.checked)}
              />
              <span>
                <strong>Simpan salinan video lama</strong>
                <small>
                  Jika tidak dicentang, file video lama yang diunggah melalui
                  CMS akan dihapus setelah penggantian berhasil.
                </small>
              </span>
            </label>

            <button
              type="button"
              className="videoUploadBtn"
              disabled={busy || !file}
              onClick={uploadVideo}
            >
              {busy ? "Memproses..." : "Unggah & tampilkan video"}
            </button>
            <p className="adminHelpText">
              Setelah file dipilih, tekan tombol unggah. Biarkan halaman terbuka
              sampai selesai.
            </p>
          </fieldset>

          <form className="adminForm homeVideoMeta" onSubmit={saveText}>
            <fieldset disabled={busy}>
              <legend className="adminStep">2. Judul & gambar sampul</legend>
              <label htmlFor="home-video-title">Judul banner</label>
              <input
                id="home-video-title"
                maxLength={120}
                value={values.home_video_title || "THE STORY BEHIND SKYGOAT"}
                onChange={(event) =>
                  setDraft({ ...draft, home_video_title: event.target.value })
                }
              />
              <label htmlFor="home-video-description">Deskripsi singkat</label>
              <textarea
                id="home-video-description"
                rows={3}
                maxLength={300}
                value={
                  values.home_video_description ||
                  "Kenali perjalanan SKYGOAT lebih dekat melalui video."
                }
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    home_video_description: event.target.value,
                  })
                }
              />
              <label htmlFor="home-video-poster">
                Tautan gambar sampul (opsional)
              </label>
              <input
                id="home-video-poster"
                type="url"
                placeholder="https://..."
                value={values.home_video_poster_url || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    home_video_poster_url: event.target.value,
                  })
                }
              />
              <button type="submit">
                {busy ? "Menyimpan..." : "Simpan judul & sampul"}
              </button>
            </fieldset>
          </form>

          <details className="videoArchive">
            <summary>Arsip video lama ({archive.length})</summary>
            {!archive.length ? (
              <p className="adminHelpText">
                Belum ada video lama yang disimpan. Centang “Simpan video lama
                ke arsip” sebelum upload video pengganti.
              </p>
            ) : (
              archive.map((item) => (
                <article key={`${item.url}-${item.savedAt}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {bytes(item.size)} ·{" "}
                      {new Date(item.savedAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="actionRow">
                    <button
                      type="button"
                      className="ghostBtn"
                      disabled={busy}
                      onClick={() => restore(item)}
                    >
                      Gunakan lagi
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={busy}
                      onClick={() => removeArchive(item)}
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              ))
            )}
          </details>
        </>
      )}
    </section>
  );
}
