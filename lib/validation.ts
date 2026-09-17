export function safeUrl(value?: string | null, internal = false): string {
  const text = value?.trim() ?? "";
  if (!text || /[\u0000-\u0020\\]/.test(text)) return "";
  if (internal && (/^\/(?!\/)/.test(text) || /^#[a-zA-Z][\w-]*$/.test(text))) return text;
  try {
    const url = new URL(text);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}
export function validEmail(value: string): boolean {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}
export function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && error.code === "23505") return "Slug atau kunci ini sudah digunakan. Gunakan nilai lain.";
  return "Proses gagal. Periksa koneksi dan hak akses admin, lalu coba lagi.";
}
