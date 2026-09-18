export function createUploadId(): string {
  // getRandomValues also works on LAN HTTP, where randomUUID is unavailable.
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}
