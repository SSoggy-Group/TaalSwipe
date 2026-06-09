export const Colors = {
  // NOTE: gradient colors use 'as const' to satisfy expo-linear-gradient tuple types
  // Gradient layers for the mesh-style background
  gradient: {
    layer1: {
      colors: ['#1a0533', '#2d1b69', '#4c1d95'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    layer2: {
      colors: ['rgba(6, 182, 212, 0.45)', 'rgba(6, 182, 212, 0.0)'],
      start: { x: 0, y: 0.3 },
      end: { x: 1, y: 0.8 },
    },
    layer3: {
      colors: ['rgba(236, 72, 153, 0.35)', 'rgba(236, 72, 153, 0.0)'],
      start: { x: 1, y: 0 },
      end: { x: 0, y: 1 },
    },
  },

  // Glass card styling
  glass: {
    background: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.25)',
    highlight: 'rgba(255, 255, 255, 0.08)',
  },

  // Semantic
  correct: '#34D399',    // Emerald-400
  correctBg: 'rgba(52, 211, 153, 0.15)',
  incorrect: '#F87171',  // Red-400
  incorrectBg: 'rgba(248, 113, 113, 0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',

  // Timer
  timerActive: '#34D399',
  timerWarning: '#FBBF24',
  timerDanger: '#F87171',

  // Accents
  accent: '#A78BFA',     // Violet-400
  accentLight: '#C4B5FD',
};
