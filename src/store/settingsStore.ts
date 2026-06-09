import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  isSoundEnabled: boolean;
  hardcoreMode: boolean;
  themePreference: ThemePreference;
  toggleSound: () => void;
  toggleHardcoreMode: () => void;
  setThemePreference: (pref: ThemePreference) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      hardcoreMode: false,
      themePreference: 'system',
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      toggleHardcoreMode: () => set((state) => ({ hardcoreMode: !state.hardcoreMode })),
      setThemePreference: (pref) => set({ themePreference: pref }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
