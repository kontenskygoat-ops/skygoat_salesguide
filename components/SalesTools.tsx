"use client";

import { useMemo, useState } from "react";

export default function SalesTools({ objections }: { objections: string[][] }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const normalized = query.trim().toLowerCase();

  const results = useMemo(
    () =>
      normalized
        ? objections.filter((item) =>
            item.join(" ").toLowerCase().includes(normalized),
          )
        : [],
    [normalized, objections],
  );

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Jawaban disalin.");
    } catch {
      setMessage(
        "Tidak dapat menyalin otomatis. Pilih dan salin teks jawaban secara manual.",
      );
    }
  }

  return (
    <section className="salesTools" aria-labelledby="sales-tools-title">
      <h3 id="sales-tools-title">Cari jawaban cepat</h3>
      <label htmlFor="faq-search">Cari pertanyaan atau kata kunci</label>
      <input
        id="faq-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setMessage("");
        }}
        placeholder="Contoh: rasa, kemasan, reseller"
      />
      <p role="status">{message}</p>

      {!normalized ? (
        <p className="salesToolsHint">
          Ketik kata kunci untuk menemukan jawaban dan menyalinnya.
        </p>
      ) : results.length ? (
        results.map(([question, answer]) => (
          <article key={question}>
            <h4>{question}</h4>
            <p>{answer}</p>
            <button type="button" onClick={() => copy(answer)}>
              Salin jawaban
            </button>
          </article>
        ))
      ) : (
        <p>Tidak ada jawaban yang cocok. Coba kata kunci lain.</p>
      )}
    </section>
  );
}
