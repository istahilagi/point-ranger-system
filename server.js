
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Konfigurasi database MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root', // sesuaikan dengan username MySQL Anda
  password: '', // sesuaikan dengan password MySQL Anda
  database: 'point_ranking_system'
};

// Buat koneksi pool
const pool = mysql.createPool(dbConfig);

// Konfigurasi multer untuk upload foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Helper function untuk response
const sendResponse = (res, success, data = null, message = '', code = null) => {
  res.json({
    success,
    data,
    message,
    code
  });
};

// Authentication endpoints
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await pool.execute(
      `SELECT u.*, r.nama as rombel_nama, k.nama as kelas_nama 
       FROM users u 
       LEFT JOIN rombel r ON u.rombel_id = r.id 
       LEFT JOIN kelas k ON r.kelas_id = k.id 
       WHERE u.username = ?`,
      [username]
    );
    
    if (rows.length === 0) {
      return sendResponse(res, false, null, 'Username tidak ditemukan');
    }
    
    const user = rows[0];
    
    // Untuk demo, kita compare password langsung (dalam produksi gunakan bcrypt)
    if (user.password !== password) {
      return sendResponse(res, false, null, 'Password salah');
    }
    
    // Hapus password dari response
    delete user.password;
    
    sendResponse(res, true, user, 'Login berhasil');
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.post('/auth/logout', (req, res) => {
  sendResponse(res, true, null, 'Logout berhasil');
});

