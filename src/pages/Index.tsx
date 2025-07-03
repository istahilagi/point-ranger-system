import { useState } from 'react';
import LoginPage from '../components/LoginPage';
import AdminDashboard from '../components/AdminDashboard';
import GuruDashboard from '../components/GuruDashboard';
import SiswaDashboard from '../components/SiswaDashboard';

export interface User {
  id: string;
  nama: string;
  username: string;
  password: string;
  role: 'administrator' | 'guru' | 'siswa';
  rombel?: string;
  points?: number;
}

export interface Rombel {
  id: string;
  nama: string;
  siswa: string[];
}

export interface PointHistory {
  id: string;
  siswaId: string;
  guruId: string;
  points: number;
  keterangan: string;
  tanggal: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Mock data with class structure
  const [users, setUsers] = useState<User[]>([
    { id: '1', nama: 'Admin', username: 'admin', password: 'admin123', role: 'administrator' },
    { id: '2', nama: 'Pak Budi', username: 'budi', password: 'guru123', role: 'guru' },
    { id: '3', nama: 'Ahmad', username: 'ahmad', password: 'siswa123', role: 'siswa', rombel: 'Kelas 1 - A', points: 85 },
    { id: '4', nama: 'Siti', username: 'siti', password: 'siswa123', role: 'siswa', rombel: 'Kelas 1 - A', points: 92 },
    { id: '5', nama: 'Budi', username: 'budisiswa', password: 'siswa123', role: 'siswa', rombel: 'Kelas 2 - B', points: 78 }
  ]);
  
  const [rombels, setRombels] = useState<Rombel[]>([
    { id: '1', nama: 'Kelas 1 - A', siswa: ['3', '4'] },
    { id: '2', nama: 'Kelas 1 - B', siswa: [] },
    { id: '3', nama: 'Kelas 2 - A', siswa: [] },
    { id: '4', nama: 'Kelas 2 - B', siswa: ['5'] },
    { id: '5', nama: 'Kelas 3 - A', siswa: [] },
    { id: '6', nama: 'Kelas 3 - B', siswa: [] }
  ]);
  
  const [pointHistories, setPointHistories] = useState<PointHistory[]>([
    {
      id: '1',
      siswaId: '3',
      guruId: '2',
      points: 10,
      keterangan: 'Aktif dalam diskusi kelas',
      tanggal: '2024-01-15'
    },
    {
      id: '2',
      siswaId: '4',
      guruId: '2',
      points: 8,
      keterangan: 'Menyelesaikan tugas dengan baik',
      tanggal: '2024-01-14'
    }
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentUser.role === 'administrator' && (
        <AdminDashboard
          currentUser={currentUser}
          users={users}
          setUsers={setUsers}
          rombels={rombels}
          setRombels={setRombels}
          onLogout={handleLogout}
        />
      )}
      {currentUser.role === 'guru' && (
        <GuruDashboard
          currentUser={currentUser}
          users={users}
          setUsers={setUsers}
          rombels={rombels}
          pointHistories={pointHistories}
          setPointHistories={setPointHistories}
          onLogout={handleLogout}
        />
      )}
      {currentUser.role === 'siswa' && (
        <SiswaDashboard
          currentUser={currentUser}
          users={users}
          rombels={rombels}
          pointHistories={pointHistories}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Index;
