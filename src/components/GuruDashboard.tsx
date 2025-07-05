import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Users, Star, Plus, Minus, LogOut } from 'lucide-react';
import { User, Rombel, PointHistory, Kelas } from '../pages/Index';

interface GuruDashboardProps {
  currentUser: User;
  users: User[];
  setUsers: (users: User[]) => void;
  rombels: Rombel[];
  kelas: Kelas[];
  pointHistories: PointHistory[];
  setPointHistories: (histories: PointHistory[]) => void;
  onLogout: () => void;
}

const GuruDashboard = ({ 
  currentUser, 
  users, 
  setUsers, 
  rombels, 
  kelas,
  pointHistories, 
  setPointHistories, 
  onLogout 
}: GuruDashboardProps) => {
  const [selectedRombel, setSelectedRombel] = useState<string | null>(null);
  const [selectedSiswa, setSelectedSiswa] = useState<User | null>(null);
  const [isPointDialogOpen, setIsPointDialogOpen] = useState(false);
  const [pointData, setPointData] = useState({
    points: '',
    keterangan: '',
    isNegative: false
  });

  const activeKelas = kelas.filter(k => k.active);
  const activeRombels = rombels.filter(r => 
    activeKelas.some(k => r.nama.startsWith(k.nama))
  );

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return;

    const pointValue = parseInt(pointData.points);
    if (pointValue < 1 || pointValue > 10) return;

    const finalPoints = pointData.isNegative ? -pointValue : pointValue;

    const updatedUsers = users.map(u => 
      u.id === selectedSiswa.id 
        ? { ...u, points: (u.points || 0) + finalPoints }
        : u
    );
    setUsers(updatedUsers);

    const newHistory: PointHistory = {
      id: Date.now().toString(),
      siswaId: selectedSiswa.id,
      guruId: currentUser.id,
      points: finalPoints,
      keterangan: pointData.keterangan,
      tanggal: new Date().toISOString().split('T')[0]
    };
    setPointHistories([...pointHistories, newHistory]);

    setPointData({ points: '', keterangan: '', isNegative: false });
    setIsPointDialogOpen(false);
    setSelectedSiswa(null);
  };

  const getSiswaByRombel = (rombelNama: string) => {
    return users.filter(u => u.role === 'siswa' && u.rombel === rombelNama);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile-optimized Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 truncate">Dashboard Guru</h1>
              <p className="text-sm text-gray-600 truncate">Selamat datang, {currentUser.nama}</p>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {!selectedRombel ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pilih Rombel</h2>
              <p className="text-sm text-gray-600">Pilih rombel untuk melihat daftar siswa</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeRombels.map((rombel) => {
                const siswaCount = getSiswaByRombel(rombel.nama).length;
                return (
                  <Card 
                    key={rombel.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => setSelectedRombel(rombel.nama)}
                  >
                    <CardHeader className="text-center pb-3">
                      <Building2 className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                      <CardTitle className="text-lg">{rombel.nama}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{siswaCount} siswa</span>
                      </div>
                      <Button className="w-full" size="sm">
                        Pilih Rombel
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {activeRombels.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada rombel yang tersedia</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                onClick={() => setSelectedRombel(null)} 
                variant="outline"
                size="sm"
              >
                ← Kembali
              </Button>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-gray-900 truncate">Rombel {selectedRombel}</h2>
                <p className="text-sm text-gray-600">Daftar siswa dan poin mereka</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getSiswaByRombel(selectedRombel).map((siswa) => (
                <Card key={siswa.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={siswa.foto} alt={siswa.nama} />
                        <AvatarFallback>{siswa.nama.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{siswa.nama}</CardTitle>
                        <Badge variant="secondary" className="text-xs">@{siswa.username}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className={`flex items-center justify-center gap-2 py-3 rounded-lg ${
                        (siswa.points || 0) < 0 ? 'bg-red-50' : 'bg-yellow-50'
                      }`}>
                        <Star className={`h-5 w-5 ${(siswa.points || 0) < 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                        <span className={`text-xl font-bold ${(siswa.points || 0) < 0 ? 'text-red-700' : 'text-gray-900'}`}>
                          {siswa.points || 0}
                        </span>
                        <span className="text-gray-600">poin</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Dialog open={isPointDialogOpen && selectedSiswa?.id === siswa.id} onOpenChange={setIsPointDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedSiswa(siswa);
                                setPointData({...pointData, isNegative: false});
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              <span className="text-xs">Tambah</span>
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        
                        <Dialog open={isPointDialogOpen && selectedSiswa?.id === siswa.id} onOpenChange={setIsPointDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedSiswa(siswa);
                                setPointData({...pointData, isNegative: true});
                              }}
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              <span className="text-xs">Kurangi</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg">
                                {pointData.isNegative ? 'Kurangi Poin' : 'Tambah Poin'} untuk {siswa.nama}
                              </DialogTitle>
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
                                  placeholder="Masukkan keterangan"
                                  rows={3}
                                  required
                                />
                              </div>
                              <Button type="submit" className="w-full">
                                {pointData.isNegative ? 'Kurangi Poin' : 'Berikan Poin'}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getSiswaByRombel(selectedRombel).length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada siswa di rombel ini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuruDashboard;
