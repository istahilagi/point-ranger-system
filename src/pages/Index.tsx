
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
  
  // Mock data
  const [users, setUsers] = useState<User[]>([
    { id: '1', nama: 'Admin', username: 'admin', password: 'admin123', role: 'administrator' },
    { id: '2', nama: 'Pak Budi', username: 'budi', password: 'guru123', role: 'guru' },
    { id: '3', nama: 'Ahmad', username: 'ahmad', password: 'siswa123', role: 'siswa', rombel: 'X-1', points: 85 }
  ]);
  
  const [rombels, setRombels] = useState<Rombel[]>([
    { id: '1', nama: 'X-1', siswa: ['3'] },
    { id: '2', nama: 'X-2', siswa: [] }
  ]);
  
  const [pointHistories, setPointHistories] = useState<PointHistory[]>([]);

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
