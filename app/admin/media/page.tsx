import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";import MediaAdmin from "@/components/admin/MediaAdmin";export default async function Page(){await requireAdmin();return <AdminShell><div className="adminTop"><span>CONTENT</span><h1>Media & Mesin</h1><p>Tambah atau edit media yang tampil di halaman galeri.</p></div><MediaAdmin/></AdminShell>}
