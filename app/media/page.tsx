import MediaGallery from "@/components/MediaGallery";
import { getMediaAssets } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = await getMediaAssets();

  return (
    <main className="mediaPage">
      <section className="mediaHero">
        <div className="shell">
          <span className="kicker">SKYGOAT · MEDIA LIBRARY</span>
          <h1>PRODUCTION<br />& MEDIA CENTER.</h1>
          <p>
            Halaman untuk foto dan video mesin, proses produksi, peternakan,
            produk, dan dokumentasi SKYGOAT.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="mediaIntro">
            <div>
              <span className="sectionLabel">HALAMAN 02 / MEDIA & MESIN</span>
              <h2>Semua asset penting dalam satu halaman.</h2>
            </div>
            <p>
              Data media dibaca dari tabel <code>media_assets</code> di Supabase.
              Link video Google Drive otomatis diubah menjadi player preview supaya
              video dapat diputar langsung di landing page.
            </p>
          </div>

          <MediaGallery items={items} />
        </div>
      </section>
    </main>
  );
}
