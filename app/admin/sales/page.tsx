import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";import SalesAdmin from "@/components/admin/SalesAdmin";export default async function Page(){await requireAdmin();return <AdminShell><div className="adminTop"><span>CONTENT</span><h1>Sales Guide</h1><p>Edit konten dinamis tanpa mengubah layout website.</p></div><SalesAdmin/></AdminShell>}
