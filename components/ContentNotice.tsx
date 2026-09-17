"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export default function ContentNotice() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className="notice contentNotice" role="status"><p>Sebagian konten belum dapat dimuat. Silakan coba lagi.</p><button disabled={pending} onClick={() => startTransition(() => router.refresh())}>{pending ? "Memuat..." : "Coba lagi"}</button></div>;
}
