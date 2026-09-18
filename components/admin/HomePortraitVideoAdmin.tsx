"use client";

import { DragEvent, FormEvent, useId, useMemo, useRef, useState } from "react";
import {
  readPortraitSlot,
  writePortraitSlot,
  type PortraitSlot,
} from "@/lib/portraitVideos";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { createUploadId } from "@/lib/uploadId";
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
    return [];
  }
}

function safeFileName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "skygoat-portrait-video.mp4";
}

function validVideoFile(file: File) {
  const extensionOk = /\.(mp4|webm|ogg)$/i.test(file.name);
  return (
    (ACCEPTED_TYPES.includes(file.type) || (!file.type && extensionOk)) &&
    extensionOk
  );
}

function readVideoRatio(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      URL.revokeObjectURL(objectUrl);
      if (!width || !height)
        return reject(new Error("Dimensi video tidak terbaca."));
      resolve({ width, height });
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Metadata video tidak dapat dibaca."));
    };
    video.src = objectUrl;
  });
}

export default function HomePortraitVideoAdmin({
  slot = 1,
}: {
  slot?: PortraitSlot;
}) {
  const formId = useId();
  const { rows, loading, error, load } = useAdminRows<{
    setting_key: string;
    setting_value: string | null;
  }>("site_settings", "setting_key");
  const { busy, message, setMessage, run } = useAdminMutation();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [keepPrevious, setKeepPrevious] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const saved = useMemo(
    () =>
      readPortraitSlot(
        Object.fromEntries(
          rows.map((row) => [row.setting_key, row.setting_value ?? ""]),
        ),
        slot,
      ),
    [rows, slot],
  );
  const values = { ...saved, ...draft };
  const archive = parseArchive(values.home_portrait_video_archive);
  const currentUrl = safeUrl(values.home_portrait_video_url);
  const currentSource = videoSource(currentUrl);

  async function selectFile(next: File | null) {
    if (!next) return;
    if (!validVideoFile(next)) {
      setFile(null);
      setDimensions(null);
      return setMessage("Format video harus MP4, WebM, atau OGG.");
    }
    if (next.size > MAX_VIDEO_BYTES) {
      setFile(null);
      setDimensions(null);
      return setMessage("Ukuran video maksimal 50 MB.");
    }

    setFile(next);
    setMessage("");
    try {
      const meta = await readVideoRatio(next);
      setDimensions(meta);
      if (meta.height <= meta.width) {
        setMessage(
          `Video terdeteksi ${meta.width}×${meta.height}px. Fitur ini paling optimal untuk video portrait 9:16.`,
        );
      } else {
        setMessage(
          `Video portrait terdeteksi ${meta.width}×${meta.height}px dan siap di-upload.`,
        );
      }
    } catch {
      setDimensions(null);
      setMessage(
        "Video siap di-upload. Pastikan file yang dipilih berformat portrait 9:16.",
      );
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (busy) return;
    void selectFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function upsertSettings(items: Record<string, string>) {
    const now = new Date().toISOString();
    const payload = Object.entries(writePortraitSlot(items, slot)).map(
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
    const poster = (values.home_portrait_video_poster_url ?? "").trim();
    if (poster && !safeUrl(poster))
      return setMessage("URL poster harus menggunakan HTTPS yang valid.");
    await run(async () => {
      await upsertSettings({
        home_portrait_video_title: (
          values.home_portrait_video_title || `Video SKYGOAT ${slot}`
        ).trim(),
        home_portrait_video_description: (
          values.home_portrait_video_description ?? ""
        ).trim(),
        home_portrait_video_poster_url: poster,
      });
      setDraft({});
      await load();
    }, "Pengaturan video portrait tersimpan.");
  }

  async function uploadVideo() {
    if (!file)
      return setMessage("Pilih atau drop file video portrait terlebih dahulu.");
    await run(
      async () => {
        const client = getBrowserSupabase();
        const oldUrl = safeUrl(saved.home_portrait_video_url);
        const oldPath = saved.home_portrait_video_storage_path || "";
        const oldName =
          saved.home_portrait_video_file_name || "Video portrait sebelumnya";
        const oldSize =
          Number(saved.home_portrait_video_file_size || 0) || undefined;
        let nextArchive = parseArchive(saved.home_portrait_video_archive);

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

        const path = `home-portrait-videos/${slot}-${createUploadId()}-${safeFileName(file.name)}`;
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
            home_portrait_video_url: newUrl,
            home_portrait_video_storage_path: path,
            home_portrait_video_file_name: file.name,
            home_portrait_video_file_size: String(file.size),
            home_portrait_video_width: String(dimensions?.width || ""),
            home_portrait_video_height: String(dimensions?.height || ""),
            home_portrait_video_archive: JSON.stringify(nextArchive),
            home_portrait_video_title: (
              values.home_portrait_video_title || `Video SKYGOAT ${slot}`
            ).trim(),
            home_portrait_video_description: (
              values.home_portrait_video_description ?? ""
            ).trim(),
            home_portrait_video_poster_url: (
              values.home_portrait_video_poster_url ?? ""
            ).trim(),
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
              "Video portrait lama tidak dapat dihapus dari storage",
              removeError.message,
            );
        }

        setFile(null);
        setDimensions(null);
        setKeepPrevious(false);
        setDraft({});
        if (fileInput.current) fileInput.current.value = "";
        await load();
      },
      keepPrevious
        ? "Video portrait baru aktif. Video sebelumnya disimpan di arsip."
        : "Video portrait baru aktif. Video sebelumnya diganti.",
    );
  }

  async function restore(item: ArchiveItem) {
    if (
      !confirm(`Gunakan kembali “${item.name}” sebagai video portrait aktif?`)
    )
      return;
    await run(async () => {
      const current = safeUrl(saved.home_portrait_video_url);
      let nextArchive = parseArchive(saved.home_portrait_video_archive).filter(
        (entry) => entry.url !== item.url,
      );
      if (current && current !== item.url) {
        nextArchive = [
          {
            url: current,
            path: saved.home_portrait_video_storage_path || undefined,
            name:
              saved.home_portrait_video_file_name ||
              "Video portrait sebelumnya",
            size: Number(saved.home_portrait_video_file_size || 0) || undefined,
            savedAt: new Date().toISOString(),
          },
          ...nextArchive.filter((entry) => entry.url !== current),
        ];
      }
      await upsertSettings({
        home_portrait_video_url: item.url,
        home_portrait_video_storage_path: item.path || "",
        home_portrait_video_file_name: item.name,
        home_portrait_video_file_size: String(item.size || ""),
        home_portrait_video_archive: JSON.stringify(nextArchive),
      });
      await load();
    }, "Video portrait arsip sekarang menjadi video aktif.");
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
      const nextArchive = parseArchive(
        saved.home_portrait_video_archive,
      ).filter((entry) => entry.url !== item.url);
      await upsertSettings({
        home_portrait_video_archive: JSON.stringify(nextArchive),
      });
      await load();
    }, "Video portrait arsip dihapus.");
  }

  return (
    <section className="adminPanel homeVideoAdmin portraitVideoAdmin">
      <div className="homeVideoAdminHead">
        <div>
          <span className="adminEyebrow">VIDEO PORTRAIT</span>
          <h2>Video Portrait</h2>
          <p>
            Kelola video portrait 9:16 untuk homepage. Pengunjung menekan
            tombol Play untuk memutar video.
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

      {loading && <p role="status">Memuat video portrait...</p>}
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
              {saved.home_portrait_video_file_name ||
                (currentUrl ? "Video sudah terpasang" : "Belum ada video")}
            </strong>
            {saved.home_portrait_video_file_size && (
              <small>
                {bytes(Number(saved.home_portrait_video_file_size))}
              </small>
            )}
          </div>
          <h3 className="adminStep">1. Pilih video pengganti</h3>
          <fieldset disabled={busy}>
            <div
              className={`videoDropzone portraitDropzone ${dragging ? "dragging" : ""}`}
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
              aria-label="Pilih file video portrait dari perangkat"
            >
              <input
                ref={fileInput}
                type="file"
                accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg"
                onChange={(event) =>
                  void selectFile(event.target.files?.[0] ?? null)
                }
                hidden
              />
              <div className="videoDropIcon portraitDropIcon">9:16</div>
              <strong>{file ? file.name : "Ketuk untuk pilih video"}</strong>
              <span>
                {file
                  ? `${bytes(file.size)}${dimensions ? ` · ${dimensions.width}×${dimensions.height}px` : ""}`
                  : "Pilih dari file di perangkat, atau tarik file ke sini"}
              </span>
              <small>
                MP4, WebM, atau OGG. Maksimal 50 MB. Format tegak 9:16.
              </small>
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
                  Jika tidak dicentang, file lama pada slot ini akan dihapus
                  setelah penggantian berhasil.
                </small>
              </span>
            </label>

            <button
              type="button"
              className="videoUploadBtn"
              disabled={busy || !file}
              onClick={uploadVideo}
            >
              {busy ? "Memproses..." : "Unggah & tampilkan video portrait"}
            </button>
            <p className="adminHelpText">
              Setelah file dipilih, tekan tombol unggah. Biarkan halaman terbuka
              sampai selesai.
            </p>
          </fieldset>

          <form className="adminForm homeVideoMeta" onSubmit={saveText}>
            <fieldset disabled={busy}>
              <legend className="adminStep">2. Judul & gambar sampul</legend>
              <label htmlFor={`${formId}-title`}>Judul video</label>
              <input
                id={`${formId}-title`}
                maxLength={120}
                value={values.home_portrait_video_title ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    home_portrait_video_title: event.target.value,
                  })
                }
              />
              <label htmlFor={`${formId}-description`}>Deskripsi singkat</label>
              <textarea
                id={`${formId}-description`}
                rows={3}
                maxLength={300}
                value={values.home_portrait_video_description ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    home_portrait_video_description: event.target.value,
                  })
                }
              />
              <label htmlFor={`${formId}-poster`}>
                Tautan gambar sampul (opsional)
              </label>
              <input
                id={`${formId}-poster`}
                type="url"
                placeholder="https://..."
                value={values.home_portrait_video_poster_url || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    home_portrait_video_poster_url: event.target.value,
                  })
                }
              />
              <button type="submit">
                {busy ? "Menyimpan..." : "Simpan judul & sampul"}
              </button>
            </fieldset>
          </form>

          <details className="videoArchive">
            <summary>Arsip video portrait ({archive.length})</summary>
            {!archive.length ? (
              <p className="adminHelpText">
                Belum ada video portrait lama yang disimpan.
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
