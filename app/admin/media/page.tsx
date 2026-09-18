import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";
import MediaAdmin from "@/components/admin/MediaAdmin";
export default async function Page() {
  await requireAdmin();
  return (
    <AdminShell>
      <div className="adminTop">
        <span>KONTEN WEBSITE</span>
        <h1>Galeri media</h1>
        <p>
          Kelola foto dan video yang tampil di galeri. Cari media, lalu tekan
          Ubah untuk memperbaruinya.
        </p>
      </div>
      <MediaAdmin />
    </AdminShell>
  );
}
