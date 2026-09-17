import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";
import SettingsAdmin from "@/components/admin/SettingsAdmin";
import HomeVideoAdmin from "@/components/admin/HomeVideoAdmin";
import HomePortraitVideoAdmin from "@/components/admin/HomePortraitVideoAdmin";

export default async function Page() {
  await requireAdmin();
  return <AdminShell>
    <div className="adminTop"><span>CONFIGURATION</span><h1>Site Settings</h1><p>Pengaturan umum website SKYGOAT, produk, kontak, dan video homepage.</p></div>
    <div className="adminSettingsStack">
      <HomeVideoAdmin />
      <HomePortraitVideoAdmin />
      <SettingsAdmin />
    </div>
  </AdminShell>;
}
