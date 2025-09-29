# Seed Data untuk OpenMusic API v3

Folder ini berisi data seed untuk mengisi database dengan data contoh yang realistis.

## File Yang Tersedia

### 1. `albums.sql`

Berisi data seed untuk tabel `albums` dengan 15 album dari berbagai genre:

- **Album Indonesia**: Dewa 19, Sheila On 7, Peterpan, Ungu, D'Masiv
- **Album Klasik**: Pink Floyd, Michael Jackson, The Beatles, AC/DC, Eagles
- **Album Modern**: Adele, Justin Bieber, Ed Sheeran, Harry Styles, Dua Lipa

### 2. `songs.sql`

Berisi data seed untuk tabel `songs` dengan 50 lagu yang terhubung ke album-album di atas:

- 45 lagu yang terhubung ke album (3 lagu per album)
- 5 lagu standalone tanpa album
- Data lengkap meliputi: title, year, genre, performer, duration, dan album_id

## Cara Menggunakan

### Metode 1: Menggunakan psql

```bash
# Masuk ke database PostgreSQL
psql -U your_username -d your_database_name

# Jalankan file seed
\i seed/albums.sql
\i seed/songs.sql
```

### Metode 2: Menggunakan file script

```bash
# Jalankan langsung dari command line
psql -U your_username -d your_database_name -f seed/albums.sql
psql -U your_username -d your_database_name -f seed/songs.sql
```

### Metode 3: Menggabungkan kedua file

```bash
# Gabungkan dan jalankan sekaligus
cat seed/albums.sql seed/songs.sql | psql -U your_username -d your_database_name
```

## Contoh Response API

Setelah menjalankan seed data, API akan mengembalikan response seperti:

### GET /albums/{id}

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-FvU4u0Vx2uVlzbyoB1ZAB",
      "name": "Dewa 19",
      "year": 2000,
      "coverUrl": null,
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l0x1DTm",
          "title": "Kangen",
          "performer": "Dewa 19"
        },
        {
          "id": "song-Qbax5Oy7L8WKf74l0x1DTn",
          "title": "Pupus",
          "performer": "Dewa 19"
        },
        {
          "id": "song-Qbax5Oy7L8WKf74l0x1DTo",
          "title": "Separuh Nafas",
          "performer": "Dewa 19"
        }
      ]
    }
  }
}
```

### GET /songs/{id}

```json
{
  "status": "success",
  "data": {
    "song": {
      "id": "song-Qbax5Oy7L8WKf74l0x1DTm",
      "title": "Kangen",
      "year": 2000,
      "genre": "Pop",
      "performer": "Dewa 19",
      "duration": 240,
      "albumId": "album-FvU4u0Vx2uVlzbyoB1ZAB"
    }
  }
}
```

### GET /songs

```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l0x1DTm",
        "title": "Kangen",
        "performer": "Dewa 19"
      }
      // ... more songs
    ]
  }
}
```

## Format Data

### Albums

- **id**: Format `album-{16 karakter nanoid}`
- **name**: Nama album
- **year**: Tahun rilis (integer)
- **cover**: URL cover album (nullable)

### Songs

- **id**: Format `song-{16 karakter nanoid}`
- **title**: Judul lagu
- **year**: Tahun rilis (integer)
- **genre**: Genre musik
- **performer**: Nama performer/artis
- **duration**: Durasi dalam detik (integer, nullable)
- **album_id**: ID album terkait (nullable untuk standalone songs)

## Catatan Penting

1. **Urutan Import**: Pastikan untuk mengimport `albums.sql` terlebih dahulu sebelum `songs.sql` karena terdapat foreign key constraint.

2. **Data Realistis**: Semua data menggunakan informasi yang realistis dari album dan lagu yang benar-benar ada.

3. **ID Format**: ID menggunakan format yang sama dengan yang digunakan oleh service (nanoid dengan prefix).

4. **Kompatibilitas**: Data ini sepenuhnya kompatibel dengan struktur database dan response format API yang sudah ada.

5. **Testing**: Data ini sangat cocok untuk testing berbagai endpoint API seperti:
   - Filter lagu berdasarkan title atau performer
   - Menampilkan album beserta daftar lagu
   - Testing playlist dan fitur lainnya
