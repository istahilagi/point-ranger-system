import { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import AdminDashboard from '../components/AdminDashboard';
import GuruDashboard from '../components/GuruDashboard';
import SiswaDashboard from '../components/SiswaDashboard';
import RankingPage from '../components/RankingPage';
import { useUsers, useKelas, useRombel, usePointHistory } from '../hooks/useApi';
import { apiService } from '../services/apiService';

export interface User {
  id: string;
  nama: string;
  username: string;
  password: string;
  role: 'administrator' | 'guru' | 'siswa';
  rombel?: string;
  points?: number;
  foto?: string;
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

export interface Kelas {
  id: string;
  nama: string;
  active: boolean;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  
  // Using API hooks to fetch data
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const { data: kelasData, loading: kelasLoading, refetch: refetchKelas } = useKelas();
  const { data: rombelData, loading: rombelLoading, refetch: refetchRombel } = useRombel();
  const { data: pointHistoryData, loading: pointHistoryLoading, refetch: refetchPointHistory } = usePointHistory();
  
  // Fallback to mock data if API is not available
  const [users, setUsers] = useState<User[]>([
    { id: '1', nama: 'Admin', username: 'admin', password: 'admin123', role: 'administrator' },
    { id: '2', nama: 'Pak Budi', username: 'budi', password: 'guru123', role: 'guru' },
    { 
      id: '3', 
      nama: 'Ahmad', 
      username: 'ahmad', 
      password: 'siswa123', 
      role: 'siswa', 
      rombel: 'Kelas 1 - A', 
      points: 85,
      foto: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop&crop=face'
    },
    { 
      id: '4', 
      nama: 'Siti', 
      username: 'siti', 
      password: 'siswa123', 
      role: 'siswa', 
      rombel: 'Kelas 1 - A', 
      points: 92,
      foto: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop&crop=face'
    },
    { 
      id: '5', 
      nama: 'Budi', 
      username: 'budisiswa', 
      password: 'siswa123', 
      role: 'siswa', 
      rombel: 'Kelas 2 - B', 
      points: -15,
      foto: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=200&h=200&fit=crop&crop=face'
    },
    { 
      id: '6', 
      nama: 'Ani', 
      username: 'ani', 
      password: 'siswa123', 
      role: 'siswa', 
      rombel: 'Kelas 1 - A', 
      points: -5,
      foto: 'https://images.unsplash.com/photo-1494790108755-2616c1e5f2ca?w=200&h=200&fit=crop&crop=face'
    }
  ]);
  
  const [kelas, setKelas] = useState<Kelas[]>([
    { id: '1', nama: 'Kelas 1', active: true },
    { id: '2', nama: 'Kelas 2', active: true },
    { id: '3', nama: 'Kelas 3', active: true },
    { id: '4', nama: 'Kelas 4', active: false },
    { id: '5', nama: 'Kelas 5', active: false },
    { id: '6', nama: 'Kelas 6', active: false },
    { id: '7', nama: 'Kelas 7', active: false },
    { id: '8', nama: 'Kelas 8', active: false },
    { id: '9', nama: 'Kelas 9', active: false },
    { id: '10', nama: 'Kelas 10', active: false },
    { id: '11', nama: 'Kelas 11', active: false },
    { id: '12', nama: 'Kelas 12', active: false }
  ]);
  
  const [rombels, setRombels] = useState<Rombel[]>([
    { id: '1', nama: 'Kelas 1 - A', siswa: ['3', '4', '6'] },
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
      tanggal: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      siswaId: '4',
      guruId: '2',
      points: 8,
      keterangan: 'Menyelesaikan tugas dengan baik',
      tanggal: new Date().toISOString().split('T')[0]
    },
    {
      id: '3',
      siswaId: '5',
      guruId: '2',
      points: -15,
      keterangan: 'Terlambat masuk kelas berulang kali',
      tanggal: new Date().toISOString().split('T')[0]
    },
    {
      id: '4',
      siswaId: '6',
      guruId: '2',
      points: -5,
      keterangan: 'Tidak mengerjakan PR',
      tanggal: new Date().toISOString().split('T')[0]
    }
  ]);

  // Update state when API data is loaded with proper type casting
  useEffect(() => {
    if (usersData && !usersLoading) {
      setUsers(usersData as User[]);
    }
  }, [usersData, usersLoading]);

  useEffect(() => {
    if (kelasData && !kelasLoading) {
      setKelas(kelasData as Kelas[]);
    }
  }, [kelasData, kelasLoading]);

  useEffect(() => {
    if (rombelData && !rombelLoading) {
      setRombels(rombelData as Rombel[]);
    }
  }, [rombelData, rombelLoading]);

  useEffect(() => {
    if (pointHistoryData && !pointHistoryLoading) {
      setPointHistories(pointHistoryData as PointHistory[]);
    }
  }, [pointHistoryData, pointHistoryLoading]);

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      console.log('🔍 Testing API connection to: http://45.158.126.50:3002');
      const result = await apiService.testConnection();
      if (result.success) {
        console.log('✅ API connection successful:', result);
      } else {
        console.error('❌ API connection failed:', result);
        console.log('📝 Using fallback data instead');
      }
    };
    
    testAPI();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowRanking(false);
  };

  const handleShowRanking = () => {
    setShowRanking(true);
  };

  const handleBackToLogin = () => {
    setShowRanking(false);
  };

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    refetchUsers();
  };

  const updateKelas = (newKelas: Kelas[]) => {
    setKelas(newKelas);
    refetchKelas();
  };

  const updateRombels = (newRombels: Rombel[]) => {
    setRombels(newRombels);
    refetchRombel();
  };

  const updatePointHistories = (newPointHistories: PointHistory[]) => {
    setPointHistories(newPointHistories);
    refetchPointHistory();
  };

  if (showRanking) {
    return (
      <RankingPage
        users={users}
        kelas={kelas}
        pointHistories={pointHistories}
        onBack={handleBackToLogin}
      />
    );
  }

  if (!currentUser) {
    return (
      <LoginPage 
        users={users} 
        onLogin={handleLogin} 
        onShowRanking={handleShowRanking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentUser.role === 'administrator' && (
        <AdminDashboard
          currentUser={currentUser}
          users={users}
          setUsers={updateUsers}
          rombels={rombels}
          setRombels={updateRombels}
          kelas={kelas}
          setKelas={updateKelas}
          onLogout={handleLogout}
        />
      )}
      {currentUser.role === 'guru' && (
        <GuruDashboard
          currentUser={currentUser}
          users={users}
          setUsers={updateUsers}
          rombels={rombels}
          kelas={kelas}
          pointHistories={pointHistories}
          setPointHistories={updatePointHistories}
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
