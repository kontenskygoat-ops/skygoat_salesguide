create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admin_users where user_id=auth.uid());
$$;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null,
  category text not null check(category in ('mesin','produksi','peternakan','produk','video')),
  description text, image_url text, video_url text, sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.media_assets enable row level security;
create policy "public read active media" on public.media_assets for select using (is_active=true or public.is_admin());
create policy "admin insert media" on public.media_assets for insert with check (public.is_admin());
create policy "admin update media" on public.media_assets for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete media" on public.media_assets for delete using (public.is_admin());

create table if not exists public.sales_sections (
  id uuid primary key default gen_random_uuid(), section_key text unique not null, title text, subtitle text,
  content text, button_text text, button_url text, sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.sales_sections enable row level security;
create policy "public read active sales" on public.sales_sections for select using (is_active=true or public.is_admin());
create policy "admin insert sales" on public.sales_sections for insert with check (public.is_admin());
create policy "admin update sales" on public.sales_sections for update using (public.is_admin()) with check (public.is_admin());

create table if not exists public.site_settings (
 id uuid primary key default gen_random_uuid(), setting_key text unique not null, setting_value text, updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (true);
create policy "admin manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.media_assets(title,slug,category,description,sort_order,is_active) values
('Mesin Evaporasi','mesin-evaporasi','mesin','Dokumentasi mesin evaporasi SKYGOAT.',1,true),
('Mesin Mixing','mesin-mixing','mesin','Dokumentasi proses mixing bahan baku SKYGOAT.',2,true),
('Mesin Filling','mesin-filling','mesin','Dokumentasi proses filling dan pengemasan.',3,true)
on conflict(slug) do nothing;

insert into public.sales_sections(section_key,title,subtitle,content,button_text,button_url,sort_order,is_active) values
('hero','KNOW THE PRODUCT.','SELL WITH CONFIDENCE.','Panduan digital untuk membantu sales, agen, dan reseller memahami SKYGOAT, mengenali kebutuhan customer, menjawab pertanyaan, dan melakukan follow-up dengan lebih terarah.','Mulai Panduan','#start',1,true),
('media_cta','Butuh foto atau video produksi?',null,'Buka Media & Mesin untuk melihat dokumentasi yang ditarik dari Supabase dan Google Drive.','Buka Media & Mesin →','/media',99,true)
on conflict(section_key) do nothing;

insert into public.site_settings(setting_key,setting_value) values
('whatsapp_url',''),('instagram_url',''),('contact_email',''),('footer_text','Digital Sales Guide SKYGOAT')
on conflict(setting_key) do nothing;

-- FIRST ADMIN:
-- 1) Supabase Dashboard > Authentication > Users > Add user
-- 2) Copy User UID
-- 3) Jalankan:
-- insert into public.admin_users(user_id) values ('PASTE-USER-UID-HERE');
