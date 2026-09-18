-- SKYGOAT homepage video storage
-- Jalankan sekali di Supabase Dashboard > SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 52428800, array['video/mp4','video/webm','video/ogg'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read site media" on storage.objects;
create policy "public read site media"
on storage.objects for select
using (bucket_id = 'site-media');

drop policy if exists "admin upload site media" on storage.objects;
create policy "admin upload site media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admin update site media" on storage.objects;
create policy "admin update site media"
on storage.objects for update
to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admin delete site media" on storage.objects;
create policy "admin delete site media"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-media' and public.is_admin());

insert into public.site_settings(setting_key, setting_value) values
('home_video_url', ''),
('home_video_storage_path', ''),
('home_video_file_name', ''),
('home_video_file_size', ''),
('home_video_title', 'THE STORY BEHIND SKYGOAT'),
('home_video_description', 'Kenali perjalanan SKYGOAT lebih dekat melalui video.'),
('home_video_poster_url', ''),
('home_video_archive', '[]'),
('home_portrait_video_url', ''),
('home_portrait_video_storage_path', ''),
('home_portrait_video_file_name', ''),
('home_portrait_video_file_size', ''),
('home_portrait_video_width', ''),
('home_portrait_video_height', ''),
('home_portrait_video_title', 'SKYGOAT, CLOSER THAN EVER'),
('home_portrait_video_description', 'Tekan Play untuk melihat video SKYGOAT dalam format portrait.'),
('home_portrait_video_poster_url', ''),
('home_portrait_video_archive', '[]')
on conflict(setting_key) do nothing;
