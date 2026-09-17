import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/data";
import { resolveSettings } from "@/lib/official";
import { safeUrl, validEmail } from "@/lib/validation";
export default async function Footer() {
  const { data, error } = await getSiteSettings();
  const settings = resolveSettings(data);
  return <footer className="footer"><div className="shell footerMain">
    <div className="footerBrand"><Image src="/brand/skygoat-logo.webp" alt="SKYGOAT" width={104} height={104} /><p>{settings.footer_text ?? "Digital information & sales guide SKYGOAT."}</p></div>
    <nav className="footerNav" aria-label="Navigasi footer"><Link href="/">Tentang SKYGOAT</Link><Link href="/sales-guide">Sales Guide</Link><Link href="/gallery">Galeri</Link></nav>
  </div><div className="shell contactLinks" aria-label="Kontak dan kanal resmi">
    {[["whatsapp_url","WhatsApp"],["instagram_url","Instagram"],["tiktok_url","TikTok"],["shopee_url","Shopee"],["tokopedia_url","Tokopedia"],["official_url","Semua kanal resmi"],["testimonial_url","Dokumentasi testimoni"]].map(([key,label]) => safeUrl(settings[key]) ? <a key={key} href={safeUrl(settings[key])} target="_blank" rel="noopener noreferrer">{label}</a> : null)}
    {validEmail(settings.contact_email ?? "") && <a href={"mailto:" + settings.contact_email}>Email</a>}
    {error && <span role="status">Pembaruan kontak belum dapat dimuat.</span>}
  </div><div className="shell footerBottom"><span>SKYGOAT ? PT. Solusky ? Yogyakarta</span><Link href="/admin" className="footerAdminLink">Admin</Link></div></footer>;
}
