export const settingsFields = [
  ["whatsapp_url", "WhatsApp", "url"], ["instagram_url", "Instagram", "url"],
  ["contact_email", "Email kontak", "email"], ["official_url", "Tautan resmi / katalog", "url"],
  ["tiktok_url", "TikTok", "url"], ["shopee_url", "Shopee", "url"], ["tokopedia_url", "Tokopedia", "url"], ["testimonial_url", "Dokumentasi testimoni", "url"],
  ["footer_text", "Teks footer", "text"], ["home_intro", "Tentang SKYGOAT", "textarea"],
  ["halal_number", "Nomor sertifikat halal", "text"], ["halal_url", "Dokumen halal resmi", "url"],
  ["sales_download_url", "Materi sales (PDF / dokumen)", "url"],
  ...["original", "cokelat", "madu"].flatMap(variant => [
    [variant + "_description", variant + " ? deskripsi", "textarea"],
    [variant + "_composition", variant + " ? komposisi", "textarea"],
    [variant + "_pack", variant + " ? isi kemasan", "text"],
    [variant + "_preparation", variant + " ? cara penyajian", "textarea"],
    [variant + "_bpom", variant + " ? nomor BPOM", "text"],
    [variant + "_document", variant + " ? dokumen produk", "url"],
  ]),
] as const;
