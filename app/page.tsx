import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/data";
import { resolveSettings } from "@/lib/official";
import { safeUrl } from "@/lib/validation";
import ContentNotice from "@/components/ContentNotice";
import HeroProductRotator from "@/components/HeroProductRotator";
export const dynamic = "force-dynamic";

const processSteps = [
  ["01", "Pemerahan Susu", "Pemerahan dilakukan di shelter di sekitar peternakan."],
  ["02", "Penyimpanan Steril", "Kebersihan dan suhu penyimpanan selalu diawasi."],
  ["03", "Pasteurisasi & Evaporasi", "Tahap pengolahan susu cair menuju bentuk bubuk."],
  ["04", "Proses Mixing", "Pencampuran bahan baku sesuai formulasi produk."],
  ["05", "Proses Packing", "Produk dikemas dalam sachet, packaging, dan box."]
];

const products = [
  {
    name: "Original",
    image: "/products/original.webp",
    desc: "Varian original SKYGOAT dengan karakter rasa susu kambing Etawa."
  },
  {
    name: "Cokelat",
    image: "/products/cokelat.webp",
    desc: "Varian cokelat dengan tambahan kakao bubuk."
  },
  {
    name: "Madu",
    image: "/products/madu.webp",
    desc: "Varian madu dengan tambahan madu bubuk."
  }
];

export default async function HomePage() {
  const { data, error } = await getSiteSettings();
  const settings = resolveSettings(data);
  const whatsapp = safeUrl(settings.whatsapp_url);
  return (
    <main>
      {error && <div className="shell"><ContentNotice /></div>}
      <section className="homeHero">
        <div className="shell homeHeroGrid">
          <div className="homeHeroCopy">
            <span className="kicker">SKYGOAT · SUSU KAMBING ETAWA BUBUK</span>
            <h1>Kenali SKYGOAT lebih dekat.</h1>
            <p>
              SKYGOAT adalah susu kambing Etawa bubuk yang diproduksi oleh PT. Solusky
              di Daerah Istimewa Yogyakarta dan mulai dipasarkan sejak 2015.
            </p>
            <div className="heroButtons">
              <a className="button primary" href="#produk">Lihat Produk</a>
              <Link className="button outline" href="/sales-guide">Buka Sales Guide</Link>
              {whatsapp && <a className="button white" href={whatsapp} target="_blank" rel="noopener noreferrer">Hubungi Customer Service</a>}
            </div>
          </div>
          <div className="homeProductStage">
            <HeroProductRotator />
          </div>
        </div>
      </section>

      <section className="brandStrip">
        <div className="shell brandStripGrid">
          <div><strong>2015</strong><span>Mulai dipasarkan</span></div>
          <div><strong>3 Varian</strong><span>Original, Cokelat, Madu</span></div>
          <div><strong>Yogyakarta</strong><span>Diproduksi PT. Solusky</span></div>
          <div><strong>Customer Service</strong><span>Konsultasi produk dan kemitraan</span></div>
        </div>
      </section>

      <section className="section introSection">
        <div className="shell introGrid">
          <div>
            <span className="sectionLabel">TENTANG SKYGOAT</span>
            <h2>Dari Yogyakarta, tumbuh melalui jaringan kemitraan.</h2>
          </div>
          <div className="introText">
            {settings.home_intro ? <p className="preserveLines">{settings.home_intro}</p> : <>
            <p>
              SKYGOAT diproduksi dan dipasarkan sejak 2015. Distribusinya berkembang
              melalui sistem kemitraan seperti distributor resmi, agen, dan reseller.
            </p>
            <p>
              Format bubuk dan kemasan sachet membuat produk praktis untuk disajikan
              serta mudah dibawa dan disimpan.
            </p></>}
          </div>
        </div>
      </section>

      <section className="section productSection" id="produk">
        <div className="shell">
          <div className="sectionHead">
            <div>
              <span className="sectionLabel">PRODUK SKYGOAT</span>
              <h2>Tiga pilihan varian.</h2>
            </div>
            <p>Pilih rasa sesuai preferensi customer atau kebutuhan konsumsi keluarga.</p>
          </div>

          <div className="productCards">
            {products.map((product) => (
              <article className="productCard" key={product.name}>
                <div className="productCardImage">
                  <Image src={product.image} alt={`SKYGOAT ${product.name}`} width={600} height={800} sizes="(max-width: 640px) 85vw, (max-width: 900px) 45vw, 340px" />
                </div>
                <div className="productCardBody">
                  <span>SKYGOAT</span>
                  <h3>{product.name}</h3>
                  <p>{settings[product.name.toLowerCase() + "_description"] ?? product.desc}</p>
                  <dl className="productDetails">{[["composition", "Komposisi"], ["pack", "Isi kemasan"], ["preparation", "Cara penyajian"], ["bpom", "Nomor BPOM"]].map(([key, label]) => settings[product.name.toLowerCase() + "_" + key] ? <div key={key}><dt>{label}</dt><dd>{settings[product.name.toLowerCase() + "_" + key]}</dd></div> : null)}</dl>
                  {safeUrl(settings[product.name.toLowerCase() + "_document"]) && <a className="textButton" href={safeUrl(settings[product.name.toLowerCase() + "_document"])} target="_blank" rel="noopener noreferrer">Dokumen produk</a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section processSection">
        <div className="shell">
          <span className="sectionLabel light">PROSES PRODUKSI</span>
          <h2>From farm to pack.</h2>
          <div className="processGrid">
            {processSteps.map(([num, title, desc]) => (
              <article key={num}>
                <b>{num}</b>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {(settings.halal_number || safeUrl(settings.halal_url)) && <section className="section qualitySection"><div className="shell"><span className="sectionLabel">LEGALITAS PRODUK</span><h2>Informasi halal</h2>{settings.halal_number && <p>Nomor sertifikat: {settings.halal_number}</p>}{safeUrl(settings.halal_url) && <a className="button primary" href={safeUrl(settings.halal_url)} target="_blank" rel="noopener noreferrer">Lihat dokumen resmi</a>}</div></section>}

      <section className="homeCta">
        <div className="shell homeCtaInner">
          <div>
            <span>LANJUTKAN</span>
            <h2>Pelajari cara menjual SKYGOAT.</h2>
          </div>
          <Link className="button white" href="/sales-guide">Buka Sales Guide →</Link>
        </div>
      </section>
    </main>
  );
}
