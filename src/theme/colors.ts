import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

/**
 * TaalSwipe design tokens.
 *
 * The app uses one restrained accent (Delft blue), warm paper surfaces and
 * hairline borders. Everything else is ink on paper. Cosmetics bought in the
 * shop change the paper tint or the card border, never the layout language.
 */

type Pair = { light: string; dark: string };

const PAPER: Pair = { light: '#F6F4EF', dark: '#0F1012' };
const PAPER_TINT: Pair = { light: '#F1EEE7', dark: '#141519' };

const BACKGROUND_TINTS: Record<string, { light: [string, string]; dark: [string, string] }> = {
  bg_default: { light: ['#F6F4EF', '#F1EEE7'], dark: ['#0F1012', '#141519'] },
  bg_ocean: { light: ['#EEF2F4', '#E7EDF0'], dark: ['#0E1214', '#131A1F'] },
  bg_neon: { light: ['#F3F0F4', '#ECE8F1'], dark: ['#121016', '#19141F'] },
  bg_sunset: { light: ['#F8F1EA', '#F3E9DF'], dark: ['#14110F', '#1D1611'] },
  bg_forest: { light: ['#EFF3ED', '#E7EDE4'], dark: ['#0E120F', '#141B15'] },
  bg_aurora: { light: ['#EDF3F1', '#E4EDEA'], dark: ['#0D1211', '#121C1A'] },
  bg_matrix: { light: ['#EFF3EF', '#E5ECE5'], dark: ['#0E120E', '#131B14'] },
  bg_candy: { light: ['#F8F0F1', '#F2E6E8'], dark: ['#140F11', '#1D1418'] },
  bg_volcano: { light: ['#F6EFEB', '#F0E4DD'], dark: ['#130F0D', '#1D1512'] },
  bg_royal: { light: ['#F1F1F5', '#E9E9F0'], dark: ['#0F1015', '#16182A'] },
  bg_nebula: { light: ['#F2F0F5', '#E9E6EF'], dark: ['#100F14', '#17141F'] },
  bg_lava: { light: ['#F7EFEC', '#F1E3DC'], dark: ['#140F0D', '#1F1612'] },
  bg_cherry: { light: ['#F8EFF1', '#F2E4E8'], dark: ['#140F11', '#1E1418'] },
  bg_arctic: { light: ['#EFF3F6', '#E6EDF2'], dark: ['#0E1114', '#141C22'] },
  bg_deep_sea: { light: ['#EDF1F4', '#E3EAEF'], dark: ['#0D1114', '#121B21'] },
};

type CardSkin = {
  background: string;
  border: string;
  text: string;
  textSecondary: string;
};

const DEFAULT_CARD: { light: CardSkin; dark: CardSkin } = {
  light: { background: '#FFFFFF', border: '#E1DCD1', text: '#16181D', textSecondary: '#5B5F66' },
  dark: { background: '#17181B', border: '#2B2D32', text: '#F1EFE9', textSecondary: '#A2A6AD' },
};

const CARD_SKINS: Record<string, { light: CardSkin; dark: CardSkin }> = {
  card_gold: {
    light: { background: '#FBF6EA', border: '#D8C08C', text: '#43340F', textSecondary: '#7A652F' },
    dark: { background: '#1D190F', border: '#5C4A22', text: '#F0E3C2', textSecondary: '#B9A472' },
  },
  card_neon: {
    light: { background: '#EDF4F6', border: '#9FC7D4', text: '#123642', textSecondary: '#476A76' },
    dark: { background: '#0F1719', border: '#2E4E58', text: '#DCEEF3', textSecondary: '#8FB4BF' },
  },
  card_retro: {
    light: { background: '#F4F1E8', border: '#B9B2A0', text: '#2B2A26', textSecondary: '#63604F' },
    dark: { background: '#15140F', border: '#3C3A2E', text: '#EDE8D6', textSecondary: '#A5A08A' },
  },
  card_holo: {
    light: { background: '#F5F1F7', border: '#C9B6D8', text: '#3A2745', textSecondary: '#715A80' },
    dark: { background: '#151018', border: '#463251', text: '#E9DDF0', textSecondary: '#AE9BBB' },
  },
  card_rainbow: {
    light: { background: '#FBFAF7', border: '#C9C2B3', text: '#16181D', textSecondary: '#5B5F66' },
    dark: { background: '#16171A', border: '#3A3B40', text: '#F1EFE9', textSecondary: '#A2A6AD' },
  },
  card_shadow: {
    light: { background: '#1A1C22', border: '#2E323C', text: '#F2F1ED', textSecondary: '#ABAEB6' },
    dark: { background: '#0A0B0D', border: '#23252B', text: '#F2F1ED', textSecondary: '#9EA1A9' },
  },
  card_pastel: {
    light: { background: '#EFF5EF', border: '#BFD6C4', text: '#1F3A2A', textSecondary: '#54705E' },
    dark: { background: '#101711', border: '#2C4533', text: '#DDEDE0', textSecondary: '#94AE9B' },
  },
  card_flame: {
    light: { background: '#FBF0EB', border: '#DDB19C', text: '#4A2517', textSecondary: '#82543F' },
    dark: { background: '#1B1210', border: '#533227', text: '#F3DFD6', textSecondary: '#B98D7A' },
  },
  card_ice: {
    light: { background: '#EFF4F8', border: '#B9CEDC', text: '#17313F', textSecondary: '#4C6A7A' },
    dark: { background: '#0E1418', border: '#2C3F4A', text: '#DCEAF2', textSecondary: '#93ACBA' },
  },
};

