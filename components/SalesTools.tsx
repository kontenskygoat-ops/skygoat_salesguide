"use client";
import { useState } from "react";
export default function SalesTools({ objections }: { objections: string[][] }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const results = objections.filter(item => item.join(" ").toLowerCase().includes(query.toLowerCase()));
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setMessage("Skrip disalin."); }
    catch { setMessage("Tidak dapat menyalin otomatis. Pilih dan salin teks di atas."); }
  }
  return <section className="salesTools"><h2>Temukan jawaban cepat</h2>
    <label htmlFor="faq-search">Cari pertanyaan atau kata kunci</label>
    <input id="faq-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Contoh: rasa, kemasan, reseller" />
    <p role="status">{message}</p>
    {results.length ? results.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p><button type="button" onClick={() => copy(answer)}>Salin jawaban</button></article>) : <p>Tidak ada jawaban yang cocok. Coba kata kunci lain.</p>}
  </section>;
}
