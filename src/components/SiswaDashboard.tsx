
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users, Award, LogOut } from 'lucide-react';
import { User, Rombel, PointHistory } from '../pages/Index';

interface SiswaDashboardProps {
  currentUser: User;
  users: User[];
  rombels: Rombel[];
  pointHistories: PointHistory[];
  onLogout: () => void;
}

const SiswaDashboard = ({ currentUser, users, rombels, pointHistories, onLogout }: SiswaDashboardProps) => {
  const siswaSeRombel = users
    .filter(u => u.role === 'siswa' && u.rombel === currentUser.rombel)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const myRank = siswaSeRombel.findIndex(s => s.id === currentUser.id) + 1;
  const myPoints = currentUser.points || 0;

  const myPointHistory = pointHistories
    .filter(h => h.siswaId === currentUser.id)
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-500" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <Users className="h-5 w-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Siswa</h1>
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
              <CardTitle className="text-sm font-medium">Total Poin Saya</CardTitle>
              <Star className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myPoints}</div>
              <p className="text-xs text-blue-100">Poin yang terkumpul</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peringkat Saya</CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{myRank}</div>
              <p className="text-xs text-green-100">Dari {siswaSeRombel.length} siswa</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rombel</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentUser.rombel}</div>
              <p className="text-xs text-purple-100">Kelas saya</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Peringkat Rombel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Peringkat Rombel {currentUser.rombel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {siswaSeRombel.map((siswa, index) => {
                  const rank = index + 1;
                  const isCurrentUser = siswa.id === currentUser.id;
                  
                  return (
                    <div
                      key={siswa.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        isCurrentUser 
                          ? 'bg-blue-100 border-blue-300 shadow-md' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${getRankColor(rank)}`}>
                          {getRankIcon(rank)}
                        </div>
                        <div>
                          <p className={`font-semibold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                            {siswa.nama} {isCurrentUser && '(Saya)'}
                          </p>
                          <p className="text-sm text-gray-600">@{siswa.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold text-lg">{siswa.points || 0}</span>
                        </div>
                        <Badge variant={rank <= 3 ? 'default' : 'secondary'} className="text-xs">
                          Peringkat #{rank}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {siswaSeRombel.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada data peringkat</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Riwayat Poin */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-500" />
                Riwayat Poin Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myPointHistory.slice(0, 10).map((history) => {
                  const guru = users.find(u => u.id === history.guruId);
                  return (
                    <div
                      key={history.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-green-700">+{history.points} poin</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Dari: {guru?.nama || 'Guru'}
                        </p>
                        {history.keterangan && (
                          <p className="text-xs text-gray-500 mt-1">
                            "{history.keterangan}"
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{history.tanggal}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {myPointHistory.length === 0 && (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada riwayat poin</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SiswaDashboard;
