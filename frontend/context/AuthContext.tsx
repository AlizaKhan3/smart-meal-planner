'use client';
import {
  createContext, useContext, useEffect, useState, ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refresh() {
    try {
      const { data } = await api.get<User>('/auth/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      refresh();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.accessToken);
    setUser(data.user);
    router.push('/profile');
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
