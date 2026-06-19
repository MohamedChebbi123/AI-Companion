'use client';
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { settingsService } from '@/services/settingsService';
import { Button } from '@/components/ui';
import type { UserSettings } from '@/services/settingsService';

export function SettingsPanel() {
  const { settings, setSettings } = useSettingsStore();

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(() => {});
  }, [setSettings]);

  const save = () => settingsService.updateSettings(settings).catch(() => {});

  return (
    <div className="max-w-lg w-full flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <label className="flex items-center justify-between">
        <span className="text-sm font-medium">Voice enabled</span>
        <input
          type="checkbox"
          checked={settings.voice_enabled}
          onChange={(e) => setSettings({ voice_enabled: e.target.checked })}
          className="w-5 h-5 accent-indigo-600"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Theme</span>
        <select
          value={settings.theme}
          onChange={(e) =>
            setSettings({ theme: e.target.value as UserSettings['theme'] })
          }
          className="border border-zinc-300 rounded-lg px-3 py-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 text-sm"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <Button onClick={save}>Save changes</Button>
    </div>
  );
}
