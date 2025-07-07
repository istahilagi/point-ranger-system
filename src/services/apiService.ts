// API Service untuk integrasi dengan MySQL custom API
const API_BASE_URL = 'http://45.158.126.50:3002';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

class ApiService {
  // Test API connection
  async testConnection() {
    try {
      console.log('Testing API connection...');
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      console.log('API Test Result:', data);
      return data;
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      return { success: false, error: error.message };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      console.log('Request options:', options);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        console.error('HTTP error:', response.status, data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Users Management
  async getUsers(filters?: { role?: string; rombel?: string }) {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.rombel) params.append('rombel', filters.rombel);
    
    return this.request(`/users${params.toString() ? `?${params.toString()}` : ''}`);
  }

  async createUser(userData: any) {
    console.log('Creating user with data:', userData);
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    console.log('Updating user:', id, userData);
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    console.log('Deleting user:', id);
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Kelas Management
  async getKelas() {
    return this.request('/kelas');
  }

  async createKelas(kelasData: any) {
    return this.request('/kelas', {
      method: 'POST',
      body: JSON.stringify(kelasData),
    });
  }

  async updateKelas(id: string, kelasData: any) {
    return this.request(`/kelas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(kelasData),
    });
  }

  async deleteKelas(id: string) {
    return this.request(`/kelas/${id}`, {
      method: 'DELETE',
    });
  }

  // Rombel Management
  async getRombel(filters?: { kelas?: string }) {
    const params = new URLSearchParams();
    if (filters?.kelas) params.append('kelas', filters.kelas);
    
    return this.request(`/rombel${params.toString() ? `?${params.toString()}` : ''}`);
  }

  async createRombel(rombelData: any) {
    return this.request('/rombel', {
      method: 'POST',
      body: JSON.stringify(rombelData),
    });
  }

  async updateRombel(id: string, rombelData: any) {
    return this.request(`/rombel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rombelData),
    });
  }

  async deleteRombel(id: string) {
    return this.request(`/rombel/${id}`, {
      method: 'DELETE',
    });
  }

  // Point History
  async getPointHistory(filters?: { siswaId?: string; guruId?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.siswaId) params.append('siswaId', filters.siswaId);
    if (filters?.guruId) params.append('guruId', filters.guruId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    return this.request(`/point-history${params.toString() ? `?${params.toString()}` : ''}`);
  }

  async createPointHistory(pointData: any) {
    return this.request('/point-history', {
      method: 'POST',
      body: JSON.stringify(pointData),
    });
  }

  async updatePointHistory(id: string, pointData: any) {
    return this.request(`/point-history/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pointData),
    });
  }

  async deletePointHistory(id: string) {
    return this.request(`/point-history/${id}`, {
      method: 'DELETE',
    });
  }

  // File Upload
  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    return fetch(`${API_BASE_URL}/upload/photo`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }

  async deletePhoto(filename: string) {
    return this.request(`/upload/photo/${filename}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
