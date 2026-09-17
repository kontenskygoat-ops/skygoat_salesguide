import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) redirect("/admin/login");
  const cookieStore = await cookies();
  const client = createServerClient(url, key, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => { /* Middleware owns session refresh. */ } },
  });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/admin/login");
  const { data: admin, error: roleError } = await client.rpc("is_admin");
  if (roleError || admin !== true) redirect("/admin/login");
}
