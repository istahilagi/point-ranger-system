
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, GraduationCap, Edit, Trash2 } from 'lucide-react';
import { User } from '../../pages/Index';

interface GuruManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const GuruManagement = ({ users, setUsers }: GuruManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: ''
  });

  const gurus = users.filter(u => u.role === 'guru');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGuru) {
      // Update existing guru
      const updatedUsers = users.map(user => 
        user.id === editingGuru.id 
          ? { ...user, nama: formData.nama, username: formData.username, password: formData.password }
          : user
      );
      setUsers(updatedUsers);
      setEditingGuru(null);
    } else {
      // Add new guru
      const newGuru: User = {
        id: Date.now().toString(),
        nama: formData.nama,
        username: formData.username,
        password: formData.password,
        role: 'guru'
      };
      setUsers([...users, newGuru]);
    }
    
    setFormData({ nama: '', username: '', password: '' });
    setIsDialogOpen(false);
  };

  const handleEdit = (guru: User) => {
    setEditingGuru(guru);
    setFormData({
      nama: guru.nama,
      username: guru.username,
      password: guru.password
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (guruId: string) => {
    const updatedUsers = users.filter(user => user.id !== guruId);
    setUsers(updatedUsers);
  };

  const resetForm = () => {
    setFormData({ nama: '', username: '', password: '' });
    setEditingGuru(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manajemen Guru</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambahkan Guru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGuru ? 'Edit Guru' : 'Tambah Guru Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Masukkan nama guru"
                  required
                />
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
                {editingGuru ? 'Update Guru' : 'Tambah Guru'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gurus.map((guru) => (
          <Card key={guru.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  {guru.nama}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Guru</Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(guru)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Guru</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus guru {guru.nama}? Aksi ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(guru.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Username:</strong> {guru.username}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gurus.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada guru yang terdaftar</p>
        </div>
      )}
    </div>
  );
};

export default GuruManagement;
