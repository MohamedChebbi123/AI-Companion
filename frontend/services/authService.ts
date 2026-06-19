import { api } from './apiClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
  locale: string;
  status: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  display_name: string;
}

export const authService = {
  login:    (data: LoginPayload)    => api.post<TokenResponse>('/auth/login', data),
  register: (data: RegisterPayload) => api.post<UserResponse>('/auth/register', data),
};
