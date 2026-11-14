import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, createAnimatedComponent } from 'react-native-reanimated';
import * as Haptics from '../platform/haptics';
import { useAppTheme, RADIUS } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'quiet' | 'danger';

interface Props {
  readonly onPress: () => void;
  readonly title?: string;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
  /** Optional fill override. Defaults to the theme accent. */
  readonly color?: string;
  /** Kept for API compatibility; flat buttons have no bottom edge. */
  readonly borderColor?: string;
  /** Kept for API compatibility; flat buttons have no bottom edge. */
  readonly bottomBorderColor?: string;
  readonly disabled?: boolean;
  readonly variant?: Variant;
  readonly accessibilityLabel?: string;
}

const AnimatedPressable = createAnimatedComponent(Pressable);

function readableOn(hex: string): string {
  const value = hex.replace('#', '');
  if (value.length !== 6) return '#FFFFFF';
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#16181D' : '#FFFFFF';
}

export const BouncyButton = React.memo(function BouncyButton({
  onPress,
  title,
  children,
  style,
  textStyle,
  color,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
}: Props) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withTiming(0.985, { duration: 90 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withTiming(1, { duration: 140 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fill = color || (variant === 'danger' ? theme.incorrect : theme.accent);
  const isFilled = variant === 'primary' || variant === 'danger' || Boolean(color);

  let backgroundColor: string = 'transparent';
  let borderColor: string = 'transparent';
  let labelColor: string = theme.ink;

  if (isFilled) {
    backgroundColor = disabled ? theme.surfaceMuted : fill;
    borderColor = backgroundColor;
    labelColor = disabled ? theme.inkSecondary : readableOn(fill);
  } else if (variant === 'secondary') {
    borderColor = theme.borderStrong;
    labelColor = theme.ink;
  } else {
    labelColor = theme.inkSecondary;
  }

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.72 : 1 },
        style,
        animatedStyle,
      ]}
      accessible
      focusable={false}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title || 'Knop'}
      testID="bouncy-button"
    >
      {title ? (
        <Text
          style={[styles.text, { color: labelColor }, textStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.control,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
