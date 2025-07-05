
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';
import { User } from '../pages/Index';
import { apiService } from '../services/apiService';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onShowRanking: () => void;
}

const LoginPage = ({ users, onLogin, onShowRanking }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try API login first
      const response = await apiService.login(username, password);
      
      if (response.success && response.data) {
        onLogin(response.data);
        return;
      }
    } catch (apiError) {
      console.log('API login failed, falling back to mock data');
    }

    // Fallback to mock data
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Username atau password salah!');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-4">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Point Ranking System
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Masuk ke sistem peringkat poin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                  placeholder="Masukkan username"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 font-medium">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Guru:</strong> budi / guru123</p>
                <p><strong>Siswa:</strong> ahmad / siswa123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onShowRanking}
          variant="outline"
          className="w-full h-12 text-lg font-semibold bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 transform hover:scale-105"
          disabled={loading}
        >
          <Trophy className="h-5 w-5 mr-2" />
          Lihat Peringkat
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
