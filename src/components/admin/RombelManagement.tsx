
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users } from 'lucide-react';
import { User, Rombel } from '../../pages/Index';
import AnggotaRombelDialog from './AnggotaRombelDialog';

interface RombelManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  rombels: Rombel[];
  setRombels: (rombels: Rombel[]) => void;
  selectedKelas?: string;
}

const RombelManagement = ({ users, setUsers, rombels, setRombels, selectedKelas }: RombelManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRombel, setSelectedRombel] = useState<Rombel | null>(null);
  const [formData, setFormData] = useState({
    nama: ''
  });

  // Filter rombels based on selected class if provided
  const displayRombels = selectedKelas 
    ? rombels.filter(r => r.nama.startsWith(selectedKelas))
    : rombels;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let rombelName = formData.nama;
    
    // If we're in class mode, prefix the rombel name with the class
    if (selectedKelas && !formData.nama.startsWith(selectedKelas)) {
      rombelName = `${selectedKelas} - ${formData.nama}`;
    }
    
    const newRombel: Rombel = {
      id: Date.now().toString(),
      nama: rombelName,
      siswa: []
    };
    
    setRombels([...rombels, newRombel]);
    setFormData({ nama: '' });
    setIsDialogOpen(false);
  };

  const getSiswaCount = (rombelNama: string) => {
    return users.filter(u => u.role === 'siswa' && u.rombel === rombelNama).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedKelas ? `Manajemen Rombel ${selectedKelas}` : 'Manajemen Rombel'}
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambahkan Rombel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Tambah Rombel Baru {selectedKelas && `untuk ${selectedKelas}`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Rombel</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder={selectedKelas ? "Contoh: A, B, C" : "Masukkan nama rombel (misal: Kelas 1 - A)"}
                  required
                />
                {selectedKelas && (
                  <p className="text-sm text-gray-500">
                    Akan dibuat sebagai: {selectedKelas} - {formData.nama}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Tambah Rombel
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayRombels.map((rombel) => (
          <Card key={rombel.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  {rombel.nama}
                </CardTitle>
                <Badge variant="outline">{getSiswaCount(rombel.nama)} siswa</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{getSiswaCount(rombel.nama)} siswa terdaftar</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedRombel(rombel)}
                >
                  Anggota Rombel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayRombels.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {selectedKelas 
              ? `Belum ada rombel yang terdaftar untuk ${selectedKelas}` 
              : 'Belum ada rombel yang terdaftar'
            }
          </p>
        </div>
      )}

      {selectedRombel && (
        <AnggotaRombelDialog
          rombel={selectedRombel}
          users={users}
          setUsers={setUsers}
          onClose={() => setSelectedRombel(null)}
        />
      )}
    </div>
  );
};

export default RombelManagement;
