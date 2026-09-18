import { safeUrl } from "./validation";

export function extractGoogleDriveFileId(value?: string | null) {
  const safe = safeUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  if (!["drive.google.com", "docs.google.com"].includes(url.hostname)) return null;
  const id = url.pathname.match(/\/(?:file\/)?d\/([\w-]+)/)?.[1] ?? url.searchParams.get("id");
  return id && /^[\w-]+$/.test(id) ? id : null;
}

function isSupabaseStorageVideo(url: URL) {
  const isSupabaseHost = /(?:^|\.)supabase\.(?:co|in)$/i.test(url.hostname);
  const isStoragePath = url.pathname.includes("/storage/v1/object/");
  return isSupabaseHost && isStoragePath;
}

export function videoSource(value?: string | null): { kind: "iframe" | "video"; url: string } | null {
  const safe = safeUrl(value);
  if (!safe) return null;

  const id = extractGoogleDriveFileId(safe);
  if (id) return { kind: "iframe", url: "https://drive.google.com/file/d/" + id + "/preview" };

  const url = new URL(safe);
  // Direct video files are accepted normally. Supabase Storage public/signed
  // object URLs are also accepted even when the object URL no longer ends in
  // .mp4/.webm/.ogg (for example because of a transformed or signed path).
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname) || isSupabaseStorageVideo(url)) {
    return { kind: "video", url: safe };
  }
  return null;
}

export function googleDriveImageUrl(value?: string | null) {
  const id = extractGoogleDriveFileId(value);
  return id ? "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600" : safeUrl(value);
}
