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
      const response = await api.get('/profile/me');
      
      const userData = response.data?.user || response.data;
      // console.log('user data', userData);
      if (userData && userData.id) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Sync cookies for middleware
        const token = localStorage.getItem('token');
        if (token) {
          document.cookie = `auth_token=${token}; path=/; max-age=86400`;
        }
        document.cookie = `user_role=${userData.role || 'user'}; path=/; max-age=86400`;
      }
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('token');
      }
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }

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
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
