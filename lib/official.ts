// Source supplied by the owner: https://taplink.cc/skygoatofficial (17 September 2026).
// No health claims or certification numbers are inferred from the link directory.
export const officialDefaults: Record<string, string> = {
  whatsapp_url: "https://wa.me/6287700330005",
  official_url: "https://taplink.cc/skygoatofficial",
  tiktok_url: "https://www.tiktok.com/@skygoatsusukambing",
  shopee_url: "https://shopee.co.id/pt.solusky?categoryId=100629&itemId=10176881770",
  tokopedia_url: "https://www.tokopedia.com/soluskyskygoat",
  testimonial_url: "https://drive.google.com/drive/folders/1z6D87YAlTIeKTg9rqSYTJcZoN5TLRFWF?usp=share_link",
};
export function resolveSettings(saved: Record<string, string>) {
  const result = { ...officialDefaults, ...saved };
  // Existing installations seed empty contacts. Bootstrap official contacts once;
  // after the first settings save, an explicitly empty value means hidden.
  if (!saved.official_defaults_version) for (const [key, value] of Object.entries(officialDefaults)) if (!saved[key]) result[key] = value;
  return result;
}
