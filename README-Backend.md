
# Point Ranking System - Backend API

Backend API untuk sistem peringkat poin siswa menggunakan Node.js, Express, dan MySQL.

## Instalasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
1. Buat database MySQL dengan nama `point_ranking_system`
2. Import file `database.sql` ke database Anda melalui phpMyAdmin atau MySQL command line
3. Sesuaikan konfigurasi database di `server.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root', // sesuaikan dengan username MySQL Anda
  password: '', // sesuaikan dengan password MySQL Anda
  database: 'point_ranking_system'
};
```

### 3. Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Users Management
- `GET /users` - Ambil semua users (dengan filter role, rombel)
- `POST /users` - Buat user baru
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Hapus user

### Kelas Management
- `GET /kelas` - Ambil semua kelas
- `POST /kelas` - Buat kelas baru
- `PUT /kelas/:id` - Update kelas
- `DELETE /kelas/:id` - Hapus kelas

### Rombel Management
- `GET /rombel` - Ambil semua rombel (dengan filter kelas)
- `POST /rombel` - Buat rombel baru
- `PUT /rombel/:id` - Update rombel
- `DELETE /rombel/:id` - Hapus rombel

### Point History
- `GET /point-history` - Ambil riwayat poin (dengan filter siswa, guru, limit)
- `POST /point-history` - Tambah riwayat poin baru
- `PUT /point-history/:id` - Update riwayat poin
- `DELETE /point-history/:id` - Hapus riwayat poin

### File Upload
- `POST /upload/photo` - Upload foto profil
- `DELETE /upload/photo/:filename` - Hapus foto

## Struktur Response API

```json
{
  "success": true/false,
  "data": [...], // data hasil query
  "message": "pesan status",
  "code": "kode error (opsional)"
}
```

## Catatan
- Password disimpan plain text untuk demo (gunakan bcrypt untuk produksi)
- File upload disimpan di folder `uploads/photos/`
- Database menggunakan UUID untuk primary key
- Trigger MySQL otomatis menghitung total poin siswa
