'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService';

export function useAuth() {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = async (data: LoginPayload) => {
    const tokens = await authService.login(data);
    localStorage.setItem('access_token', tokens.access_token);
    setAuth({ id: '', email: data.email, display_name: '' }, tokens.access_token);
    router.push('/chat');
  };

  const register = async (data: RegisterPayload) => {
    const created = await authService.register(data);
    router.push('/login');
    return created;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    clearAuth();
    router.push('/login');
  };

  return { user, isAuthenticated: !!accessToken, login, register, logout };
}
