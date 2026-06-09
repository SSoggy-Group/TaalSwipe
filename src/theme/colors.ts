import { useColorScheme } from 'react-native';

export const getColors = (isDark: boolean) => ({
  gradient: {
    layer1: {
      colors: isDark ? ['#0F172A', '#1E293B'] : ['#1CB0F6', '#0B99DF'], // Deep Midnight Blue vs Ocean Blue
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    layer2: {
      colors: isDark ? ['#1E293B', '#0F172A'] : ['#38BDF8', '#1CB0F6'], // Subtle inverse for breathing
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  glass: {
    background: isDark ? '#1E293B' : '#FFFFFF',
    border: isDark ? '#334155' : '#E2E8F0',
    highlight: isDark ? '#334155' : '#F8FAFC',
  },
  correct: '#34D399',
  correctBg: 'rgba(52, 211, 153, 0.15)',
  incorrect: '#F87171',
  incorrectBg: 'rgba(248, 113, 113, 0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  timerActive: '#34D399',
  timerWarning: '#FBBF24',
  timerDanger: '#F87171',
  accent: '#A78BFA',
  accentLight: '#C4B5FD',
  cardTextPrimary: isDark ? '#F8FAFC' : '#1E293B',
  cardTextSecondary: isDark ? '#94A3B8' : '#64748B',
});

// Default exported statically for non-hook places (like some older UI components, if any)
export const Colors = getColors(false);

import { useSettingsStore } from '../store/settingsStore';

export function useAppTheme() {
  const systemTheme = useColorScheme();
  const themePreference = useSettingsStore((state) => state.themePreference);
  
  let isDarkMode = systemTheme === 'dark';
  if (themePreference === 'dark') {
    isDarkMode = true;
  } else if (themePreference === 'light') {
    isDarkMode = false;
  }
  
  return getColors(isDarkMode);
}
