
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building2, Users, ArrowLeft } from 'lucide-react';
import { User, Rombel, Kelas } from '../../pages/Index';
import RombelManagement from './RombelManagement';

interface KelasManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  rombels: Rombel[];
  setRombels: (rombels: Rombel[]) => void;
  kelas: Kelas[];
  setKelas: (kelas: Kelas[]) => void;
}

const KelasManagement = ({ users, setUsers, rombels, setRombels, kelas, setKelas }: KelasManagementProps) => {
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);

  const getSiswaCountByKelas = (kelasNama: string) => {
    return users.filter(u => u.role === 'siswa' && u.rombel?.startsWith(kelasNama)).length;
  };

  const getRombelCountByKelas = (kelasNama: string) => {
    return rombels.filter(r => r.nama.startsWith(kelasNama)).length;
  };

  const toggleKelasStatus = (kelasId: string) => {
    setKelas(kelas.map(k => 
      k.id === kelasId ? { ...k, active: !k.active } : k
    ));
  };

  if (selectedKelas) {
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
        <p className="text-sm text-gray-600">
          {kelas.filter(k => k.active).length} dari {kelas.length} kelas aktif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kelas.map((kelasItem) => (
          <Card key={kelasItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  {kelasItem.nama}
                </CardTitle>
                <Badge variant={kelasItem.active ? "default" : "secondary"}>
                  {kelasItem.active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status Kelas:</span>
                  <Switch
                    checked={kelasItem.active}
                    onCheckedChange={() => toggleKelasStatus(kelasItem.id)}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{getSiswaCountByKelas(kelasItem.nama)} siswa total</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{getRombelCountByKelas(kelasItem.nama)} rombel</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedKelas(kelasItem.nama)}
                  disabled={!kelasItem.active}
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
