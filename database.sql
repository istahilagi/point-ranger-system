
-- Database: point_ranking_system
-- Struktur database untuk Point Ranking System

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS point_ranking_system;
USE point_ranking_system;

-- Tabel kelas
CREATE TABLE kelas (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel rombel (rombongan belajar)
CREATE TABLE rombel (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kelas_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL
);

-- Tabel users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('administrator', 'guru', 'siswa') NOT NULL,
    rombel_id VARCHAR(36) NULL,
    points INT DEFAULT 0,
    foto TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rombel_id) REFERENCES rombel(id) ON DELETE SET NULL
);

-- Tabel point_history
CREATE TABLE point_history (
    id VARCHAR(36) PRIMARY KEY,
    siswa_id VARCHAR(36) NOT NULL,
    guru_id VARCHAR(36) NOT NULL,
    points INT NOT NULL,
    keterangan TEXT NOT NULL,
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert data kelas default
INSERT INTO kelas (id, nama, active) VALUES
('1', 'Kelas 1', TRUE),
('2', 'Kelas 2', TRUE),
('3', 'Kelas 3', TRUE),
('4', 'Kelas 4', FALSE),
('5', 'Kelas 5', FALSE),
('6', 'Kelas 6', FALSE),
('7', 'Kelas 7', FALSE),
('8', 'Kelas 8', FALSE),
('9', 'Kelas 9', FALSE),
('10', 'Kelas 10', FALSE),
('11', 'Kelas 11', FALSE),
('12', 'Kelas 12', FALSE);

-- Insert data rombel default
INSERT INTO rombel (id, nama, kelas_id) VALUES
('1', 'Kelas 1 - A', '1'),
('2', 'Kelas 1 - B', '1'),
('3', 'Kelas 2 - A', '2'),
('4', 'Kelas 2 - B', '2'),
('5', 'Kelas 3 - A', '3'),
('6', 'Kelas 3 - B', '3');

-- Insert data users default
INSERT INTO users (id, nama, username, password, role, rombel_id, points, foto) VALUES
-- Administrator
('1', 'Admin', 'admin', 'admin123', 'administrator', NULL, 0, NULL),

-- Guru
('2', 'Pak Budi', 'budi', 'guru123', 'guru', NULL, 0, NULL),

-- Siswa
('3', 'Ahmad', 'ahmad', 'siswa123', 'siswa', '1', 85, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop&crop=face'),
('4', 'Siti', 'siti', 'siswa123', 'siswa', '1', 92, 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop&crop=face'),
('5', 'Budi', 'budisiswa', 'siswa123', 'siswa', '4', -15, 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=200&h=200&fit=crop&crop=face'),
('6', 'Ani', 'ani', 'siswa123', 'siswa', '1', -5, 'https://images.unsplash.com/photo-1494790108755-2616c1e5f2ca?w=200&h=200&fit=crop&crop=face');

-- Insert data point_history default
INSERT INTO point_history (id, siswa_id, guru_id, points, keterangan, tanggal) VALUES
('1', '3', '2', 10, 'Aktif dalam diskusi kelas', CURDATE()),
('2', '4', '2', 8, 'Menyelesaikan tugas dengan baik', CURDATE()),
('3', '5', '2', -15, 'Terlambat masuk kelas berulang kali', CURDATE()),
('4', '6', '2', -5, 'Tidak mengerjakan PR', CURDATE());

-- Trigger untuk update points otomatis ketika ada perubahan di point_history
DELIMITER //

CREATE TRIGGER update_user_points_after_insert
AFTER INSERT ON point_history
FOR EACH ROW
BEGIN
    UPDATE users 
    SET points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM point_history 
        WHERE siswa_id = NEW.siswa_id
    )
    WHERE id = NEW.siswa_id;
END//

CREATE TRIGGER update_user_points_after_update
AFTER UPDATE ON point_history
FOR EACH ROW
BEGIN
    UPDATE users 
    SET points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM point_history 
        WHERE siswa_id = NEW.siswa_id
    )
    WHERE id = NEW.siswa_id;
END//

CREATE TRIGGER update_user_points_after_delete
AFTER DELETE ON point_history
FOR EACH ROW
BEGIN
    UPDATE users 
    SET points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM point_history 
        WHERE siswa_id = OLD.siswa_id
    )
    WHERE id = OLD.siswa_id;
END//

DELIMITER ;

-- Index untuk optimasi performa
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_rombel ON users(rombel_id);
CREATE INDEX idx_point_history_siswa ON point_history(siswa_id);
CREATE INDEX idx_point_history_guru ON point_history(guru_id);
CREATE INDEX idx_point_history_tanggal ON point_history(tanggal);
CREATE INDEX idx_rombel_kelas ON rombel(kelas_id);
