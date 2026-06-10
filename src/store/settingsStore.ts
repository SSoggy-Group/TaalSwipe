import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  isSoundEnabled: boolean;
  hardcoreMode: boolean;
  survivalMode: boolean;
  speedrunMode: boolean;
  themePreference: ThemePreference;
  equippedBackground: string;
  equippedCard: string;
  incorrectSoundId: string;
  gameoverSoundId: string;
  swooshSoundId: string;
  toggleSound: () => void;
  toggleHardcoreMode: () => void;
  toggleSurvivalMode: () => void;
  toggleSpeedrunMode: () => void;
  setThemePreference: (pref: ThemePreference) => void;
  setEquippedBackground: (bg: string) => void;
  setEquippedCard: (card: string) => void;
  setIncorrectSoundId: (id: string) => void;
  setGameoverSoundId: (id: string) => void;
  setSwooshSoundId: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      hardcoreMode: false,
      survivalMode: false,
      speedrunMode: false,
      themePreference: 'system',
      equippedBackground: 'bg_ocean',
      equippedCard: 'card_default',
      incorrectSoundId: 'default',
      gameoverSoundId: 'default',
      swooshSoundId: 'default',
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      toggleHardcoreMode: () => set((state) => ({ hardcoreMode: !state.hardcoreMode })),
      toggleSurvivalMode: () => set((state) => ({ survivalMode: !state.survivalMode })),
      toggleSpeedrunMode: () => set((state) => ({ speedrunMode: !state.speedrunMode })),
      setThemePreference: (pref) => set({ themePreference: pref }),
      setEquippedBackground: (bg) => set({ equippedBackground: bg }),
      setEquippedCard: (card) => set({ equippedCard: card }),
      setIncorrectSoundId: (id) => set({ incorrectSoundId: id }),
      setGameoverSoundId: (id) => set({ gameoverSoundId: id }),
      setSwooshSoundId: (id) => set({ swooshSoundId: id }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
