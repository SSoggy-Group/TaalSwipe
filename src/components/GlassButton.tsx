import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from '../platform/haptics';
import { useAppTheme } from '../theme/colors';
import { useColorScheme } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassButtonProps {
  readonly title: string;
  readonly emoji?: string;
  readonly onPress: () => void;
  readonly style?: ViewStyle;
}

export function GlassButton({ title, emoji, onPress, style }: GlassButtonProps) {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      focusable={false}
      style={[styles.pressable, style, animatedStyle, { shadowColor: theme.cardTextPrimary }]}
    >
      <BlurView 
        intensity={isDark ? 30 : 50} 
        tint={isDark ? "dark" : "light"} 
        style={[
          styles.blur, 
          { 
            backgroundColor: theme.glass.background,
            borderColor: theme.glass.border,
            borderBottomColor: theme.glass.highlight,
          }
        ]}
      >
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={[styles.title, { color: theme.cardTextPrimary }]}>{title}</Text>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 22,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  blur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRadius: 22,
    gap: 12,
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 26,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
