# SKYGOAT Digital Sales Guide + CMS

Routes:
- `/` Sales Guide
- `/media` Media & Mesin
- `/admin/login` Login CMS
- `/admin` Dashboard
- `/admin/media` CRUD media
- `/admin/sales` Edit section dinamis
- `/admin/settings` Pengaturan umum

## Local
```bash
npm install
npm run dev
```

## Supabase
1. Buat `.env.local` dari `.env.example`.
2. Isi URL + anon key Supabase.
3. Jalankan `supabase/schema.sql` di SQL Editor.
4. Buat user admin: Authentication > Users > Add user.
5. Copy User UID lalu jalankan:
```sql
insert into public.admin_users(user_id) values ('USER-UID');
```
6. Login di `/admin/login`.

## Google Drive video
Di `/admin/media`, masukkan share link Drive biasa ke `Video URL`.
Website otomatis mengubahnya ke `/preview` saat diputar.
Pastikan akses file: **Anyone with the link / Viewer**.

## Deploy Vercel
Tambahkan environment variables yang sama seperti `.env.local` ke Vercel.

Catatan: layout tetap di code. CMS dipakai untuk konten, media, link, dan setting supaya aman.


## Admin protection

Route `/admin`, `/admin/media`, `/admin/sales`, dan `/admin/settings` sekarang dilindungi oleh `middleware.ts`.
Jika belum login atau user bukan anggota `admin_users`, browser otomatis diarahkan ke `/admin/login`.

Link masuk admin dipindahkan dari header ke bagian paling bawah footer dan ditampilkan sebagai teks `Admin` tanpa highlight.


## Product asset update

Official assets supplied by the user are stored in optimized WebP format:

- `public/brand/skygoat-logo.webp`
- `public/products/original.webp`
- `public/products/cokelat.webp`
- `public/products/madu.webp`

The originals were optimized for web use to reduce page weight while keeping transparent backgrounds.


## Struktur halaman publik terbaru

- `/` — Tentang SKYGOAT dan produk
- `/sales-guide` — Digital Sales Guide
- `/gallery` — Galeri foto/video
- `/media` — redirect ke `/gallery`
- `/admin` — CMS internal

Versi ini memakai layout mobile-first yang lebih proporsional:
- logo header lebih kecil
- produk hero di-scale ulang
- navigasi lebih ringkas
- card menjadi 1 kolom di HP
- CTA full-width di HP
- typography dan spacing dikurangi di layar kecil


## Mobile refinement

Tambahan optimasi untuk HP 360–430px:
- header dibuat dua baris agar logo dan navigasi tidak berdesakan
- hero dan product stage diperkecil
- tombol full-width pada HP
- fakta brand dan product card dipadatkan
- Sales Guide diubah menjadi flow vertikal yang lebih mudah dibaca
- filter galeri dibuat horizontal-scroll
- galeri 1 kolom dengan rasio 16:9
- modal video dan footer dirapikan untuk layar kecil


## Logo pilihan terbaru

Website sekarang memakai logo SKYGOAT pilihan terbaru dari `Logo clear.png`.
Asset web disimpan sebagai:

`public/brand/skygoat-logo.webp`

Ukuran tampilan logo juga diperkecil lagi agar lebih proporsional di desktop dan HP.


## Hero product rotator

Hero halaman utama sekarang menampilkan satu produk pada satu waktu.
Varian Original, Cokelat, dan Madu berganti otomatis setiap 3,2 detik.
User juga bisa memilih varian melalui indicator dot.
Implementasi: `components/HeroProductRotator.tsx`.
