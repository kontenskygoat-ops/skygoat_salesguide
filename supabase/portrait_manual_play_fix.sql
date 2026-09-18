-- Update copy lama dari versi autoplay tanpa menimpa deskripsi custom admin.
update public.site_settings
set setting_value = 'Tekan Play untuk melihat video SKYGOAT dalam format portrait.',
    updated_at = now()
where setting_key = 'home_portrait_video_description'
  and setting_value = 'Lihat SKYGOAT lebih dekat dalam format portrait yang otomatis berjalan saat bagian ini terlihat.';
