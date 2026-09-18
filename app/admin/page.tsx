import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";

export default async function Admin() {
  await requireAdmin();
  return (
    <AdminShell>
      <div className="adminTop">
        <span>SKYGOAT CMS</span>
        <h1>Apa yang ingin diperbarui?</h1>
        <p>
          Pilih bagian website yang ingin dikelola. Perubahan tampil setelah
          Anda menekan Simpan.
        </p>
      </div>
      <div className="adminStats">
        {[
          [
            "Video, produk & kontak",
            "Atur 3 video portrait, 1 video landscape, informasi produk, serta kontak pelanggan.",
            "/admin/settings",
            "Buka pengaturan",
          ],
          [
            "Galeri foto & video",
            "Tambahkan dokumentasi produk, produksi, peternakan, dan mesin.",
            "/admin/media",
            "Kelola galeri",
          ],
          [
            "Panduan sales",
            "Perbarui judul, materi penjualan, dan tombol pada halaman panduan.",
            "/admin/sales",
            "Kelola panduan sales",
          ],
        ].map(([title, description, href, label]) => (
          <article key={href}>
            <h2>{title}</h2>
            <p>{description}</p>
            <Link href={href}>{label}</Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
