
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Star, Trophy, Medal, Award, TrendingDown } from 'lucide-react';
import { User, Kelas, PointHistory } from '../pages/Index';

interface RankingPageProps {
  users: User[];
  kelas: Kelas[];
  pointHistories: PointHistory[];
  onBack: () => void;
}

const RankingPage = ({ users, kelas, pointHistories, onBack }: RankingPageProps) => {
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);

  const activeKelas = kelas.filter(k => k.active);
  const todayHistories = pointHistories.filter(h => h.tanggal === new Date().toISOString().split('T')[0]);

  const getTopSiswaByKelas = (kelasNama: string, limit = 10) => {
    return users
      .filter(u => u.role === 'siswa' && u.rombel?.startsWith(kelasNama))
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, limit);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-500" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <Star className="h-4 w-4 text-blue-500" />;
  };

  const formatPoints = (points: number) => {
    if (points < 0) return `${points}`;
    return `${points}`;
  };

  const getPointsColor = (points: number) => {
    if (points < 0) return 'text-red-600';
    return 'text-gray-900';
  };

  const MarqueeText = ({ histories, kelasFilter }: { histories: PointHistory[], kelasFilter?: string }) => {
    const filteredHistories = kelasFilter 
      ? histories.filter(h => {
          const siswa = users.find(u => u.id === h.siswaId);
          return siswa?.rombel?.startsWith(kelasFilter);
        })
      : histories;

    const historyText = filteredHistories.map(h => {
      const siswa = users.find(u => u.id === h.siswaId);
      const guru = users.find(u => u.id === h.guruId);
      const pointText = h.points > 0 ? `+${h.points}` : `${h.points}`;
      return `${siswa?.nama} mendapat ${pointText} poin dari ${guru?.nama} - ${h.keterangan}`;
    }).join(' • ');

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-hidden">
        <div 
          className="whitespace-nowrap text-blue-800 text-lg font-semibold"
          style={{
            animation: 'marquee 30s linear infinite'
          }}
        >
          {historyText || 'Belum ada aktivitas hari ini'}
        </div>
      </div>
    );
  };

  if (selectedKelas) {
    const topSiswa = getTopSiswaByKelas(selectedKelas, 10);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setSelectedKelas(null)}
              className="flex items-center gap-2 text-lg px-6 py-3"
            >
              <ArrowLeft className="h-5 w-5" />
              Kembali
            </Button>
            <h1 className="text-4xl font-bold text-gray-900">Peringkat {selectedKelas}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Top 3 Display */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {topSiswa.slice(0, 3).map((siswa, index) => {
                  const rank = index + 1;
                  const bgColors = [
                    'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300',
                    'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300',
                    'bg-gradient-to-r from-orange-100 to-red-100 border-orange-300'
                  ];
                  
                  return (
                    <Card key={siswa.id} className={`${bgColors[index]} text-center`}>
                      <CardContent className="p-8">
                        {getRankIcon(rank)}
                        <Avatar className="h-24 w-24 mx-auto my-6 ring-4 ring-white">
                          <AvatarImage src={siswa.foto} alt={siswa.nama} />
                          <AvatarFallback className="text-3xl">{siswa.nama.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{siswa.nama}</h2>
                        <p className="text-gray-600 mb-4">{siswa.rombel}</p>
                        <div className="flex items-center justify-center gap-2">
                          {(siswa.points || 0) < 0 ? (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                          ) : (
                            <Star className="h-6 w-6 text-yellow-500" />
                          )}
                          <span className={`text-4xl font-bold ${getPointsColor(siswa.points || 0)}`}>
                            {formatPoints(siswa.points || 0)}
                          </span>
                          <span className="text-gray-600 text-xl">poin</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Remaining Top 10 */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Peringkat 4-10</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topSiswa.slice(3, 10).map((siswa, index) => {
                      const rank = index + 4;
                      return (
                        <div
                          key={siswa.id}
                          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <span className="font-bold text-blue-600">#{rank}</span>
                          </div>
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={siswa.foto} alt={siswa.nama} />
                            <AvatarFallback className="text-lg">{siswa.nama.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{siswa.nama}</h3>
                            <p className="text-gray-600">{siswa.rombel}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {(siswa.points || 0) < 0 ? (
                                <TrendingDown className="h-5 w-5 text-red-500" />
                              ) : (
                                <Star className="h-5 w-5 text-yellow-500" />
                              )}
                              <span className={`font-bold text-2xl ${getPointsColor(siswa.points || 0)}`}>
                                {formatPoints(siswa.points || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Marquee for class-specific history */}
          <MarqueeText histories={todayHistories} kelasFilter={selectedKelas} />
        </div>
        
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-gray-900">Peringkat Siswa</h1>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 text-lg px-6 py-3">
            <ArrowLeft className="h-5 w-5" />
            Kembali
          </Button>
        </div>

        {/* Top Students by Active Classes - Optimized for TV */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {activeKelas.map((kelasItem) => {
            const topSiswa = getTopSiswaByKelas(kelasItem.nama, 5);
            const champion = topSiswa[0];
            const runners = topSiswa.slice(1, 5);

            return (
              <Card 
                key={kelasItem.id} 
                className="hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedKelas(kelasItem.nama)}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{kelasItem.nama}</CardTitle>
                </CardHeader>
                <CardContent>
                  {champion ? (
                    <>
                      {/* Champion */}
                      <div className="text-center mb-6 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                        <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                        <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-yellow-300">
                          <AvatarImage src={champion.foto} alt={champion.nama} />
                          <AvatarFallback className="text-xl">{champion.nama.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{champion.nama}</h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          {(champion.points || 0) < 0 ? (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                          ) : (
                            <Star className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className={`font-bold text-xl ${getPointsColor(champion.points || 0)}`}>
                            {formatPoints(champion.points || 0)}
                          </span>
                        </div>
                      </div>

                      {/* Top 4 Runners */}
                      <div className="space-y-3">
                        {runners.map((siswa, index) => (
                          <div key={siswa.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                              <span className="text-sm font-bold text-blue-600">#{index + 2}</span>
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={siswa.foto} alt={siswa.nama} />
                              <AvatarFallback className="text-sm">{siswa.nama.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{siswa.nama}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {(siswa.points || 0) < 0 ? (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              ) : (
                                <Star className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className={`text-sm font-bold ${getPointsColor(siswa.points || 0)}`}>
                                {formatPoints(siswa.points || 0)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Belum ada siswa
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* General Marquee */}
        <MarqueeText histories={todayHistories} />
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
};

export default RankingPage;
