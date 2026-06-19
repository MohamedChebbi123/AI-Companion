import { api } from './apiClient';

export interface UserSettings {
  persona_id: string | null;
  voice_enabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export const settingsService = {
  getSettings:    ()                          => api.get<UserSettings>('/settings'),
  updateSettings: (data: Partial<UserSettings>) => api.put<UserSettings>('/settings', data),
};
