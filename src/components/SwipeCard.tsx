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
import { Colors } from '../theme/colors';

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

export function SwipeCard({ children, onSwipeLeft, onSwipeRight, active }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)();
        });
        translateY.value = withTiming(event.translationY * 0.8, { duration: 300 });
      } else {
        // Snap back
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
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
        <BlurView intensity={40} tint="light" style={styles.card}>
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
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    borderRadius: 24,
    overflow: 'hidden',
    // Glassmorphism shadow
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    backgroundColor: Colors.glass.background,
    overflow: 'hidden',
    minHeight: 280,
  },
  content: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  overlay: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  goedOverlay: {
    right: 20,
    borderColor: Colors.correct,
    backgroundColor: Colors.correctBg,
  },
  foutOverlay: {
    left: 20,
    borderColor: Colors.incorrect,
    backgroundColor: Colors.incorrectBg,
  },
  goedText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    color: Colors.correct,
    letterSpacing: 1,
  },
  foutText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    color: Colors.incorrect,
    letterSpacing: 1,
  },
});
