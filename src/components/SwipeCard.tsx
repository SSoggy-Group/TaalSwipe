import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, useAppTheme } from '../theme/colors';
import { soundManager } from '../audio/SoundManager';
import * as Haptics from '../platform/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '../store/settingsStore';

const SWIPE_THRESHOLD = 120;

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

interface SwipeCardProps {
  readonly children: React.ReactNode;
  readonly onSwipeLeft: () => void;
  readonly onSwipeRight: () => void;
  readonly active: boolean;
  readonly leftLabel?: string;
  readonly rightLabel?: string;
  readonly compact?: boolean;
  readonly combo?: number;
}

export const CardSkinWrapper = React.memo(function CardSkinWrapper({ children, equippedCard, theme, style, compact, combo }: { children: React.ReactNode, equippedCard: string, theme: any, style?: any, compact?: boolean, combo?: number }) {
  if (equippedCard === 'card_rainbow') {
    return (
      <LinearGradient
        colors={['#FF0055', '#7A00FF', '#00E5FF', '#FF0055']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius: 24, borderWidth: 0, padding: 3, paddingBottom: 9, minHeight: compact ? 180 : 300, width: '100%' }, style]}
      >
        <View style={{ flex: 1, backgroundColor: theme.glass.background, borderRadius: 21, overflow: 'hidden' }}>
          {children}
        </View>
      </LinearGradient>
    );
  }

const CARD_SKIN_STYLES: Record<string, (theme: any) => any> = {
  card_gold: (theme) => ({
    backgroundColor: theme.glass.background,
    borderColor: '#CA8A04',
    borderBottomColor: '#854D0E',
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
  }),
  card_neon: () => ({
    backgroundColor: '#0B0F19',
    borderColor: '#06B6D4',
    borderBottomColor: '#0891B2',
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  }),
  card_retro: (theme) => ({
    backgroundColor: theme.glass.background,
    borderColor: '#000000',
    borderBottomColor: '#000000',
    borderRadius: 4,
    borderWidth: 4,
    borderBottomWidth: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  }),
  card_holo: () => ({
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: '#EC4899',
    borderBottomColor: '#BE185D',
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  }),
  card_shadow: () => ({
    backgroundColor: '#090D16',
    borderColor: '#E11D48',
    borderBottomColor: '#9F1239',
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  }),
  card_pastel: () => ({
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
    borderBottomColor: '#047857',
    borderRadius: 32,
    borderWidth: 2,
    borderBottomWidth: 6,
  }),
};

  const getCardStyle = () => {
    const styleGetter = CARD_SKIN_STYLES[equippedCard];
    if (styleGetter) {
      return styleGetter(theme);
    }
    const comboActive = typeof combo === 'number' && combo >= 3;
    return {
      backgroundColor: theme.glass.background,
      borderColor: comboActive ? '#FF9600' : theme.glass.border,
      borderBottomColor: comboActive ? '#CC7800' : theme.glass.highlight,
      borderRadius: 24,
      borderWidth: comboActive ? 4 : 2,
      borderBottomWidth: 8,
      shadowColor: comboActive ? '#FF9600' : undefined,
      shadowOffset: comboActive ? { width: 0, height: 0 } : undefined,
      shadowOpacity: comboActive ? 0.8 : undefined,
      shadowRadius: comboActive ? 16 : undefined,
      elevation: comboActive ? 12 : undefined,
    };
  };

  return (
    <View style={[getCardStyle(), { minHeight: compact ? 180 : 300, width: '100%' }, style]}>
      {children}
    </View>
  );
});

export const SwipeCard = React.memo(function SwipeCard({ children, onSwipeLeft, onSwipeRight, active, leftLabel = "FOUT ✗", rightLabel = "GOED ✓", compact, combo }: SwipeCardProps) {
  const theme = useAppTheme();
  const equippedCard = useSettingsStore((state) => state.equippedCard);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const playSwooshSound = () => {
    soundManager.playSwoosh();
  };

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
    Haptics.impactAsync(style);
  };

  const gesture = Gesture.Pan()
    .enabled(active)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.4; // Dampen vertical movement
    })
    .onEnd((event) => {
      const currentWidth = Dimensions.get('window').width;
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right
        translateX.value = withTiming(currentWidth * 1.5, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onSwipeRight)();
          }
        });
        translateY.value = withTiming(event.translationY * 0.8, { duration: 300 });
        runOnJS(playSwooshSound)();
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left
        translateX.value = withTiming(-currentWidth * 1.5, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onSwipeLeft)();
          }
        });
        translateY.value = withTiming(event.translationY * 0.8, { duration: 300 });
        runOnJS(playSwooshSound)();
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      } else {
        // Snap back
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const currentWidth = Dimensions.get('window').width;
    const rotate = interpolate(
      translateX.value,
      [-currentWidth, 0, currentWidth],
      [-15, 0, 15],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const goedOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const foutOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, cardStyle]} accessible={true} accessibilityRole="adjustable" accessibilityHint="Swipe links of rechts">
        <CardSkinWrapper equippedCard={equippedCard} theme={theme} compact={compact} combo={combo}>
          {/* Goed overlay */}
          <Animated.View style={[styles.overlay, styles.goedOverlay, goedOpacity]}>
            <Text style={styles.goedText} numberOfLines={1} adjustsFontSizeToFit>{rightLabel}</Text>
          </Animated.View>
          {/* Fout overlay */}
          <Animated.View style={[styles.overlay, styles.foutOverlay, foutOpacity]}>
            <Text style={styles.foutText} numberOfLines={1} adjustsFontSizeToFit>{leftLabel}</Text>
          </Animated.View>
          {/* Content */}
          <View style={[styles.content, compact && { minHeight: 160, padding: 16 }]}>
            {children}
          </View>
        </CardSkinWrapper>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 4,
  },
  card: {
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
    overflow: 'hidden',
    minHeight: 300,
  },
  content: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 6,
  },
  goedOverlay: {
    left: 30, // Goed stamp on the left (visible when swiping right)
    borderColor: Colors.correct,
    transform: [{ rotate: '-15deg' }],
  },
  foutOverlay: {
    right: 30, // Fout stamp on the right (visible when swiping left)
    borderColor: Colors.incorrect,
    transform: [{ rotate: '15deg' }],
  },
  goedText: {
    fontFamily: 'Inter_900Black',
    fontSize: 48,
    color: Colors.correct,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  foutText: {
    fontFamily: 'Inter_900Black',
    fontSize: 48,
    color: Colors.incorrect,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
