import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Database connection
const dbConfig = {
  host: '127.0.0.1',
  user: 'point_pointku',
  password: 'ishal93@',
  database: 'point_pointku',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Test database connection
async function initDB() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Initialize
initDB();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// Auth endpoints
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.json({ success: false, message: 'Username dan password harus diisi' });
    }

    const [results] = await db.execute(
      'SELECT u.*, r.nama as rombel_nama, k.nama as kelas_nama FROM users u LEFT JOIN rombel r ON u.rombel_id = r.id LEFT JOIN kelas k ON r.kelas_id = k.id WHERE u.username = ?',
      [username]
    );
    
    if (results.length === 0) {
      return res.json({ success: false, message: 'Username tidak ditemukan' });
    }
    
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Password salah' });
    }
    
    delete user.password;
    res.json({ success: true, data: user, message: 'Login berhasil' });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout berhasil' });
});

// Users endpoints
app.get('/users', async (req, res) => {
  try {
    const { role, rombel } = req.query;
    
    let query = 'SELECT u.id, u.nama, u.username, u.role, u.rombel_id, u.foto, u.points, u.created_at, r.nama as rombel_nama, k.nama as kelas_nama FROM users u LEFT JOIN rombel r ON u.rombel_id = r.id LEFT JOIN kelas k ON r.kelas_id = k.id WHERE 1=1';
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
    
    const [results] = await db.execute(query, params);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Get users error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { nama, username, password, role, rombel_id, foto } = req.body;
    
    if (!nama || !username || !password || !role) {
      return res.json({ success: false, message: 'Data tidak lengkap' });
    }
    
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(
      'INSERT INTO users (id, nama, username, password, role, rombel_id, foto, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nama, username, hashedPassword, role, rombel_id || null, foto || null, 0]
    );
    
    res.json({ success: true, data: { id }, message: 'User berhasil dibuat' });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ success: false, message: 'Username sudah digunakan' });
    }
    res.json({ success: false, error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, username, password, role, rombel_id, foto } = req.body;
    
    let query = 'UPDATE users SET nama = ?, username = ?, role = ?, rombel_id = ?, foto = ?';
    let params = [nama, username, role, rombel_id || null, foto || null];
    
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await db.execute(query, params);
    
    if (result.affectedRows === 0) {
      return res.json({ success: false, message: 'User tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'User berhasil diupdate' });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ success: false, message: 'Username sudah digunakan' });
    }
    res.json({ success: false, error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.json({ success: false, message: 'User tidak ditemukan' });
    }
    
    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.json({ success: false, error: error.message });
  }
});

// Kelas endpoints
app.get('/kelas', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM kelas ORDER BY nama');
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Get kelas error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.post('/kelas', async (req, res) => {
  try {
    const { nama, active = true } = req.body;
    const id = uuidv4();
    
    await db.execute('INSERT INTO kelas (id, nama, active) VALUES (?, ?, ?)', [id, nama, active]);
    res.json({ success: true, data: { id }, message: 'Kelas berhasil dibuat' });
  } catch (error) {
    console.error('Create kelas error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.put('/kelas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, active } = req.body;
    
    await db.execute('UPDATE kelas SET nama = ?, active = ? WHERE id = ?', [nama, active, id]);
    res.json({ success: true, message: 'Kelas berhasil diupdate' });
  } catch (error) {
    console.error('Update kelas error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.delete('/kelas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM kelas WHERE id = ?', [id]);
    res.json({ success: true, message: 'Kelas berhasil dihapus' });
  } catch (error) {
    console.error('Delete kelas error:', error);
    res.json({ success: false, error: error.message });
  }
});

// Rombel endpoints
app.get('/rombel', async (req, res) => {
  try {
    const { kelas } = req.query;
    let query = 'SELECT r.*, k.nama as kelas_nama FROM rombel r LEFT JOIN kelas k ON r.kelas_id = k.id WHERE 1=1';
    const params = [];
    
    if (kelas) {
      query += ' AND r.kelas_id = ?';
      params.push(kelas);
    }
    
    query += ' ORDER BY k.nama, r.nama';
    
    const [results] = await db.execute(query, params);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Get rombel error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.post('/rombel', async (req, res) => {
  try {
    const { nama, kelas_id } = req.body;
    const id = uuidv4();
    
    await db.execute('INSERT INTO rombel (id, nama, kelas_id) VALUES (?, ?, ?)', [id, nama, kelas_id]);
    res.json({ success: true, data: { id }, message: 'Rombel berhasil dibuat' });
  } catch (error) {
    console.error('Create rombel error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.put('/rombel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kelas_id } = req.body;
    
    await db.execute('UPDATE rombel SET nama = ?, kelas_id = ? WHERE id = ?', [nama, kelas_id, id]);
    res.json({ success: true, message: 'Rombel berhasil diupdate' });
  } catch (error) {
    console.error('Update rombel error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.delete('/rombel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM rombel WHERE id = ?', [id]);
    res.json({ success: true, message: 'Rombel berhasil dihapus' });
  } catch (error) {
    console.error('Delete rombel error:', error);
    res.json({ success: false, error: error.message });
  }
});

// Point history endpoints
app.get('/point-history', async (req, res) => {
  try {
    const { siswaId, guruId, limit } = req.query;
    
    let query = 'SELECT ph.*, s.nama as siswa_nama, s.foto as siswa_foto, g.nama as guru_nama, r.nama as rombel_nama, k.nama as kelas_nama FROM point_history ph LEFT JOIN users s ON ph.siswa_id = s.id LEFT JOIN users g ON ph.guru_id = g.id LEFT JOIN rombel r ON s.rombel_id = r.id LEFT JOIN kelas k ON r.kelas_id = k.id WHERE 1=1';
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
    
    const [results] = await db.execute(query, params);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Get point history error:', error);
    res.json({ success: false, error: error.message });
  }
});

app.post('/point-history', async (req, res) => {
  try {
    const { siswa_id, guru_id, points, keterangan, tanggal } = req.body;
    const id = uuidv4();
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      await connection.execute(
        'INSERT INTO point_history (id, siswa_id, guru_id, points, keterangan, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
        [id, siswa_id, guru_id, points, keterangan, tanggal]
      );
      
      await connection.execute(
        'UPDATE users SET points = COALESCE(points, 0) + ? WHERE id = ?',
        [points, siswa_id]
      );
      
      await connection.commit();
      connection.release();
      
      res.json({ success: true, data: { id }, message: 'Point history berhasil ditambahkan' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Create point history error:', error);
    res.json({ success: false, error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
});