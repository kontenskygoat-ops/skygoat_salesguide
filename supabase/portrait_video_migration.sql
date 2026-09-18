-- SKYGOAT second homepage video: portrait click-to-play
-- Jalankan sekali setelah migration video landscape yang sebelumnya.
-- Aman dijalankan ulang karena memakai ON CONFLICT DO NOTHING.

insert into public.site_settings(setting_key, setting_value) values
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
