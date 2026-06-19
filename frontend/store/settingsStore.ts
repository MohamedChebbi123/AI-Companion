import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/services/settingsService';

interface SettingsState {
  settings: UserSettings;
  setSettings: (s: Partial<UserSettings>) => void;
}

const defaults: UserSettings = {
  persona_id: null,
  voice_enabled: false,
  language: 'en',
  theme: 'system',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaults,
      setSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),
    }),
    { name: 'settings' }
  )
);
