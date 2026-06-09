import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  isSoundEnabled: boolean;
  hardcoreMode: boolean;
  survivalMode: boolean;
  themePreference: ThemePreference;
  equippedBackground: string;
  equippedCard: string;
  toggleSound: () => void;
  toggleHardcoreMode: () => void;
  toggleSurvivalMode: () => void;
  setThemePreference: (pref: ThemePreference) => void;
  setEquippedBackground: (bg: string) => void;
  setEquippedCard: (card: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      hardcoreMode: false,
      survivalMode: false,
      themePreference: 'system',
      equippedBackground: 'bg_ocean',
      equippedCard: 'card_default',
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      toggleHardcoreMode: () => set((state) => ({ hardcoreMode: !state.hardcoreMode })),
      toggleSurvivalMode: () => set((state) => ({ survivalMode: !state.survivalMode })),
      setThemePreference: (pref) => set({ themePreference: pref }),
      setEquippedBackground: (bg) => set({ equippedBackground: bg }),
      setEquippedCard: (card) => set({ equippedCard: card }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
