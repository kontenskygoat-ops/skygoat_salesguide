"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="shell section"><h1>Halaman belum dapat dimuat</h1><p>Terjadi kendala saat memuat halaman. Silakan coba lagi.</p><button onClick={reset}>Coba lagi</button></main>; }