// Users endpoints
app.get('/users', async (req, res) => {
  try {
    const { role, rombel } = req.query;
    
    let query = `
      SELECT u.*, r.nama as rombel_nama, k.nama as kelas_nama 
      FROM users u 
      LEFT JOIN rombel r ON u.rombel_id = r.id 
      LEFT JOIN kelas k ON r.kelas_id = k.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }
    
    if (rombel) {
      query += ' AND u.rombel_id = ?';
      params.push(rombel);
    }
    
    query += ' ORDER BY u.points DESC, u.nama ASC';
    
    const [rows] = await pool.execute(query, params);
    
    // Hapus password dari response
    rows.forEach(user => delete user.password);
    
    sendResponse(res, true, rows);
  } catch (error) {
    console.error('Get users error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.post('/users', async (req, res) => {
  try {
    const { nama, username, password, role, rombel_id, foto } = req.body;
    const id = uuidv4();
    
    await pool.execute(
      'INSERT INTO users (id, nama, username, password, role, rombel_id, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, nama, username, password, role, rombel_id, foto]
    );
    
    sendResponse(res, true, { id }, 'User berhasil dibuat');
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      sendResponse(res, false, null, 'Username sudah digunakan');
    } else {
      sendResponse(res, false, null, 'Terjadi kesalahan server');
    }
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, username, password, role, rombel_id, foto } = req.body;
    
    await pool.execute(
      'UPDATE users SET nama = ?, username = ?, password = ?, role = ?, rombel_id = ?, foto = ? WHERE id = ?',
      [nama, username, password, role, rombel_id, foto, id]
    );
    
    sendResponse(res, true, null, 'User berhasil diupdate');
  } catch (error) {
    console.error('Update user error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    sendResponse(res, true, null, 'User berhasil dihapus');
  } catch (error) {
    console.error('Delete user error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

// Kelas endpoints
app.get('/kelas', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM kelas ORDER BY nama');
    sendResponse(res, true, rows);
  } catch (error) {
    console.error('Get kelas error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.post('/kelas', async (req, res) => {
  try {
    const { nama, active = true } = req.body;
    const id = uuidv4();
    
    await pool.execute(
      'INSERT INTO kelas (id, nama, active) VALUES (?, ?, ?)',
      [id, nama, active]
    );
    
    sendResponse(res, true, { id }, 'Kelas berhasil dibuat');
  } catch (error) {
    console.error('Create kelas error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.put('/kelas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, active } = req.body;
    
    await pool.execute(
      'UPDATE kelas SET nama = ?, active = ? WHERE id = ?',
      [nama, active, id]
    );
    
    sendResponse(res, true, null, 'Kelas berhasil diupdate');
  } catch (error) {
    console.error('Update kelas error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.delete('/kelas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM kelas WHERE id = ?', [id]);
    
    sendResponse(res, true, null, 'Kelas berhasil dihapus');
  } catch (error) {
    console.error('Delete kelas error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

// Rombel endpoints
app.get('/rombel', async (req, res) => {
  try {
    const { kelas } = req.query;
    
    let query = `
      SELECT r.*, k.nama as kelas_nama 
      FROM rombel r 
      LEFT JOIN kelas k ON r.kelas_id = k.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (kelas) {
      query += ' AND r.kelas_id = ?';
      params.push(kelas);
    }
    
    query += ' ORDER BY k.nama, r.nama';
    
    const [rows] = await pool.execute(query, params);
    sendResponse(res, true, rows);
  } catch (error) {
    console.error('Get rombel error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.post('/rombel', async (req, res) => {
  try {
    const { nama, kelas_id } = req.body;
    const id = uuidv4();
    
    await pool.execute(
      'INSERT INTO rombel (id, nama, kelas_id) VALUES (?, ?, ?)',
      [id, nama, kelas_id]
    );
    
    sendResponse(res, true, { id }, 'Rombel berhasil dibuat');
  } catch (error) {
    console.error('Create rombel error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.put('/rombel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kelas_id } = req.body;
    
    await pool.execute(
      'UPDATE rombel SET nama = ?, kelas_id = ? WHERE id = ?',
      [nama, kelas_id, id]
    );
    
    sendResponse(res, true, null, 'Rombel berhasil diupdate');
  } catch (error) {
    console.error('Update rombel error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.delete('/rombel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM rombel WHERE id = ?', [id]);
    
    sendResponse(res, true, null, 'Rombel berhasil dihapus');
  } catch (error) {
    console.error('Delete rombel error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

// Point History endpoints
app.get('/point-history', async (req, res) => {
  try {
    const { siswaId, guruId, limit } = req.query;
    
    let query = `
      SELECT ph.*, 
             s.nama as siswa_nama, s.foto as siswa_foto,
             g.nama as guru_nama,
             r.nama as rombel_nama,
             k.nama as kelas_nama
      FROM point_history ph
      LEFT JOIN users s ON ph.siswa_id = s.id
      LEFT JOIN users g ON ph.guru_id = g.id
      LEFT JOIN rombel r ON s.rombel_id = r.id
      LEFT JOIN kelas k ON r.kelas_id = k.id
      WHERE 1=1
    `;
    const params = [];
    
    if (siswaId) {
      query += ' AND ph.siswa_id = ?';
      params.push(siswaId);
    }
    
    if (guruId) {
      query += ' AND ph.guru_id = ?';
      params.push(guruId);
    }
    
    query += ' ORDER BY ph.tanggal DESC, ph.created_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const [rows] = await pool.execute(query, params);
    sendResponse(res, true, rows);
  } catch (error) {
    console.error('Get point history error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.post('/point-history', async (req, res) => {
  try {
    const { siswa_id, guru_id, points, keterangan, tanggal } = req.body;
    const id = uuidv4();
    
    await pool.execute(
      'INSERT INTO point_history (id, siswa_id, guru_id, points, keterangan, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
      [id, siswa_id, guru_id, points, keterangan, tanggal]
    );
    
    sendResponse(res, true, { id }, 'Point history berhasil dibuat');
  } catch (error) {
    console.error('Create point history error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.put('/point-history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { siswa_id, guru_id, points, keterangan, tanggal } = req.body;
    
    await pool.execute(
      'UPDATE point_history SET siswa_id = ?, guru_id = ?, points = ?, keterangan = ?, tanggal = ? WHERE id = ?',
      [siswa_id, guru_id, points, keterangan, tanggal, id]
    );
    
    sendResponse(res, true, null, 'Point history berhasil diupdate');
  } catch (error) {
    console.error('Update point history error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.delete('/point-history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute('DELETE FROM point_history WHERE id = ?', [id]);
    
    sendResponse(res, true, null, 'Point history berhasil dihapus');
  } catch (error) {
    console.error('Delete point history error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

// Upload endpoints
app.post('/upload/photo', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, false, null, 'Tidak ada file yang diupload');
    }
    
    const fileUrl = `/uploads/photos/${req.file.filename}`;
    sendResponse(res, true, { url: fileUrl, filename: req.file.filename }, 'Photo berhasil diupload');
  } catch (error) {
    console.error('Upload photo error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

app.delete('/upload/photo/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads/photos', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      sendResponse(res, true, null, 'Photo berhasil dihapus');
    } else {
      sendResponse(res, false, null, 'File tidak ditemukan');
    }
  } catch (error) {
    console.error('Delete photo error:', error);
    sendResponse(res, false, null, 'Terjadi kesalahan server');
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error middleware:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, false, null, 'File terlalu besar (maksimal 5MB)');
    }
  }
  sendResponse(res, false, null, 'Terjadi kesalahan server');
});

// 404 handler
app.use('*', (req, res) => {
  sendResponse(res, false, null, 'Endpoint tidak ditemukan', '404');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database terhubung!');
    connection.release();
  })
  .catch(err => {
    console.error('Database gagal terhubung:', err.message);
  });
