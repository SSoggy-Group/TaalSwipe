import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useAppTheme, RADIUS } from '../theme/colors';
import { soundManager } from '../audio/SoundManager';
import * as Haptics from '../platform/haptics';
import { useSettingsStore } from '../store/settingsStore';

const SWIPE_THRESHOLD = 120;

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 260,
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

/**
 * The card is a sheet of paper with a hairline edge. Equipped card styles in
 * the shop swap the paper tone and border colour only.
 */
export const CardSkinWrapper = React.memo(function CardSkinWrapper({
  children,
  theme,
  style,
  compact,
}: {
  children: React.ReactNode;
  equippedCard?: string;
  theme: any;
  style?: any;
  compact?: boolean;
  combo?: number;
}) {
  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.cardBorder,
        },
        compact && styles.sheetCompact,
        style,
      ]}
    >
      {children}
    </View>
  );
});

export const SwipeCard = React.memo(function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  active,
  leftLabel = 'Onjuist',
  rightLabel = 'Juist',
  compact,
  combo,
}: SwipeCardProps) {
  const theme = useAppTheme();
  const equippedCard = useSettingsStore((state) => state.equippedCard);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const currentWidth = Dimensions.get('window').width;

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
      translateY.value = event.translationY * 0.4;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          currentWidth * 1.5,
          { duration: 220, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) {
              runOnJS(onSwipeRight)();
            }
          },
        );
        translateY.value = withTiming(event.translationY * 0.8, {
          duration: 220,
          easing: Easing.out(Easing.cubic),
        });
        runOnJS(playSwooshSound)();
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          -currentWidth * 1.5,
          { duration: 220, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) {
              runOnJS(onSwipeLeft)();
            }
          },
        );
        translateY.value = withTiming(event.translationY * 0.8, {
          duration: 220,
          easing: Easing.out(Easing.cubic),
        });
        runOnJS(playSwooshSound)();
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-currentWidth, 0, currentWidth],
      [-10, 0, 10],
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

  const rightOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const leftOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.cardContainer, cardStyle]}
        accessible
        accessibilityRole="adjustable"
        accessibilityHint="Swipe links of rechts"
        testID="swipe-card"
      >
        <CardSkinWrapper
          equippedCard={equippedCard}
          theme={theme}
          compact={compact}
          combo={combo}
        >
          <Animated.View
            style={[
              styles.stamp,
              styles.stampRight,
              { borderColor: theme.correct, backgroundColor: theme.correctBg },
              rightOpacity,
            ]}
          >
            <Text style={[styles.stampText, { color: theme.correct }]} numberOfLines={1}>
              {rightLabel}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.stamp,
              styles.stampLeft,
              { borderColor: theme.incorrect, backgroundColor: theme.incorrectBg },
              leftOpacity,
            ]}
          >
            <Text style={[styles.stampText, { color: theme.incorrect }]} numberOfLines={1}>
              {leftLabel}
            </Text>
          </Animated.View>

          <View style={[styles.content, compact && styles.contentCompact]}>{children}</View>
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
    borderRadius: RADIUS.card + 2,
  },
  sheet: {
    minHeight: 300,
    width: '100%',
    borderRadius: RADIUS.card + 2,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  sheetCompact: {
    minHeight: 180,
  },
  content: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  contentCompact: {
    minHeight: 160,
    padding: 18,
  },
  stamp: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.chip,
    borderWidth: 1,
    maxWidth: '55%',
  },
  stampRight: {
    left: 20,
    transform: [{ rotate: '-4deg' }],
  },
  stampLeft: {
    right: 20,
    transform: [{ rotate: '4deg' }],
  },
  stampText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
