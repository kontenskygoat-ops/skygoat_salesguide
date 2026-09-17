import MediaGallery from "@/components/MediaGallery";
import { getMediaAssets } from "@/lib/data";
import ContentNotice from "@/components/ContentNotice";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { data: items, error } = await getMediaAssets();

  return (
    <main>
      <section className="galleryHero">
        <div className="shell">
          <span className="kicker">SKYGOAT · GALLERY</span>
          <h1>Dokumentasi SKYGOAT.</h1>
          <p>
            Kumpulan foto dan video produk, mesin, peternakan, proses produksi, dan materi dokumentasi lainnya.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sectionHead galleryHead">
            <div>
              <span className="sectionLabel">MEDIA LIBRARY</span>
              <h2>Foto & video dalam satu tempat.</h2>
            </div>
            <p>Gunakan filter kategori untuk menemukan dokumentasi yang dibutuhkan.</p>
          </div>

          {error ? <ContentNotice /> : <MediaGallery items={items} />}
        </div>
      </section>
    </main>
  );
}
