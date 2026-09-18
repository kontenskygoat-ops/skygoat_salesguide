import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";
import SalesAdmin from "@/components/admin/SalesAdmin";
export default async function Page() {
  await requireAdmin();
  return (
    <AdminShell>
      <div className="adminTop">
        <span>KONTEN WEBSITE</span>
        <h1>Panduan sales</h1>
        <p>
          Perbarui materi penjualan dan atur bagian yang ditampilkan kepada
          pengunjung.
        </p>
      </div>
      <SalesAdmin />
    </AdminShell>
  );
}
