import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors, useAppTheme } from '../theme/colors';
import { soundManager } from '../audio/SoundManager';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '../store/settingsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  active: boolean;
}

export function CardSkinWrapper({ children, equippedCard, theme, style }: { children: React.ReactNode, equippedCard: string, theme: any, style?: any }) {
  if (equippedCard === 'card_rainbow') {
    return (
      <LinearGradient
        colors={['#FF0055', '#7A00FF', '#00E5FF', '#FF0055']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius: 24, borderWidth: 0, padding: 3, paddingBottom: 9, minHeight: 300, width: '100%' }, style]}
      >
        <View style={{ flex: 1, backgroundColor: theme.glass.background, borderRadius: 21, overflow: 'hidden' }}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  const getCardStyle = () => {
    switch (equippedCard) {
      case 'card_gold':
        return {
          backgroundColor: theme.glass.background,
          borderColor: '#CA8A04',
          borderBottomColor: '#854D0E',
          borderRadius: 24,
          borderWidth: 2,
          borderBottomWidth: 8,
        };
      case 'card_neon':
        return {
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
        };
      case 'card_retro':
        return {
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
        };
      case 'card_holo':
        return {
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
        };
      case 'card_shadow':
        return {
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
        };
      case 'card_pastel':
        return {
          backgroundColor: '#ECFDF5',
          borderColor: '#34D399',
          borderBottomColor: '#047857',
          borderRadius: 32,
          borderWidth: 2,
          borderBottomWidth: 6,
        };
      default:
        return {
          backgroundColor: theme.glass.background,
          borderColor: theme.glass.border,
          borderBottomColor: theme.glass.highlight,
          borderRadius: 24,
          borderWidth: 2,
          borderBottomWidth: 8,
        };
    }
  };

  return (
    <View style={[getCardStyle(), { minHeight: 300, width: '100%' }, style]}>
      {children}
    </View>
  );
}

export function SwipeCard({ children, onSwipeLeft, onSwipeRight, active }: SwipeCardProps) {
  const theme = useAppTheme();
  const equippedCard = useSettingsStore((state) => state.equippedCard);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const playSwooshSound = () => soundManager.playSwoosh();

  const gesture = Gesture.Pan()
    .enabled(active)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.4; // Dampen vertical movement
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeRight)();
        });
        translateY.value = withTiming(event.translationY * 0.8, { duration: 300 });
        runOnJS(playSwooshSound)();
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)();
        });
        translateY.value = withTiming(event.translationY * 0.8, { duration: 300 });
        runOnJS(playSwooshSound)();
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else {
        // Snap back
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
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
      <Animated.View style={[styles.cardContainer, cardStyle]}>
        <CardSkinWrapper equippedCard={equippedCard} theme={theme}>
          {/* Goed overlay */}
          <Animated.View style={[styles.overlay, styles.goedOverlay, goedOpacity]}>
            <Text style={styles.goedText}>GOED ✓</Text>
          </Animated.View>
          {/* Fout overlay */}
          <Animated.View style={[styles.overlay, styles.foutOverlay, foutOpacity]}>
            <Text style={styles.foutText}>FOUT ✗</Text>
          </Animated.View>
          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
        </CardSkinWrapper>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
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
