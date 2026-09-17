import { safeUrl } from "./validation";
export function extractGoogleDriveFileId(value?: string | null) {
  const safe = safeUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  if (!["drive.google.com", "docs.google.com"].includes(url.hostname)) return null;
  const id = url.pathname.match(/\/(?:file\/)?d\/([\w-]+)/)?.[1] ?? url.searchParams.get("id");
  return id && /^[\w-]+$/.test(id) ? id : null;
}
export function videoSource(value?: string | null): { kind: "iframe" | "video"; url: string } | null {
  const safe = safeUrl(value);
  if (!safe) return null;
  const id = extractGoogleDriveFileId(safe);
  if (id) return { kind: "iframe", url: "https://drive.google.com/file/d/" + id + "/preview" };
  const url = new URL(safe);
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { kind: "video", url: safe };
  return null;
}
export function googleDriveImageUrl(value?: string | null) {
  const id = extractGoogleDriveFileId(value);
  return id ? "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600" : safeUrl(value);
}
