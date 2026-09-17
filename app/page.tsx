import Link from "next/link";

const processSteps = [
  ["01", "Pemerahan Susu", "Pemerahan dilakukan di shelter sekitar peternakan."],
  ["02", "Penyimpanan Steril", "Kebersihan dan suhu penyimpanan diawasi."],
  ["03", "Pasteurisasi & Evaporasi", "Tahap pengolahan susu menuju bentuk bubuk."],
  ["04", "Proses Mixing", "Pencampuran bahan baku sesuai formulasi produk."],
  ["05", "Proses Packing", "Pengemasan dalam sachet, packaging, dan box."]
];

const objections = [
  ["“Susu kambing amis nggak?”", "Gunakan informasi resmi produk: aroma dan rasa segar, tidak amis, dan sesuai dengan varian rasa."],
  ["“Sudah BPOM dan Halal?”", "Tunjukkan nomor izin BPOM masing-masing varian dan data ketetapan halal yang tersedia pada materi resmi."],
  ["“Kenapa bentuk sachet?”", "Sachet membuat penyajian lebih praktis dan membantu menjaga produk yang belum digunakan tetap tertutup."],
  ["“Apa bedanya dengan produk lain?”", "Fokus pada fakta SKYGOAT: diproduksi PT. Solusky, tersedia dalam beberapa varian, kemasan sachet, serta memiliki data legalitas produk. Hindari menjatuhkan merek lain."],
  ["“Saya pikir-pikir dulu.”", "Jangan memaksa. Ringkas kebutuhan customer, tawarkan opsi sederhana, lalu lakukan follow-up secara wajar."]
];

