import { useColorScheme } from 'react-native';

export const getColors = (isDark: boolean, bgId?: string, cardId?: string, gameMode?: string) => {
  // 1. Default fallback styles - richer, deeper gradient
  let layer1Colors = isDark ? ['#0F172A', '#1E1B4B'] : ['#2563EB', '#1E3A8A'];
  let layer2Colors = isDark ? ['#1E1B4B', '#020617'] : ['#3B82F6', '#1E40AF'];
  let accent = '#A78BFA';
  let accentLight = '#C4B5FD';
  let textPrimary = '#FFFFFF';
  let textSecondary = 'rgba(255, 255, 255, 0.75)';
  let textMuted = 'rgba(255, 255, 255, 0.5)';

  // 2. Adjust based on equippedBackground or gameMode
  if (bgId && bgId !== 'bg_default') {
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
      textSecondary = 'rgba(30, 41, 59, 0.75)';
      textMuted = 'rgba(30, 41, 59, 0.5)';
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
  } else if (gameMode) {
    if (gameMode === 'straattaal') {
      layer1Colors = isDark ? ['#2E1065', '#1E1B4B'] : ['#8B5CF6', '#7C3AED']; 
      layer2Colors = isDark ? ['#1E1B4B', '#2E1065'] : ['#A78BFA', '#8B5CF6'];
    } else if (gameMode === 'dunglish') {
      layer1Colors = isDark ? ['#831843', '#4C0519'] : ['#EC4899', '#DB2777'];
      layer2Colors = isDark ? ['#4C0519', '#831843'] : ['#F472B6', '#EC4899'];
    } else if (gameMode === 'spelling') {
      layer1Colors = isDark ? ['#0C4A6E', '#082F49'] : ['#0EA5E9', '#0284C7'];
      layer2Colors = isDark ? ['#082F49', '#0C4A6E'] : ['#38BDF8', '#0EA5E9'];
    } else if (gameMode === 'dt') {
      layer1Colors = isDark ? ['#78350F', '#451A03'] : ['#F59E0B', '#D97706'];
      layer2Colors = isDark ? ['#451A03', '#78350F'] : ['#FBBF24', '#F59E0B'];
    } else if (gameMode === 'vandale') {
      layer1Colors = isDark ? ['#064E3B', '#022C22'] : ['#10B981', '#059669'];
      layer2Colors = isDark ? ['#022C22', '#064E3B'] : ['#34D399', '#10B981'];
    } else if (gameMode === 'brand') {
      layer1Colors = isDark ? ['#7F1D1D', '#450A0A'] : ['#EF4444', '#DC2626'];
      layer2Colors = isDark ? ['#450A0A', '#7F1D1D'] : ['#F87171', '#EF4444'];
    }
  }

  // 3. Card colors depend on cardId and background's dark/light nature
  // Enhance glassmorphism defaults to be cleaner
  let glassBackground = isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.25)';
  let glassBorder = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)';
  let glassHighlight = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.35)';
  
  let cardTextPrimary = isDark ? '#F8FAFC' : '#0F172A';
  let cardTextSecondary = isDark ? '#CBD5E1' : '#334155';

  // Overriding card theme colors
  if (cardId === 'card_gold') {
    glassBackground = isDark ? 'rgba(45, 34, 3, 0.6)' : 'rgba(255, 253, 245, 0.6)';
    glassBorder = 'rgba(202, 138, 4, 0.8)'; // Gold
    glassHighlight = isDark ? 'rgba(202, 138, 4, 0.2)' : 'rgba(254, 249, 231, 0.6)';
    cardTextPrimary = isDark ? '#FDE047' : '#854D0E';
    cardTextSecondary = isDark ? '#CA8A04' : '#A16207';
  } else if (cardId === 'card_neon') {
    glassBackground = 'rgba(11, 15, 25, 0.7)'; // Cyber slate
    glassBorder = 'rgba(6, 182, 212, 0.8)'; // Cyber cyan
    glassHighlight = 'rgba(6, 182, 212, 0.15)';
    cardTextPrimary = '#FFFFFF';
    cardTextSecondary = '#38BDF8';
  } else if (cardId === 'card_retro') {
    glassBackground = isDark ? 'rgba(23, 37, 84, 0.6)' : 'rgba(240, 249, 255, 0.6)';
    glassBorder = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.6)'; // Retro pixel black
    glassHighlight = isDark ? 'rgba(30, 58, 138, 0.5)' : 'rgba(224, 242, 254, 0.6)';
    cardTextPrimary = isDark ? '#60A5FA' : '#1D4ED8';
    cardTextSecondary = isDark ? '#93C5FD' : '#2563EB';
  } else if (cardId === 'card_holo') {
    glassBackground = 'rgba(255, 255, 255, 0.4)';
    glassBorder = 'rgba(236, 72, 153, 0.6)'; // Soft holographic purple/pink
    glassHighlight = 'rgba(250, 232, 255, 0.6)';
    cardTextPrimary = '#4A044E';
    cardTextSecondary = '#86198F';
  } else if (cardId === 'card_rainbow') {
    glassBackground = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.3)';
    glassBorder = 'rgba(59, 130, 246, 0.6)';
    glassHighlight = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)';
    cardTextPrimary = isDark ? '#F8FAFC' : '#1E293B';
    cardTextSecondary = isDark ? '#94A3B8' : '#64748B';
  } else if (cardId === 'card_shadow') {
    glassBackground = 'rgba(9, 13, 22, 0.7)'; // Very dark black
    glassBorder = 'rgba(63, 63, 70, 0.8)'; // Slate dark gray
    glassHighlight = 'rgba(255, 255, 255, 0.05)';
    cardTextPrimary = '#F4F4F5'; // Off-white
    cardTextSecondary = '#A1A1AA';
  } else if (cardId === 'card_pastel') {
    glassBackground = 'rgba(236, 253, 245, 0.6)'; // Minty fresh pastel
    glassBorder = 'rgba(52, 211, 153, 0.6)';
    glassHighlight = 'rgba(209, 250, 229, 0.6)';
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
  
  return getColors(isDarkMode, equippedBackground, equippedCard, gameMode);
}
