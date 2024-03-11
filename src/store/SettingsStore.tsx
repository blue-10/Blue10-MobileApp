import * as SecureStore from 'expo-secure-store';
import { type PropsWithChildren, useEffect } from 'react';
import { create } from 'zustand';

import { storeKeySettings } from '@/constants';

type SettingsType = {
  hasAskedForSavingToCameraRoll: boolean;
  saveToCameraRoll?: boolean;
};

type SettingsKeys = keyof SettingsType;

type SettingsStore = {
  settings: SettingsType;
  setSetting: (setting: SettingsKeys, value: unknown) => void;
  save: () => Promise<void>;
  load: () => Promise<void>;
  reset: () => Promise<void>;
};

const defaultSettings: SettingsType = {
  hasAskedForSavingToCameraRoll: false,
  saveToCameraRoll: false,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  load: async () => {
    const settingStr = await SecureStore.getItemAsync(storeKeySettings);
    if (settingStr !== null) {
      const parsedSettings = JSON.parse(settingStr);
      set({
        settings: {
          ...defaultSettings,
          ...parsedSettings,
        },
      });
    }
  },
  reset: async () => {
    set({ settings: defaultSettings });
    await SecureStore.deleteItemAsync(storeKeySettings);
  },
  save: async () => {
    await SecureStore.setItemAsync(storeKeySettings, JSON.stringify(get().settings));
  },
  setSetting: (setting: SettingsKeys, value: unknown) => {
    const oldSettings = get().settings;
    const settings = { ...oldSettings, [setting]: value };
    set({ settings });
    get().save(); // save after setting
  },
  settings: defaultSettings,
}));

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const loadSettings = useSettingsStore((state) => state.load);
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return children;
};
