import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/axios';

export interface KycDetails {
  id: string;
  type: string;
  status: string;
}

export interface KycStatus {
  hasSubmittedKyc: boolean;
  hasCompletedKyc: boolean;
  status: string;
  verificationStatus: string;
  details?: KycDetails;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  kyc?: KycStatus;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile/me');
      
      setUser(response.data.user);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    setUser(null);
    router.push('/auth/login');
  };

  const hasSubmittedKyc = !!user?.kyc?.hasSubmittedKyc;
  const hasCompletedKyc = !!user?.kyc?.hasCompletedKyc;

  return { 
    user, 
    loading, 
    error, 
    refetch: fetchProfile, 
    logout,
    hasSubmittedKyc,
    hasCompletedKyc
  };
};
