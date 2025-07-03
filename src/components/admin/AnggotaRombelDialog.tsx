
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, UserMinus, Building2 } from 'lucide-react';
import { User, Rombel } from '../../pages/Index';

interface AnggotaRombelDialogProps {
  rombel: Rombel;
  users: User[];
  setUsers: (users: User[]) => void;
  onClose: () => void;
}

const AnggotaRombelDialog = ({ rombel, users, setUsers, onClose }: AnggotaRombelDialogProps) => {
  const anggotaRombel = users.filter(u => u.role === 'siswa' && u.rombel === rombel.nama);
  const siswaLain = users.filter(u => u.role === 'siswa' && u.rombel !== rombel.nama);

  const handleAddToRombel = (siswa: User) => {
    const updatedUsers = users.map(u => 
      u.id === siswa.id ? { ...u, rombel: rombel.nama } : u
    );
    setUsers(updatedUsers);
  };

  const handleRemoveFromRombel = (siswa: User) => {
    const updatedUsers = users.map(u => 
      u.id === siswa.id ? { ...u, rombel: undefined } : u
    );
    setUsers(updatedUsers);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Manajemen Anggota Rombel {rombel.nama}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anggota Rombel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Anggota Rombel
                <Badge variant="secondary">{anggotaRombel.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {anggotaRombel.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Belum ada anggota</p>
              ) : (
                anggotaRombel.map((siswa) => (
                  <div
                    key={siswa.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div>
                      <p className="font-medium">{siswa.nama}</p>
                      <p className="text-sm text-gray-600">@{siswa.username}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromRombel(siswa)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Daftar Siswa Lain */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                Siswa Lainnya
                <Badge variant="secondary">{siswaLain.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {siswaLain.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Semua siswa sudah memiliki rombel</p>
              ) : (
                siswaLain.map((siswa) => (
                  <div
                    key={siswa.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div>
                      <p className="font-medium">{siswa.nama}</p>
                      <p className="text-sm text-gray-600">@{siswa.username}</p>
                      {siswa.rombel && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {siswa.rombel}
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToRombel(siswa)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Selesai
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnggotaRombelDialog;