export default function SalesGuidePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroGlow" />
        <div className="shell heroGrid">
          <div>
            <span className="kicker">SKYGOAT · DIGITAL SALES GUIDE</span>
            <h1>
              KNOW THE PRODUCT.
              <br />
              <em>SELL WITH CONFIDENCE.</em>
            </h1>
            <p>
              Panduan digital untuk membantu sales, agen, dan reseller memahami SKYGOAT,
              mengenali kebutuhan customer, menjawab pertanyaan, dan melakukan follow-up
              dengan lebih terarah.
            </p>
            <div className="heroButtons">
              <a className="button primary" href="#start">Mulai Panduan</a>
              <Link className="button outline" href="/media">Buka Media & Mesin</Link>
            </div>
          </div>

          <div className="productVisual">
            <img className="product p1" src="/products/cokelat.jpg" alt="SKYGOAT Cokelat" />
            <img className="product p2" src="/products/madu.jpg" alt="SKYGOAT Madu" />
            <img className="product p3" src="/products/original.jpg" alt="SKYGOAT Original" />
          </div>
        </div>
      </section>

      <section className="journey shell" id="start">
        {[
          ["01", "Know the Product"],
          ["02", "Know Your Customer"],
          ["03", "Build the Pitch"],
          ["04", "Handle Objections"],
          ["05", "Close & Follow Up"]
        ].map(([n, t]) => (
          <div key={n}><b>{n}</b><span>{t}</span></div>
        ))}
      </section>

      <section className="section">
        <div className="shell split">
          <div>
            <span className="sectionLabel">01 / PRODUCT KNOWLEDGE</span>
            <h2>Kenali SKYGOAT sebelum menjualnya.</h2>
            <p className="lead">
              SKYGOAT adalah susu kambing Etawa bubuk yang diproduksi oleh PT. Solusky
              di Daerah Istimewa Yogyakarta. Produk mulai diproduksi dan dipasarkan sejak 2015
              serta didistribusikan melalui sistem kemitraan distributor, agen, dan reseller.
            </p>

            <div className="statRow">
              <div><strong>2015</strong><span>Mulai dipasarkan</span></div>
              <div><strong>3</strong><span>Varian utama</span></div>
              <div><strong>BPOM</strong><span>& Halal</span></div>
            </div>
          </div>

          <div className="infoCard">
            <span>PRODUCT STRUCTURE</span>
            <h3>Informasi yang perlu dikuasai sales</h3>
            <ul>
              <li>Kemasan primer: aluminium foil</li>
              <li>Kemasan sekunder: box kertas tebal</li>
              <li>Tekstur produk: bubuk</li>
              <li>Umur simpan pada panduan: 16 bulan</li>
              <li>Produsen: PT. Solusky, Yogyakarta</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="darkSection section">
        <div className="shell">
          <span className="sectionLabel light">FROM FARM TO PACK</span>
          <h2>Jelaskan prosesnya dengan sederhana.</h2>
          <div className="processGrid">
            {processSteps.map(([n, title, desc]) => (
              <article key={n}>
                <b>{n}</b>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <span className="sectionLabel">02 / KNOW YOUR CUSTOMER</span>
          <h2>Jangan langsung jual. Cari kebutuhannya dulu.</h2>

          <div className="personaGrid">
            <article>
              <b>01</b><h3>Keluarga</h3>
              <p>Mencari produk praktis untuk konsumsi rumah tangga.</p>
              <small>Masuk dari: kemudahan penyajian, sachet, dan pilihan rasa.</small>
            </article>
            <article>
              <b>02</b><h3>First-time Buyer</h3>
              <p>Belum pernah mencoba susu kambing atau ragu soal rasa.</p>
              <small>Masuk dari: karakter rasa, pilihan varian, dan cara penyajian.</small>
            </article>
            <article>
              <b>03</b><h3>Repeat Buyer</h3>
              <p>Sudah familiar dan membutuhkan repeat order yang mudah.</p>
              <small>Masuk dari: stok, ketersediaan varian, dan follow-up.</small>
            </article>
            <article>
              <b>04</b><h3>Calon Mitra</h3>
              <p>Tertarik menjadi agen atau reseller.</p>
              <small>Masuk dari: produk, materi penjualan, dan sistem kemitraan.</small>
            </article>
          </div>
        </div>
      </section>

      <section className="blueSection section">
        <div className="shell">
          <span className="sectionLabel light">03 / SALES FLOW</span>
          <h2>Gunakan alur percakapan, bukan presentasi panjang.</h2>

          <div className="salesFlow">
            {[
              ["OPEN", "Mulai dengan pertanyaan", "“Kak, sebelumnya pernah coba susu kambing atau baru pertama kali?”"],
              ["PROBE", "Cari kebutuhan", "“Untuk konsumsi sendiri atau untuk keluarga di rumah?”"],
              ["MATCH", "Hubungkan dengan produk", "Pilih informasi yang relevan: varian, sachet, rasa, legalitas, dan cara penyajian."],
              ["PROOF", "Bangun kepercayaan", "Gunakan informasi legalitas, detail produk, dan dokumentasi yang memang bisa dibuktikan."],
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
          <span className="sectionLabel">04 / OBJECTION HANDLING</span>
          <h2>Customer keberatan? Dengarkan dulu.</h2>

          <div className="faq">
            {objections.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<span>+</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="trust section">
        <div className="shell trustGrid">
          <div>
            <span className="sectionLabel">PRODUCT TRUST</span>
            <h2>Gunakan fakta yang bisa dibuktikan.</h2>
            <p className="lead">
              Data di bawah mengikuti panduan sales yang kamu berikan. Jika ada pembaruan izin,
              ubah ke data resmi terbaru sebelum dipublikasikan.
            </p>
          </div>
          <div className="trustCards">
            <div><b>BPOM</b><strong>Original</strong><span>MD 803112006005</span></div>
            <div><b>BPOM</b><strong>Cokelat</strong><span>MD 803112008005</span></div>
            <div><b>BPOM</b><strong>Madu</strong><span>MD 800912009005</span></div>
            <div><b>HALAL</b><strong>LPPOM DIY</strong><span>12040001280622</span></div>
          </div>
        </div>
      </section>

      <section className="warning section">
        <div className="shell narrow">
          <span className="sectionLabel">IMPORTANT SALES NOTE</span>
          <h2>Hindari klaim pengobatan yang tidak tercantum sebagai klaim resmi produk.</h2>
          <p>
            Gunakan informasi produk, komposisi, legalitas, cara konsumsi, dan informasi nutrisi
            yang memang disetujui untuk komunikasi produk. Testimoni customer sebaiknya tidak
            diubah menjadi klaim bahwa produk mengobati penyakit.
          </p>
        </div>
      </section>

      <section className="darkSection section">
        <div className="shell closingGrid">
          <div>
            <span className="sectionLabel light">05 / CLOSE & FOLLOW UP</span>
            <h2>Closing = membantu customer memilih.</h2>
          </div>
          <div className="scriptCard">
            <span>CLOSING SCRIPT</span>
            <p>
              “Dari kebutuhan Kakak tadi, kita bisa mulai dari varian yang paling nyaman dulu.
              Kakak mau coba satu box atau sekalian dua varian?”
            </p>
            <hr />
            <span>FOLLOW-UP</span>
            <p>
              “Halo Kak, kemarin sempat tanya SKYGOAT. Ada yang masih ingin ditanyakan
              soal varian atau cara penyajiannya?”
            </p>
          </div>
        </div>
      </section>

      <section className="mediaCta">
        <div className="shell">
          <span>HALAMAN 02</span>
          <h2>Butuh foto atau video produksi?</h2>
          <p>Buka Media & Mesin untuk melihat dokumentasi yang ditarik dari Supabase dan Google Drive.</p>
          <Link href="/media" className="button white">Buka Media & Mesin →</Link>
        </div>
      </section>
    </main>
  );
}
