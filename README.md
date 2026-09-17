# SKYGOAT Digital Sales Guide

Project Next.js untuk SKYGOAT dengan 2 halaman utama:

- `/` — Digital Sales Guide
- `/media` — Media, video, dan mesin

Stack:
- Next.js / React / TypeScript
- Supabase
- Google Drive untuk video besar
- Vercel untuk deployment
- GitHub untuk source control

## 1. Buka di VS Code

Extract ZIP ini, lalu:

```bash
cd skygoat_salesguide_nextjs
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## 2. Setup Supabase

Buka Supabase SQL Editor lalu jalankan:

```text
supabase/schema.sql
```

Setelah itu buat file `.env.local` dari `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Restart dev server setelah `.env.local` berubah.

Jika env Supabase belum diisi, halaman `/media` tetap bisa dibuka menggunakan demo/fallback data.

## 3. Google Drive

Untuk setiap file video:

1. Upload ke Google Drive.
2. General access → **Anyone with the link** → Viewer.
3. Masukkan URL Drive biasa ke kolom `video_url` pada tabel `media_assets`.

Contoh URL yang boleh disimpan:

```text
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Website otomatis mengubahnya menjadi:

```text
https://drive.google.com/file/d/FILE_ID/preview
```

dan video diputar lewat modal di halaman `/media`.

Untuk gambar Drive, isi `image_url`. Website mencoba mengubah URL menjadi format Google Drive `uc?export=view`.

**Saran:** video besar di Google Drive, tetapi thumbnail/foto yang sering tampil akan lebih stabil jika nanti dipindah ke Supabase Storage.

## 4. Data Media

Tabel:

```text
media_assets
```

Field utama:

- `title`
- `slug`
- `category`
- `description`
- `image_url`
- `video_url`
- `sort_order`
- `is_active`

Kategori yang tersedia:

```text
mesin
produksi
peternakan
produk
video
```

## 5. Deploy Vercel

1. Push project ke GitHub.
2. Import repository di Vercel.
3. Tambahkan dua environment variable Supabase.
4. Deploy.

## 6. Repository kamu

Repository yang diberikan:

```text
https://github.com/kontenskygoat-ops/skygoat_salesguide.git
```

Saat project ini dibuat, repository tersebut masih kosong. Jadi file ZIP ini bisa dijadikan isi awal repo.

Contoh:

```bash
git clone https://github.com/kontenskygoat-ops/skygoat_salesguide.git
cd skygoat_salesguide
```

Copy seluruh isi ZIP project ke folder repo, lalu:

```bash
git add .
git commit -m "Initial SKYGOAT digital sales guide"
git push origin main
```

## 7. Asset yang perlu dikirim nanti

Untuk versi final:
- logo SKYGOAT resolusi tinggi / SVG
- foto mesin Evaporasi
- foto mesin Mixing
- foto mesin Filling
- foto peternakan
- foto proses produksi
- 3–4 video final
- thumbnail video
- testimoni yang boleh dipublikasikan
- nomor WhatsApp / CTA jika diperlukan

Asset produk sementara di project ini diambil dari PDF Panduan Sales SKYGOAT yang diberikan.
