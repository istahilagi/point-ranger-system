
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Star, Trophy, Medal, Award } from 'lucide-react';
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

  const getTopSiswaByKelas = (kelasNama: string, limit = 5) => {
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-blue-800">
          {historyText || 'Belum ada aktivitas hari ini'}
        </div>
      </div>
    );
  };

  if (selectedKelas) {
    const topSiswa = getTopSiswaByKelas(selectedKelas, 10);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedKelas(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Peringkat {selectedKelas}</h1>
          </div>

          {/* Top Student - Large Display */}
          {topSiswa[0] && (
            <Card className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-yellow-300">
                  <AvatarImage src={topSiswa[0].foto} alt={topSiswa[0].nama} />
                  <AvatarFallback className="text-2xl">{topSiswa[0].nama.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{topSiswa[0].nama}</h2>
                <p className="text-gray-600 mb-2">{topSiswa[0].rombel}</p>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-900">{topSiswa[0].points || 0}</span>
                  <span className="text-gray-600">poin</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 10 List */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top 10 {selectedKelas}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSiswa.map((siswa, index) => (
                  <div
                    key={siswa.id}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={siswa.foto} alt={siswa.nama} />
                      <AvatarFallback>{siswa.nama.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{siswa.nama}</h3>
                      <p className="text-sm text-gray-600">{siswa.rombel}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-lg">{siswa.points || 0}</span>
                      </div>
                      <Badge variant={index < 3 ? 'default' : 'secondary'} className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marquee for class-specific history */}
          <MarqueeText histories={todayHistories} kelasFilter={selectedKelas} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Peringkat Siswa</h1>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>

        {/* Top Students by Active Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activeKelas.map((kelasItem) => {
            const topSiswa = getTopSiswaByKelas(kelasItem.nama, 5);
            const champion = topSiswa[0];
            const runners = topSiswa.slice(1, 5);

            return (
              <Card 
                key={kelasItem.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedKelas(kelasItem.nama)}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{kelasItem.nama}</CardTitle>
                </CardHeader>
                <CardContent>
                  {champion ? (
                    <>
                      {/* Champion */}
                      <div className="text-center mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <Avatar className="h-16 w-16 mx-auto mb-2 ring-2 ring-yellow-300">
                          <AvatarImage src={champion.foto} alt={champion.nama} />
                          <AvatarFallback>{champion.nama.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-gray-900">{champion.nama}</h3>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{champion.points || 0}</span>
                        </div>
                      </div>

                      {/* Top 4 Runners */}
                      <div className="space-y-2">
                        {runners.map((siswa, index) => (
                          <div key={siswa.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <div className="w-6 h-6 flex items-center justify-center">
                              {getRankIcon(index + 2)}
                            </div>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={siswa.foto} alt={siswa.nama} />
                              <AvatarFallback className="text-xs">{siswa.nama.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{siswa.nama}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm font-semibold">{siswa.points || 0}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
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

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RankingPage;
