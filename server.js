
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'point_pointku',
  password: 'ishal93@',
  database: 'point_pointku'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// ---------- AUTH ENDPOINTS ----------

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  db.query(
    `SELECT u.*, r.nama as rombel_nama, k.nama as kelas_nama 
     FROM users u 
     LEFT JOIN rombel r ON u.rombel_id = r.id 
     LEFT JOIN kelas k ON r.kelas_id = k.id 
     WHERE u.username = ?`,
    [username],
    (err, results) => {
      if (err) return res.json({ success: false, error: err });
      
      if (results.length === 0) {
        return res.json({ success: false, message: 'Username tidak ditemukan' });
      }
      
      const user = results[0];
      
      // Compare password
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ success: false, message: 'Password salah' });
      }
      
      // Remove password from response
      delete user.password;
      res.json({ success: true, data: user, message: 'Login berhasil' });
    }
  );
});

app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout berhasil' });
});

// ---------- KELAS ENDPOINTS ----------

app.get('/kelas', (req, res) => {
  db.query('SELECT * FROM kelas ORDER BY nama', (err, results) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: results });
  });
});

app.post('/kelas', (req, res) => {
  const { nama, active = true } = req.body;
  const id = uuidv4();
  db.query('INSERT INTO kelas (id, nama, active) VALUES (?, ?, ?)', [id, nama, active], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: { id }, message: 'Kelas created' });
  });
});

app.put('/kelas/:id', (req, res) => {
  const { id } = req.params;
  const { nama, active } = req.body;
  
  db.query('UPDATE kelas SET nama = ?, active = ? WHERE id = ?', [nama, active, id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: 'Kelas updated successfully' });
  });
});

app.delete('/kelas/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM kelas WHERE id = ?', [id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: 'Kelas deleted successfully' });
  });
});

// ---------- ROMBEL ENDPOINTS ----------

app.get('/rombel', (req, res) => {
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
  
  db.query(query, params, (err, results) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: results });
  });
});

app.post('/rombel', (req, res) => {
  const { nama, kelas_id } = req.body;
  const id = uuidv4();
  db.query('INSERT INTO rombel (id, nama, kelas_id) VALUES (?, ?, ?)', [id, nama, kelas_id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: { id }, message: 'Rombel created' });
  });
});

app.put('/rombel/:id', (req, res) => {
  const { id } = req.params;
  const { nama, kelas_id } = req.body;
  
  db.query('UPDATE rombel SET nama = ?, kelas_id = ? WHERE id = ?', [nama, kelas_id, id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: 'Rombel updated successfully' });
  });
});

app.delete('/rombel/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM rombel WHERE id = ?', [id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: 'Rombel deleted successfully' });
  });
});

// ---------- USERS ENDPOINTS ----------

app.get('/users', (req, res) => {
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
  
  db.query(query, params, (err, results) => {
    if (err) return res.json({ success: false, error: err });
    
    // Remove password from response
    results.forEach(user => delete user.password);
    
    res.json({ success: true, data: results });
  });
});

app.post('/users', (req, res) => {
  const { nama, username, password, role, rombel_id, foto } = req.body;
  const id = uuidv4();
  const hashed = bcrypt.hashSync(password, 10);
  
  db.query(
    'INSERT INTO users (id, nama, username, password, role, rombel_id, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, nama, username, hashed, role, rombel_id, foto],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, message: 'Username sudah digunakan' });
        }
        return res.json({ success: false, error: err });
      }
      res.json({ success: true, data: { id }, message: 'User created' });
    }
  );
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { nama, username, password, role, rombel_id, foto } = req.body;
  
  let query = 'UPDATE users SET nama = ?, username = ?, role = ?, rombel_id = ?, foto = ?';
  let params = [nama, username, role, rombel_id, foto];
  
  // Only update password if provided
  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    query += ', password = ?';
    params.push(hashed);
  }
  
  query += ' WHERE id = ?';
  params.push(id);
  
  db.query(query, params, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.json({ success: false, message: 'Username sudah digunakan' });
      }
      return res.json({ success: false, error: err });
    }
    res.json({ success: true, message: 'User updated successfully' });
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: 'User deleted successfully' });
  });
});

// ---------- POINT HISTORY ENDPOINTS ----------

app.get('/point-history', (req, res) => {
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
  
  db.query(query, params, (err, results) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: results });
  });
});

app.post('/point-history', (req, res) => {
  const { siswa_id, guru_id, points, keterangan, tanggal } = req.body;
  const id = uuidv4();
  
  db.query(
    'INSERT INTO point_history (id, siswa_id, guru_id, points, keterangan, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
    [id, siswa_id, guru_id, points, keterangan, tanggal],
    (err, result) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true, data: { id }, message: 'Point history added' });
    }
  );
});

app.put('/point-history/:id', (req, res) => {
  const { id } = req.params;
  const { siswa_id, guru_id, points, keterangan, tanggal } = req.body;
  
  db.query(
    'UPDATE point_history SET siswa_id = ?, guru_id = ?, points = ?, keterangan = ?, tanggal = ? WHERE id = ?',
    [siswa_id, guru_id, points, keterangan, tanggal, id],
    (err, result) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true, message: 'Point history updated successfully' });
    }
  );
});

app.delete('/point-history/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM point_history WHERE id = ?', [id], (err, result) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, message: 'Point history deleted successfully' });
  });
});

// ---------- SERVER LISTEN ----------

app.listen(3002, () => {
  console.log('API running on port 3002');
});
