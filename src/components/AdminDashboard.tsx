
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Building2, LogOut } from 'lucide-react';
import { User, Rombel } from '../pages/Index';
import GuruManagement from './admin/GuruManagement';
import SiswaManagement from './admin/SiswaManagement';
import KelasManagement from './admin/KelasManagement';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  setUsers: (users: User[]) => void;  
  rombels: Rombel[];
  setRombels: (rombels: Rombel[]) => void;
  onLogout: () => void;
}

const AdminDashboard = ({ currentUser, users, setUsers, rombels, setRombels, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('guru');
  
  const guruCount = users.filter(u => u.role === 'guru').length;
  const siswaCount = users.filter(u => u.role === 'siswa').length;
  const kelasCount = 6; // Fixed 6 classes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrator</h1>
              <p className="text-gray-600">Selamat datang, {currentUser.nama}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <GraduationCap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guruCount}</div>
              <p className="text-xs text-blue-100">Guru terdaftar</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{siswaCount}</div>
              <p className="text-xs text-green-100">Siswa terdaftar</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
              <Building2 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kelasCount}</div>
              <p className="text-xs text-purple-100">Kelas tersedia</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guru">Guru</TabsTrigger>
                <TabsTrigger value="siswa">Siswa</TabsTrigger>
                <TabsTrigger value="kelas">Kelas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="guru" className="mt-6">
                <GuruManagement users={users} setUsers={setUsers} />
              </TabsContent>
              
              <TabsContent value="siswa" className="mt-6">
                <SiswaManagement users={users} setUsers={setUsers} rombels={rombels} />
              </TabsContent>
              
              <TabsContent value="kelas" className="mt-6">
                <KelasManagement users={users} setUsers={setUsers} rombels={rombels} setRombels={setRombels} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
