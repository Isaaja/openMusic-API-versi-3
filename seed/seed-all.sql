-- Script untuk menjalankan semua seed data sekaligus
-- Jalankan dengan: psql -U username -d database_name -f seed/seed-all.sql

-- Import albums terlebih dahulu
\i seed/albums.sql

-- Import songs setelah albums
\i seed/songs.sql

-- Tampilkan statistik data yang berhasil diimport
SELECT 
    'Albums' as table_name, 
    COUNT(*) as total_records 
FROM albums
UNION ALL
SELECT 
    'Songs' as table_name, 
    COUNT(*) as total_records 
FROM songs
UNION ALL
SELECT 
    'Songs with Albums' as table_name, 
    COUNT(*) as total_records 
FROM songs 
WHERE album_id IS NOT NULL
UNION ALL
SELECT 
    'Standalone Songs' as table_name, 
    COUNT(*) as total_records 
FROM songs 
WHERE album_id IS NULL;

-- Tampilkan contoh data
SELECT 
    a.name as album_name,
    a.year as album_year,
    COUNT(s.id) as total_songs
FROM albums a
LEFT JOIN songs s ON a.id = s.album_id
GROUP BY a.id, a.name, a.year
ORDER BY a.year DESC;
