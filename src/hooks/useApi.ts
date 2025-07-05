
import { useState, useEffect } from 'react';
import { apiService, ApiResponse } from '../services/apiService';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}

// Hook khusus untuk users
export function useUsers(filters?: { role?: string; rombel?: string }) {
  return useApi(() => apiService.getUsers(filters), [filters]);
}

// Hook khusus untuk kelas
export function useKelas() {
  return useApi(() => apiService.getKelas(), []);
}

// Hook khusus untuk rombel
export function useRombel(filters?: { kelas?: string }) {
  return useApi(() => apiService.getRombel(filters), [filters]);
}

// Hook khusus untuk point history
export function usePointHistory(filters?: { siswaId?: string; guruId?: string; limit?: number }) {
  return useApi(() => apiService.getPointHistory(filters), [filters]);
}
