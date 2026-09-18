"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
import { useAdminMutation } from "./useAdmin";
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const { busy, message, run } = useAdminMutation();
  const links = [
    ["/admin", "Beranda"],
    ["/admin/media", "Galeri media"],
    ["/admin/sales", "Panduan sales"],
    ["/admin/settings", "Pengaturan"],
  ];
  async function logout() {
    await run(async () => {
      const { error } = await getBrowserSupabase().auth.signOut();
      if (error) throw error;
      router.replace("/admin/login");
      router.refresh();
    }, "Anda telah keluar.");
  }
  return (
    <div className="adminLayout">
      <a className="adminSkip" href="#admin-content">
        Langsung ke konten
      </a>
      <aside className="adminSidebar">
        <div className="adminBrand">
          SKYGOAT <span>Kelola website</span>
        </div>
        <nav aria-label="Navigasi admin">
          {links.map(([href, label]) => (
            <Link
              key={href}
              className={path === href ? "active" : ""}
              aria-current={path === href ? "page" : undefined}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="adminAccount">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Lihat website<span className="srOnly"> (tab baru)</span>
          </Link>
          <button disabled={busy} onClick={logout}>
            {busy ? "Keluar..." : "Keluar akun"}
          </button>
        </div>
        <p className="adminAccountMessage" role="status">
          {message}
        </p>
      </aside>
      <main id="admin-content" tabIndex={-1} className="adminMain">
        {children}
      </main>
    </div>
  );
}
