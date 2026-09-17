"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { useAdminMutation } from "./useAdmin";
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter();
  const { busy, message, run } = useAdminMutation();
  const links = [["/admin", "Dashboard"], ["/admin/media", "Media & Mesin"], ["/admin/sales", "Sales Guide"], ["/admin/settings", "Kontak, Produk & Video"]];
  async function logout() { await run(async () => { const { error } = await getBrowserSupabase().auth.signOut(); if (error) throw error; router.replace("/admin/login"); router.refresh(); }, "Anda telah keluar."); }
  return <div className="adminLayout"><aside className="adminSidebar"><div className="adminBrand">SKYGOAT <span>CMS</span></div><nav aria-label="Navigasi admin">{links.map(([href,label]) => <Link key={href} className={path === href ? "active" : ""} aria-current={path === href ? "page" : undefined} href={href}>{label}</Link>)}</nav><Link href="/" target="_blank">Lihat website ?</Link><button disabled={busy} onClick={logout}>{busy ? "Keluar..." : "Logout"}</button><p role="status">{message}</p></aside><main className="adminMain">{children}</main></div>;
}
