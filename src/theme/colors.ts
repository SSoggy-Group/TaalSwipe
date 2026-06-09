import { useColorScheme } from 'react-native';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getColors = (isDark: boolean, bgId?: string, cardId?: string) => {
  // 1. Default fallback styles
  let layer1Colors = isDark ? ['#0F172A', '#1E293B'] : ['#1CB0F6', '#0B99DF'];
  let layer2Colors = isDark ? ['#1E293B', '#0F172A'] : ['#38BDF8', '#1CB0F6'];
  let accent = '#A78BFA';
  let accentLight = '#C4B5FD';
  let textPrimary = '#FFFFFF';
  let textSecondary = 'rgba(255, 255, 255, 0.7)';
  let textMuted = 'rgba(255, 255, 255, 0.45)';

  // 2. Adjust based on equippedBackground
  if (bgId === 'bg_neon') {
    layer1Colors = ['#090514', '#1E1B4B']; // Dark violet-blue
    layer2Colors = ['#1E1B4B', '#090514'];
    accent = '#F472B6'; // Neon pink accent
    accentLight = '#FBCFE8';
  } else if (bgId === 'bg_sunset') {
    layer1Colors = ['#F97316', '#E11D48']; // Orange to Rose
    layer2Colors = ['#E11D48', '#EA580C'];
    accent = '#FDE047'; // Sunny yellow accent
    accentLight = '#FEF08A';
  } else if (bgId === 'bg_forest') {
    layer1Colors = ['#059669', '#064E3B']; // Emerald to deep forest
    layer2Colors = ['#047857', '#064E3B'];
    accent = '#34D399'; // Mint/bright green accent
    accentLight = '#A7F3D0';
  } else if (bgId === 'bg_aurora') {
    layer1Colors = ['#0F766E', '#3B0764']; // Aurora Teal to dark purple
    layer2Colors = ['#115E59', '#3B0764'];
    accent = '#2DD4BF'; // Bright teal accent
    accentLight = '#99F6E4';
  } else if (bgId === 'bg_matrix') {
    layer1Colors = ['#000000', '#022C22']; // Black to dark green
    layer2Colors = ['#022C22', '#000000'];
    accent = '#22C55E'; // Toxic green accent
    accentLight = '#86EFAC';
  } else if (bgId === 'bg_candy') {
    layer1Colors = ['#FBCFE8', '#BFDBFE']; // Pastel pink to sky blue
    layer2Colors = ['#BFDBFE', '#FDE047'];
    accent = '#EC4899'; // Deep pink accent
    accentLight = '#F472B6';
    textPrimary = '#1E293B'; // Dark text for pastel backgrounds!
    textSecondary = 'rgba(30, 41, 59, 0.7)';
    textMuted = 'rgba(30, 41, 59, 0.45)';
  } else if (bgId === 'bg_volcano') {
    layer1Colors = ['#18181B', '#991B1B']; // Charcoal to magma red
    layer2Colors = ['#991B1B', '#18181B'];
    accent = '#F97316'; // Lava orange accent
    accentLight = '#FDBA74';
  } else if (bgId === 'bg_royal') {
    layer1Colors = ['#2E1065', '#CA8A04']; // Purple to gold
    layer2Colors = ['#3B0764', '#854D0E'];
    accent = '#FDE047'; // Gold accent
    accentLight = '#FEF08A';
  } else if (bgId === 'bg_nebula') {
    layer1Colors = ['#1E3A8A', '#701A75']; // Cosmic blue to magenta
    layer2Colors = ['#701A75', '#1D4ED8'];
  }

  // 3. Card colors depend on cardId and background's dark/light nature
  let glassBackground = isDark ? '#1E293B' : '#FFFFFF';
  let glassBorder = isDark ? '#334155' : '#E2E8F0';
  let glassHighlight = isDark ? '#334155' : '#F8FAFC';
  
  let cardTextPrimary = isDark ? '#F8FAFC' : '#1E293B';
  let cardTextSecondary = isDark ? '#94A3B8' : '#64748B';

  // Overriding card theme colors
  if (cardId === 'card_gold') {
    glassBackground = isDark ? '#2D2203' : '#FFFDF5';
    glassBorder = '#CA8A04'; // Gold
    glassHighlight = isDark ? '#453508' : '#FEF9E7';
    cardTextPrimary = isDark ? '#FDE047' : '#854D0E';
    cardTextSecondary = isDark ? '#CA8A04' : '#A16207';
  } else if (cardId === 'card_neon') {
    glassBackground = '#0B0F19'; // Cyber slate
    glassBorder = '#06B6D4'; // Cyber cyan
    glassHighlight = '#1E293B';
    cardTextPrimary = '#FFFFFF';
    cardTextSecondary = '#38BDF8';
  } else if (cardId === 'card_retro') {
    glassBackground = isDark ? '#172554' : '#F0F9FF';
    glassBorder = '#000000'; // Retro pixel black
    glassHighlight = isDark ? '#1E3A8A' : '#E0F2FE';
    cardTextPrimary = isDark ? '#60A5FA' : '#1D4ED8';
    cardTextSecondary = isDark ? '#93C5FD' : '#2563EB';
  } else if (cardId === 'card_holo') {
    glassBackground = 'rgba(255, 255, 255, 0.85)';
    glassBorder = '#EC4899'; // Soft holographic purple/pink
    glassHighlight = '#FAE8FF';
    cardTextPrimary = '#4A044E';
    cardTextSecondary = '#86198F';
  } else if (cardId === 'card_rainbow') {
    glassBackground = isDark ? '#0F172A' : '#FFFFFF';
    glassBorder = '#3B82F6';
    glassHighlight = isDark ? '#1E293B' : '#F8FAFC';
    cardTextPrimary = isDark ? '#F8FAFC' : '#1E293B';
    cardTextSecondary = isDark ? '#94A3B8' : '#64748B';
  } else if (cardId === 'card_shadow') {
    glassBackground = '#090D16'; // Very dark black
    glassBorder = '#3F3F46'; // Slate dark gray
    glassHighlight = '#18181B';
    cardTextPrimary = '#F4F4F5'; // Off-white
    cardTextSecondary = '#A1A1AA';
  } else if (cardId === 'card_pastel') {
    glassBackground = '#ECFDF5'; // Minty fresh pastel
    glassBorder = '#34D399';
    glassHighlight = '#D1FAE5';
    cardTextPrimary = '#065F46';
    cardTextSecondary = '#047857';
  }

  return {
    gradient: {
      layer1: {
        colors: layer1Colors,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      },
      layer2: {
        colors: layer2Colors,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
    },
    glass: {
      background: glassBackground,
      border: glassBorder,
      highlight: glassHighlight,
    },
    correct: '#34D399',
    correctBg: 'rgba(52, 211, 153, 0.15)',
    incorrect: '#F87171',
    incorrectBg: 'rgba(248, 113, 113, 0.15)',
    textPrimary,
    textSecondary,
    textMuted,
    timerActive: '#34D399',
    timerWarning: '#FBBF24',
    timerDanger: '#F87171',
    accent,
    accentLight,
    cardTextPrimary,
    cardTextSecondary,
  };
};

// Default exported statically for non-hook places (like some older UI components, if any)
export const Colors = getColors(false);

import { useSettingsStore } from '../store/settingsStore';

export function useAppTheme() {
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
  
  return getColors(isDarkMode, equippedBackground, equippedCard);
}
