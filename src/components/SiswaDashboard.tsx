
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Users, Award, LogOut, Building2 } from 'lucide-react';
import { User, Rombel, PointHistory } from '../pages/Index';

interface SiswaDashboardProps {
  currentUser: User;
  users: User[];
  rombels: Rombel[];
  pointHistories: PointHistory[];
  onLogout: () => void;
}

const SiswaDashboard = ({ currentUser, users, rombels, pointHistories, onLogout }: SiswaDashboardProps) => {
  const currentKelas = currentUser.rombel?.split(' - ')[0] || '';
  
  const siswaSeRombel = users
    .filter(u => u.role === 'siswa' && u.rombel === currentUser.rombel)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const siswaSeKelas = users
    .filter(u => u.role === 'siswa' && u.rombel?.startsWith(currentKelas))
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const semuaSiswa = users
    .filter(u => u.role === 'siswa')
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const myRankRombel = siswaSeRombel.findIndex(s => s.id === currentUser.id) + 1;
  const myRankKelas = siswaSeKelas.findIndex(s => s.id === currentUser.id) + 1;
  const myRankUmum = semuaSiswa.findIndex(s => s.id === currentUser.id) + 1;
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
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Award className="h-4 w-4 text-gray-500" />;
    if (rank === 3) return <Award className="h-4 w-4 text-orange-500" />;
    return <Users className="h-4 w-4 text-blue-500" />;
  };

  const renderRankingList = (siswaList: User[], currentRank: number, title: string) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">{title}</h3>
      {siswaList.slice(0, 10).map((siswa, index) => {
        const rank = index + 1;
        const isCurrentUser = siswa.id === currentUser.id;
        
        return (
          <div
            key={siswa.id}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
              isCurrentUser 
                ? 'bg-blue-100 border-blue-300 shadow-sm' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${getRankColor(rank)}`}>
                {getRankIcon(rank)}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={siswa.foto} alt={siswa.nama} />
                <AvatarFallback className="text-xs">{siswa.nama.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                  {siswa.nama} {isCurrentUser && '(Saya)'}
                </p>
                <p className="text-xs text-gray-600 truncate">{siswa.rombel}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-sm font-bold">{siswa.points || 0}</span>
              </div>
              <Badge variant={rank <= 3 ? 'default' : 'secondary'} className="text-xs">
                #{rank}
              </Badge>
            </div>
          </div>
        );
      })}
      
      {siswaList.length === 0 && (
        <div className="text-center py-6">
          <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-xs">Belum ada data peringkat</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile-optimized Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 truncate">Dashboard Siswa</h1>
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
        {/* Mobile Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <div>
                  <div className="text-lg font-bold">{myPoints}</div>
                  <p className="text-xs text-blue-100">Total Poin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <div>
                  <div className="text-lg font-bold">#{myRankRombel}</div>
                  <p className="text-xs text-green-100">Rank Rombel</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <div>
                  <div className="text-lg font-bold">#{myRankKelas}</div>
                  <p className="text-xs text-purple-100">Rank Kelas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <div>
                  <div className="text-lg font-bold">#{myRankUmum}</div>
                  <p className="text-xs text-orange-100">Rank Umum</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Peringkat Tabs */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Peringkat Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rombel" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="rombel" className="text-xs">Rombel</TabsTrigger>
                  <TabsTrigger value="kelas" className="text-xs">Kelas</TabsTrigger>
                  <TabsTrigger value="umum" className="text-xs">Umum</TabsTrigger>
                </TabsList>
                
                <TabsContent value="rombel">
                  {renderRankingList(siswaSeRombel, myRankRombel, `Peringkat ${currentUser.rombel}`)}
                </TabsContent>
                
                <TabsContent value="kelas">
                  {renderRankingList(siswaSeKelas, myRankKelas, `Peringkat ${currentKelas}`)}
                </TabsContent>
                
                <TabsContent value="umum">
                  {renderRankingList(semuaSiswa, myRankUmum, 'Peringkat Umum Semua Siswa')}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Riwayat Poin */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-blue-500" />
                Riwayat Poin Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myPointHistory.slice(0, 10).map((history) => {
                  const guru = users.find(u => u.id === history.guruId);
                  const isNegative = history.points < 0;
                  return (
                    <div
                      key={history.id}
                      className={`flex items-center justify-between p-2 rounded-lg border ${
                        isNegative ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Star className={`h-3 w-3 ${isNegative ? 'text-red-500' : 'text-green-500'}`} />
                          <span className={`text-sm font-semibold ${isNegative ? 'text-red-700' : 'text-green-700'}`}>
                            {history.points > 0 ? '+' : ''}{history.points} poin
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Dari: {guru?.nama || 'Guru'}
                        </p>
                        {history.keterangan && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
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
                <div className="text-center py-6">
                  <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">Belum ada riwayat poin</p>
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
