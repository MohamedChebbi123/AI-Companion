import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

let isRefreshing = false;
let waitQueue: Array<(token: string | null) => void> = [];

async function tryRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => waitQueue.push(resolve));
  }

  isRefreshing = true;
  const { refreshToken, user } = useAuthStore.getState();

  try {
    if (!refreshToken) return null;

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      useAuthStore.getState().clearAuth();
      waitQueue.forEach((cb) => cb(null));
      return null;
    }

    const data = await res.json() as { access_token: string };
    localStorage.setItem('access_token', data.access_token);
    useAuthStore.getState().setAuth(user!, data.access_token, refreshToken);
    waitQueue.forEach((cb) => cb(data.access_token));
    return data.access_token;
  } finally {
    isRefreshing = false;
    waitQueue = [];
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401 && !path.startsWith('/auth/')) {
    const newToken = await tryRefresh();
    if (newToken) {
      const retry = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...init.headers,
        },
      });
      if (!retry.ok) {
        const body = await retry.json().catch(() => ({})) as { detail?: string };
        throw new Error(body.detail ?? retry.statusText);
      }
      if (retry.status === 204) return undefined as T;
      return retry.json() as Promise<T>;
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { detail?: string };
    throw new Error(body.detail ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                  => request<T>(path),
  post:   <T>(path: string, data: unknown)   => request<T>(path, { method: 'POST',   body: JSON.stringify(data) }),
  put:    <T>(path: string, data: unknown)   => request<T>(path, { method: 'PUT',    body: JSON.stringify(data) }),
  delete: <T>(path: string)                  => request<T>(path, { method: 'DELETE' }),
};
