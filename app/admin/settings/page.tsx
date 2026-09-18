import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";
import SettingsWorkspace from "@/components/admin/SettingsWorkspace";

export default async function Page() {
  await requireAdmin();
  return (
    <AdminShell>
      <div className="adminTop">
        <span>KELOLA WEBSITE</span>
        <h1>Pengaturan</h1>
        <p>Perbarui video, informasi produk, dan kontak SKYGOAT.</p>
      </div>
      <SettingsWorkspace />
    </AdminShell>
  );
}
