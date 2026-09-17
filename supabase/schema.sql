create extension if not exists "pgcrypto";

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null check (category in ('mesin','produksi','peternakan','produk','video')),
  description text,
  image_url text,
  video_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

drop policy if exists "Public can read active media" on public.media_assets;
create policy "Public can read active media"
on public.media_assets
for select
using (is_active = true);

insert into public.media_assets
  (title, slug, category, description, sort_order, is_active)
values
  ('Mesin Evaporasi', 'mesin-evaporasi', 'mesin', 'Dokumentasi mesin evaporasi SKYGOAT.', 1, true),
  ('Mesin Mixing', 'mesin-mixing', 'mesin', 'Dokumentasi proses mixing bahan baku SKYGOAT.', 2, true),
  ('Mesin Filling', 'mesin-filling', 'mesin', 'Dokumentasi proses filling dan pengemasan.', 3, true)
on conflict (slug) do nothing;
