export const settingsFields = [
  ["whatsapp_url", "WhatsApp", "url"],
  ["instagram_url", "Instagram", "url"],
  ["contact_email", "Email kontak", "email"],
  ["official_url", "Tautan resmi / katalog", "url"],
  ["tiktok_url", "TikTok", "url"],
  ["shopee_url", "Shopee", "url"],
  ["tokopedia_url", "Tokopedia", "url"],
  ["testimonial_url", "Dokumentasi testimoni", "url"],
  ["footer_text", "Teks footer", "text"],
  ["home_intro", "Tentang SKYGOAT", "textarea"],
  ["halal_number", "Nomor sertifikat halal", "text"],
  ["halal_url", "Dokumen halal resmi", "url"],
  ["sales_download_url", "Materi sales (PDF / dokumen)", "url"],
  ...["original", "cokelat", "madu"].flatMap((variant) => [
    [variant + "_description", "Deskripsi produk", "textarea"],
    [variant + "_composition", "Komposisi", "textarea"],
    [variant + "_pack", "Isi kemasan", "text"],
    [variant + "_preparation", "Cara penyajian", "textarea"],
    [variant + "_bpom", "Nomor BPOM", "text"],
    [variant + "_document", "Tautan dokumen produk", "url"],
  ]),
] as const;

export const settingsGroups = {
  products: [
    {
      title: "Original",
      keys: settingsFields
        .filter(([key]) => key.startsWith("original_"))
        .map(([key]) => key),
    },
    {
      title: "Cokelat",
      keys: settingsFields
        .filter(([key]) => key.startsWith("cokelat_"))
        .map(([key]) => key),
    },
    {
      title: "Madu",
      keys: settingsFields
        .filter(([key]) => key.startsWith("madu_"))
        .map(([key]) => key),
    },
    { title: "Dokumen halal", keys: ["halal_number", "halal_url"] },
  ],
  contact: [
    {
      title: "Kontak pelanggan",
      keys: ["whatsapp_url", "contact_email", "official_url"],
    },
    {
      title: "Media sosial & toko",
      keys: [
        "instagram_url",
        "tiktok_url",
        "shopee_url",
        "tokopedia_url",
        "testimonial_url",
      ],
    },
    {
      title: "Informasi website",
      keys: ["home_intro", "footer_text", "sales_download_url"],
    },
  ],
};