export const RADIUS = {
  card: 14,
  control: 10,
  chip: 8,
  pill: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const FONT = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const getColors = (isDark: boolean, bgId?: string, cardId?: string, _gameMode?: string) => {
  const tint = BACKGROUND_TINTS[bgId || 'bg_default'] ?? BACKGROUND_TINTS.bg_default;
  const backgroundColors = isDark ? tint.dark : tint.light;
  const skin = (cardId && CARD_SKINS[cardId]) || DEFAULT_CARD;
  const card = isDark ? skin.dark : skin.light;

  const surface = isDark ? '#17181B' : '#FFFFFF';
  const surfaceMuted = isDark ? '#1D1F23' : '#EFEDE6';
  const border = isDark ? 'rgba(255,255,255,0.12)' : '#E1DCD1';
  const borderStrong = isDark ? 'rgba(255,255,255,0.22)' : '#CFC8B8';

  const ink = isDark ? '#F1EFE9' : '#16181D';
  const inkSecondary = isDark ? '#A2A6AD' : '#5B5F66';
  const inkMuted = isDark ? '#71757C' : '#8A8E95';

  const accent = isDark ? '#8FB4D9' : '#1F4E79';
  const accentSoft = isDark ? '#1B2733' : '#E7EEF4';
  const accentContrast = isDark ? '#0F1012' : '#FFFFFF';

  const correct = isDark ? '#7FBF9E' : '#2F7A57';
  const correctBg = isDark ? '#16251D' : '#E7F1EB';
  const incorrect = isDark ? '#E09A8E' : '#B04A3A';
  const incorrectBg = isDark ? '#2A1917' : '#F8E9E6';
  const warning = isDark ? '#D8B36A' : '#A97A24';
  const warningBg = isDark ? '#241D10' : '#F6EFDF';

  return {
    // New, preferred tokens
    isDark,
    background: backgroundColors[0],
    backgroundTint: backgroundColors[1],
    surface,
    surfaceMuted,
    border,
    borderStrong,
    ink,
    inkSecondary,
    inkMuted,
    accent,
    accentSoft,
    accentContrast,
    correct,
    correctBg,
    incorrect,
    incorrectBg,
    warning,
    warningBg,

    // Backwards-compatible tokens used across the app
    gradient: {
      layer1: { colors: backgroundColors, start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
      layer2: { colors: [backgroundColors[1], backgroundColors[0]], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    },
    glass: {
      background: surface,
      border,
      highlight: surfaceMuted,
    },
    textPrimary: ink,
    textSecondary: inkSecondary,
    textMuted: inkMuted,
    cardTextPrimary: card.text,
    cardTextSecondary: card.textSecondary,
    cardBackground: card.background,
    cardBorder: card.border,
    timerActive: correct,
    timerWarning: warning,
    timerDanger: incorrect,
    accentLight: accentSoft,
  };
};

/** Static light palette for places without a hook. */
export const Colors = getColors(false);

export function useAppTheme(gameMode?: string) {
  const systemTheme = useColorScheme();
  const themePreference = useSettingsStore((state) => state.themePreference);
  const equippedBackground = useSettingsStore((state) => state.equippedBackground);
  const equippedCard = useSettingsStore((state) => state.equippedCard);

  let isDarkMode = systemTheme === 'dark';
  if (themePreference === 'dark') {
    isDarkMode = true;
  } else if (themePreference === 'light') {
    isDarkMode = false;
  }

  // Keep the theme object stable between renders; otherwise every state update
  // recreates the palette and forces all memoised children to re-render.
  return useMemo(
    () => getColors(isDarkMode, equippedBackground, equippedCard, gameMode),
    [isDarkMode, equippedBackground, equippedCard, gameMode],
  );
}
