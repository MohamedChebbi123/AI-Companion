const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
  locale: "en" | "fr" | "ar";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  display_name: string;
}

function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(err.detail ?? "Registration failed");
  }

  return res.json();
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail ?? "Login failed");
  }

  const tokens: AuthTokens = await res.json();
  saveTokens(tokens);
  return tokens;
}

export async function logout(): Promise<void> {
  const refresh_token = getRefreshToken();
  if (refresh_token) {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    }).catch(() => {});
  }
  clearTokens();
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }
}

export async function resetPassword(password: string, password_refresh_token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, password_refresh_token }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Reset failed" }));
    throw new Error(err.detail ?? "Reset failed");
  }
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  status: string;
}

export async function getProfile(): Promise<UserProfile> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  let res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    const tokens = await refreshTokens();
    res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
  }

  if (!res.ok) {
    clearTokens();
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

let _refreshPromise: Promise<AuthTokens> | null = null;

export async function refreshTokens(): Promise<AuthTokens> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) throw new Error("No refresh token");

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
      clearTokens();
      throw new Error("Session expired");
    }

    const tokens: AuthTokens = await res.json();
    saveTokens(tokens);
    return tokens;
  })().finally(() => {
    _refreshPromise = null;
  });

  return _refreshPromise;
}
