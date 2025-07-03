
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, Star, Plus, LogOut } from 'lucide-react';
import { User, Rombel, PointHistory } from '../pages/Index';

interface GuruDashboardProps {
  currentUser: User;
  users: User[];
  setUsers: (users: User[]) => void;
  rombels: Rombel[];
  pointHistories: PointHistory[];
  setPointHistories: (histories: PointHistory[]) => void;
  onLogout: () => void;
}

const GuruDashboard = ({ 
  currentUser, 
  users, 
  setUsers, 
  rombels, 
  pointHistories, 
  setPointHistories, 
  onLogout 
}: GuruDashboardProps) => {
  const [selectedRombel, setSelectedRombel] = useState<string | null>(null);
  const [selectedSiswa, setSelectedSiswa] = useState<User | null>(null);
  const [isPointDialogOpen, setIsPointDialogOpen] = useState(false);
  const [pointData, setPointData] = useState({
    points: '',
    keterangan: ''
  });

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;

    const points = parseInt(pointData.points);
    if (points < 1 || points > 10) return;

    // Update user points
    const updatedUsers = users.map(u => 
      u.id === selectedSiswa.id 
        ? { ...u, points: (u.points || 0) + points }
        : u
    );
    setUsers(updatedUsers);

    // Add to history
    const newHistory: PointHistory = {
      id: Date.now().toString(),
      siswaId: selectedSiswa.id,
      guruId: currentUser.id,
      points: points,
      keterangan: pointData.keterangan,
      tanggal: new Date().toLocaleDateString('id-ID')
    };
    setPointHistories([...pointHistories, newHistory]);

    setPointData({ points: '', keterangan: '' });
    setIsPointDialogOpen(false);
    setSelectedSiswa(null);
  };

  const getSiswaByRombel = (rombelNama: string) => {
    return users.filter(u => u.role === 'siswa' && u.rombel === rombelNama);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
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
        {!selectedRombel ? (
          // Daftar Rombel
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Rombel</h2>
              <p className="text-gray-600">Pilih rombel untuk melihat daftar siswa dan memberikan poin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rombels.map((rombel) => {
                const siswaCount = getSiswaByRombel(rombel.nama).length;
                return (
                  <Card 
                    key={rombel.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => setSelectedRombel(rombel.nama)}
                  >
                    <CardHeader className="text-center pb-4">
                      <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <CardTitle className="text-xl">{rombel.nama}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{siswaCount} siswa</span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Pilih Rombel
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {rombels.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Belum ada rombel yang tersedia</p>
              </div>
            )}
          </div>
        ) : (
          // Daftar Siswa di Rombel
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Rombel {selectedRombel}</h2>
                <p className="text-gray-600">Daftar siswa dan poin mereka</p>
              </div>
              <Button 
                onClick={() => setSelectedRombel(null)} 
                variant="outline"
              >
                Kembali ke Daftar Rombel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSiswaByRombel(selectedRombel).map((siswa) => (
                <Card key={siswa.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        {siswa.nama}
                      </CardTitle>
                      <Badge variant="secondary">@{siswa.username}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 py-3 bg-yellow-50 rounded-lg">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <span className="text-2xl font-bold text-gray-900">{siswa.points || 0}</span>
                        <span className="text-gray-600">poin</span>
                      </div>
                      
                      <Dialog open={isPointDialogOpen && selectedSiswa?.id === siswa.id} onOpenChange={setIsPointDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedSiswa(siswa)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Poin
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Tambah Poin untuk {siswa.nama}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddPoint} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="points">Poin (1-10)</Label>
                              <Input
                                id="points"
                                type="number"
                                min="1"
                                max="10"
                                value={pointData.points}
                                onChange={(e) => setPointData({...pointData, points: e.target.value})}
                                placeholder="Masukkan poin (1-10)"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="keterangan">Keterangan</Label>
                              <Textarea
                                id="keterangan"
                                value={pointData.keterangan}
                                onChange={(e) => setPointData({...pointData, keterangan: e.target.value})}
                                placeholder="Masukkan keterangan (opsional)"
                                rows={3}
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Berikan Poin
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getSiswaByRombel(selectedRombel).length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Belum ada siswa di rombel ini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuruDashboard;
