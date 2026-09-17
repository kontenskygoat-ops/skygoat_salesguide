"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabaseBrowser";
export default function Login() {
  const router = useRouter(); const [email,setEmail] = useState(""); const [password,setPassword] = useState(""); const [message,setMessage] = useState(""); const [loading,setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (loading) return;
    setLoading(true); setMessage("");
    try {
      const client = getBrowserSupabase();
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (error) { setMessage("Login gagal. Periksa email dan password, atau coba lagi nanti."); return; }
      const { data: isAdmin, error: adminError } = await client.rpc("is_admin");
      if (adminError || isAdmin !== true) { await client.auth.signOut(); setMessage("Akun ini belum memiliki akses admin. Hubungi pengelola website."); return; }
      router.replace("/admin"); router.refresh();
    } catch { setMessage("Layanan login belum dapat dihubungi. Silakan coba lagi."); }
    finally { setLoading(false); }
  }
  return <main className="loginPage"><form className="loginCard adminForm" onSubmit={submit}><span>SKYGOAT CMS</span><h1>Login Admin</h1><p>Kelola konten dan media website.</p><fieldset disabled={loading}><label htmlFor="login-email">Email</label><input id="login-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /><label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /><p className="notice" role="alert">{message}</p><button type="submit">{loading ? "Memproses..." : "Login"}</button></fieldset></form></main>;
}
