
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Star } from 'lucide-react';
import { User, Rombel } from '../../pages/Index';

interface SiswaManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  rombels: Rombel[];
}

const SiswaManagement = ({ users, setUsers, rombels }: SiswaManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    rombel: '',
    username: '',
    password: ''
  });

  const siswas = users.filter(u => u.role === 'siswa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSiswa: User = {
      id: Date.now().toString(),
      nama: formData.nama,
      username: formData.username,
      password: formData.password,
      role: 'siswa',
      rombel: formData.rombel,
      points: 0
    };
    
    setUsers([...users, newSiswa]);
    setFormData({ nama: '', rombel: '', username: '', password: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manajemen Siswa</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambahkan Siswa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Masukkan nama siswa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rombel">Rombel</Label>
                <Select value={formData.rombel} onValueChange={(value) => setFormData({...formData, rombel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rombel" />
                  </SelectTrigger>
                  <SelectContent>
                    {rombels.map((rombel) => (
                      <SelectItem key={rombel.id} value={rombel.nama}>
                        {rombel.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Masukkan username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Masukkan password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Tambah Siswa
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {siswas.map((siswa) => (
          <Card key={siswa.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  {siswa.nama}
                </CardTitle>
                <Badge variant="secondary">Siswa</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Username:</strong> {siswa.username}</p>
                <p><strong>Rombel:</strong> {siswa.rombel}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-lg text-gray-900">{siswa.points || 0} Poin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {siswas.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada siswa yang terdaftar</p>
        </div>
      )}
    </div>
  );
};

export default SiswaManagement;
