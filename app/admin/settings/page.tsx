import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";import SettingsAdmin from "@/components/admin/SettingsAdmin";export default async function Page(){await requireAdmin();return <AdminShell><div className="adminTop"><span>CONFIGURATION</span><h1>Site Settings</h1><p>Pengaturan umum website SKYGOAT.</p></div><SettingsAdmin/></AdminShell>}
