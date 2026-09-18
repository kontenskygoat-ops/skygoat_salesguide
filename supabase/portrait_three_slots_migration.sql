-- SKYGOAT: tambah slot video portrait 2 dan 3.
-- Slot 1 memakai key lama agar video yang sudah aktif tetap aman.
-- Aman dijalankan ulang karena memakai ON CONFLICT DO NOTHING.

insert into public.site_settings(setting_key, setting_value) values
('home_portrait_video_2_url', ''),
('home_portrait_video_2_storage_path', ''),
('home_portrait_video_2_file_name', ''),
('home_portrait_video_2_file_size', ''),
('home_portrait_video_2_width', ''),
('home_portrait_video_2_height', ''),
('home_portrait_video_2_title', 'Video SKYGOAT 2'),
('home_portrait_video_2_description', 'Tekan Play untuk melihat video SKYGOAT dalam format portrait.'),
('home_portrait_video_2_poster_url', ''),
('home_portrait_video_2_archive', '[]'),
('home_portrait_video_3_url', ''),
('home_portrait_video_3_storage_path', ''),
('home_portrait_video_3_file_name', ''),
('home_portrait_video_3_file_size', ''),
('home_portrait_video_3_width', ''),
('home_portrait_video_3_height', ''),
('home_portrait_video_3_title', 'Video SKYGOAT 3'),
('home_portrait_video_3_description', 'Tekan Play untuk melihat video SKYGOAT dalam format portrait.'),
('home_portrait_video_3_poster_url', ''),
('home_portrait_video_3_archive', '[]')
on conflict(setting_key) do nothing;
