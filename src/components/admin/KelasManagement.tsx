
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, ArrowLeft } from 'lucide-react';
import { User, Rombel } from '../../pages/Index';
import RombelManagement from './RombelManagement';

interface KelasManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  rombels: Rombel[];
  setRombels: (rombels: Rombel[]) => void;
}

const KelasManagement = ({ users, setUsers, rombels, setRombels }: KelasManagementProps) => {
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
  
  const kelasList = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

  const getSiswaCountByKelas = (kelas: string) => {
    return users.filter(u => u.role === 'siswa' && u.rombel?.startsWith(kelas)).length;
  };

  const getRombelCountByKelas = (kelas: string) => {
    return rombels.filter(r => r.nama.startsWith(kelas)).length;
  };

  if (selectedKelas) {
    // Filter rombels for selected class
    const kelasRombels = rombels.filter(r => r.nama.startsWith(selectedKelas));
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedKelas(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Kelas
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">Manajemen Rombel - {selectedKelas}</h2>
        </div>
        
        <RombelManagement 
          users={users} 
          setUsers={setUsers} 
          rombels={kelasRombels} 
          setRombels={setRombels}
          selectedKelas={selectedKelas}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manajemen Kelas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kelasList.map((kelas) => (
          <Card key={kelas} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  {kelas}
                </CardTitle>
                <Badge variant="outline">{getSiswaCountByKelas(kelas)} siswa</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{getSiswaCountByKelas(kelas)} siswa total</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{getRombelCountByKelas(kelas)} rombel</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedKelas(kelas)}
                >
                  Kelola Rombel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KelasManagement;
