import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Users, Star, Upload, Download, Camera } from 'lucide-react';
import { User, Rombel } from '../../pages/Index';
import * as XLSX from 'xlsx';

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
    password: '',
    foto: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

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
      points: 0,
      foto: formData.foto
    };
    
    setUsers([...users, newSiswa]);
    setFormData({ nama: '', rombel: '', username: '', password: '', foto: '' });
    setIsDialogOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({...formData, foto: event.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const newSiswas: User[] = jsonData.map((row, index) => ({
          id: (Date.now() + index).toString(),
          nama: row.nama || row.Nama || '',
          username: row.username || row.Username || '',
          password: row.password || row.Password || 'default123',
          role: 'siswa' as const,
          rombel: row.rombel || row.Rombel || '',
          points: 0
        })).filter(siswa => siswa.nama && siswa.username);

        setUsers([...users, ...newSiswas]);
        console.log(`Successfully imported ${newSiswas.length} students`);
      } catch (error) {
        console.error('Error importing Excel file:', error);
        alert('Error importing Excel file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportExcel = () => {
    const exportData = siswas.map(siswa => ({
      Nama: siswa.nama,
      Username: siswa.username,
      Rombel: siswa.rombel || '',
      Points: siswa.points || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
    
    XLSX.writeFile(workbook, `data-siswa-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manajemen Siswa</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportExcel}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportExcel}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambahkan Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foto">Foto Siswa</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={formData.foto} alt="Preview" />
                      <AvatarFallback>
                        <Camera className="h-6 w-6 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        ref={photoInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photoInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Foto
                      </Button>
                    </div>
                  </div>
                </div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {siswas.map((siswa) => (
          <Card key={siswa.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={siswa.foto} alt={siswa.nama} />
                  <AvatarFallback>{siswa.nama.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {siswa.nama}
                  </CardTitle>
                  <Badge variant="secondary">Siswa</Badge>
                </div>
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
