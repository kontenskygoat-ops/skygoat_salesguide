# SKYGOAT Digital Sales Guide + CMS

Website publik dan CMS internal SKYGOAT berbasis Next.js, Supabase Auth/Database/Storage, dan Vercel.

## Halaman publik

- `/` — Tentang SKYGOAT, video landscape, video portrait, produk, proses, dan legalitas.
- `/sales-guide` — Digital Sales Guide.
- `/gallery` — Galeri foto/video.
- `/media` — redirect ke `/gallery`.

## CMS

- `/admin/login` — Login admin.
- `/admin` — Dashboard.
- `/admin/media` — Kelola galeri.
- `/admin/sales` — Kelola section sales.
- `/admin/settings` — Produk, kontak, video landscape, dan video portrait.

CMS homepage saat ini sengaja memakai **2 video total**:
1. **Landscape story video** — tampil sebagai banner dan baru diputar setelah tombol Play ditekan.
2. **Portrait 9:16** — tampil setelah bagian Tentang SKYGOAT, juga memakai tombol Play.

Upload video menggunakan Supabase Storage bucket `site-media`, maksimal 50 MB per file. Saat mengganti video, file lama dihapus secara default. Centang opsi simpan video lama untuk memasukkannya ke arsip sebelum upload pengganti.

## Setup lokal

```bash
npm install
npm run dev
```

Buat `.env.local` dari `.env.example` dan isi:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env.local` tidak boleh di-commit.

## Supabase

Instalasi baru:
1. Jalankan `supabase/schema.sql`.
2. Buat user di Supabase Authentication.
3. Tambahkan UID user ke `public.admin_users`.
4. Jalankan `supabase/video_storage_migration.sql` bila bucket video belum dibuat.

Database yang sebelumnya memakai teks autoplay portrait dapat menjalankan:

```text
supabase/portrait_manual_play_fix.sql
```

Migration tersebut hanya mengganti teks default autoplay lama dan tidak menimpa deskripsi custom.

## Deploy Vercel

Repo deploy tidak memerlukan `node_modules`, `.next`, `.next-dev`, `.env.local`, atau file audit lokal.

Tambahkan environment variables berikut di Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Lalu deploy branch `main`.

## Validasi

```bash
npm run typecheck
npm run build
```

`npm run check:deploy` memerlukan environment variable Supabase asli.

## Catatan update 18 Sep 2026

- CMS video dikembalikan ke kebutuhan asli: 1 landscape + 1 portrait.
- Portrait memakai manual Play, bukan autoplay.
- Deskripsi produk kosong dari CMS tidak lagi menghilangkan fallback bawaan.
- Carousel produk menghormati reduced motion dan tidak mengganti pilihan user setelah dot dipilih.
- Target sentuh carousel dan tombol tutup galeri diperbesar.
- Anchor `#produk` dan `#flow` tidak lagi tertutup sticky header.
- Search objection handling tidak lagi menggandakan semua jawaban.
- Error playback video landscape dan portrait memiliki fallback yang lebih jelas.
- Kontras label kecil ditingkatkan.
- Cache build, dependency lokal, audit screenshot, dan file sementara tidak termasuk repo.

## Three portrait video slots

Homepage now supports three independent portrait 9:16 videos. Slot 1 keeps the existing `home_portrait_video_*` settings so the current video is preserved. Slots 2 and 3 use `home_portrait_video_2_*` and `home_portrait_video_3_*`.

For an existing Supabase project, run `supabase/portrait_three_slots_migration.sql` once. The CMS then shows separate Portrait 1, Portrait 2, and Portrait 3 panels, each with its own upload, metadata, replacement, and archive.
