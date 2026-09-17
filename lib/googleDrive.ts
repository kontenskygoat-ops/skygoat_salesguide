export function extractGoogleDriveFileId(url?: string | null) {
  if (!url) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function googleDrivePreviewUrl(url?: string | null) {
  const id = extractGoogleDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url ?? "";
}

export function googleDriveImageUrl(url?: string | null) {
  const id = extractGoogleDriveFileId(url);
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : url ?? "";
}
