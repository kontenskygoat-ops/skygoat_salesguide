import Link from "next/link";
import { getSalesSections, getSiteSettings } from "@/lib/data";
import { safeUrl } from "@/lib/validation";
import ContentNotice from "@/components/ContentNotice";
import SalesTools from "@/components/SalesTools";

export const dynamic = "force-dynamic";

const objections = [
  ["“Susu kambing amis nggak?”", "Gunakan informasi resmi produk: aroma dan rasa segar, tidak amis, dan sesuai varian rasa."],
  ["“Sudah BPOM dan Halal?”", "Tunjukkan data izin edar dan ketetapan halal yang tercantum pada materi resmi produk."],
  ["“Kenapa bentuk sachet?”", "Sachet membantu penyajian lebih praktis dan menjaga porsi yang belum digunakan tetap tertutup."],
  ["“Apa bedanya dengan produk lain?”", "Fokus pada fakta SKYGOAT: produsen, pilihan varian, kemasan, proses, dan legalitas. Hindari menjatuhkan merek lain."],
  ["“Saya pikir-pikir dulu.”", "Jangan memaksa. Ringkas kebutuhan customer, tawarkan opsi sederhana, lalu lakukan follow-up secara wajar."]
];

export default async function SalesGuidePage() {
  const [{ data: sections, error }, { data: settings }] = await Promise.all([getSalesSections(), getSiteSettings()]);
  const hero = sections.find((s) => s.section_key === "hero");

  return (
    <main>
      {error && <div className="shell"><ContentNotice /></div>}
      {hero && <section className="salesHero">
        <div className="shell salesHeroInner">
          <span className="kicker">SKYGOAT · DIGITAL SALES GUIDE</span>
          <h1>
            {hero.title}
            <br />
            <em>{hero.subtitle}</em>
          </h1>
          <p>
            {hero.content}
          </p>
          <div className="heroButtons">
            {hero.button_text && safeUrl(hero.button_url, true) && <a className="button primary" href={hero.button_url === "#start" ? "#flow" : safeUrl(hero.button_url, true)}>{hero.button_text}</a>}
            <Link className="button outline" href="/gallery">Buka Galeri</Link>
          </div>
        </div>
      </section>}

      <section className="salesJourney shell" id="flow" aria-label="Alur panduan">
        {[
          ["01", "Know the Product"],
          ["02", "Know Your Customer"],
          ["03", "Build the Pitch"],
          ["04", "Handle Objections"],
          ["05", "Close & Follow Up"]
        ].map(([num, label]) => (
          <div key={num}><b>{num}</b><span>{label}</span></div>
        ))}
      </section>

      <section className="section">
        <div className="shell">
          <span className="sectionLabel">01 / KNOW YOUR CUSTOMER</span>
          <h2>Jangan langsung jual. Cari kebutuhan customer.</h2>
          <div className="personaGrid">
            <article><b>01</b><h3>Keluarga</h3><p>Mencari produk praktis untuk konsumsi rumah tangga.</p><small>Masuk dari: kemudahan penyajian, sachet, dan pilihan rasa.</small></article>
            <article><b>02</b><h3>First-time Buyer</h3><p>Belum pernah mencoba susu kambing atau ragu soal rasa.</p><small>Masuk dari: karakter rasa, varian, dan cara penyajian.</small></article>
            <article><b>03</b><h3>Repeat Buyer</h3><p>Sudah familiar dan membutuhkan repeat order yang mudah.</p><small>Masuk dari: stok, varian, dan follow-up.</small></article>
            <article><b>04</b><h3>Calon Mitra</h3><p>Tertarik menjadi agen atau reseller.</p><small>Masuk dari: produk, materi penjualan, dan sistem kemitraan.</small></article>
          </div>
        </div>
      </section>

      <section className="section blueSection">
        <div className="shell">
          <span className="sectionLabel light">02 / HOW TO SELL</span>
          <h2>Gunakan alur percakapan, bukan presentasi panjang.</h2>
          <div className="salesFlow">
            {[
              ["OPEN", "Mulai dengan pertanyaan", "“Kak, sebelumnya pernah coba susu kambing atau baru pertama kali?”"],
              ["PROBE", "Cari kebutuhan", "“Untuk konsumsi sendiri atau untuk keluarga di rumah?”"],
              ["MATCH", "Hubungkan dengan produk", "Pilih informasi yang relevan: rasa, kemasan, cara penyajian, proses, dan legalitas."],
              ["PROOF", "Bangun kepercayaan", "Gunakan informasi yang memang bisa dibuktikan dari materi resmi produk."],
              ["CLOSE", "Buat pilihan mudah", "“Mau mulai dari satu varian dulu atau sekalian coba varian lain?”"]
            ].map(([tag, title, text]) => (
              <article key={tag}>
                <span>{tag}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <span className="sectionLabel">03 / OBJECTION HANDLING</span>
          <h2>Dengarkan keberatan customer sebelum menjawab.</h2>
          <div className="faq">
            {objections.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<span>+</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <SalesTools objections={objections} />
        </div>
      </section>

      <section className="section closingSection">
        <div className="shell closingGrid">
          <div>
            <span className="sectionLabel light">04 / CLOSE & FOLLOW UP</span>
            <h2>Closing = membantu customer memilih.</h2>
          </div>
          <div className="scriptCard">
            <span>CLOSING SCRIPT</span>
            <p>“Dari kebutuhan Kakak tadi, kita bisa mulai dari varian yang paling nyaman dulu. Mau coba satu box atau sekalian dua varian?”</p>
            <hr />
            <span>FOLLOW-UP</span>
            <p>“Halo Kak, kemarin sempat tanya SKYGOAT. Ada yang masih ingin ditanyakan soal varian atau cara penyajiannya?”</p>
          </div>
        </div>
      </section>

      {safeUrl(settings.sales_download_url) && <div className="shell salesDownload"><a className="button primary" href={safeUrl(settings.sales_download_url)} target="_blank" rel="noopener noreferrer">Buka materi sales</a></div>}
      {sections.filter(section => section.section_key !== "hero").map(section => <section className="section" key={section.id}>
        <div className="shell">
          {section.subtitle && <span className="sectionLabel">{section.subtitle}</span>}
          {section.title && <h2>{section.title}</h2>}
          {section.content && <p className="preserveLines">{section.content}</p>}
          {section.button_text && safeUrl(section.button_url, true) && <a className="button primary" href={safeUrl(section.button_url, true)}>{section.button_text}</a>}
        </div>
      </section>)}
      <section className="warningNote">
        <div className="shell">
          <strong>Catatan untuk sales:</strong>
          <p>Gunakan informasi produk, komposisi, legalitas, dan cara konsumsi yang memang didukung materi resmi. Jangan mengubah testimoni menjadi klaim bahwa produk mengobati penyakit.</p>
        </div>
      </section>
    </main>
  );
}
