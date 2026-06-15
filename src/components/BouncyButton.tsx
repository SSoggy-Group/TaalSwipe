
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, createAnimatedComponent } from 'react-native-reanimated';
import * as Haptics from '../platform/haptics';

interface Props {
  readonly onPress: () => void;
  readonly title?: string;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly color?: string;
  readonly borderColor?: string;
  readonly bottomBorderColor?: string;
  readonly disabled?: boolean;
}
const AnimatedPressable = createAnimatedComponent(Pressable);

export const BouncyButton = React.memo(function BouncyButton({
  onPress,
  title,
  children,
  style,
  textStyle,
  color = '#58CC02',
  borderColor = '#58CC02',
  bottomBorderColor = '#46A302',
  disabled = false,
}: Props) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.88, { damping: 10, stiffness: 400 });
    translateY.value = withSpring(8, { damping: 10, stiffness: 400 }); // More squash down effect
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Stronger haptic
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 10, stiffness: 400 }); // Faster, more bouncy return
    translateY.value = withSpring(0, { damping: 10, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const dynamicStyles = {
    backgroundColor: disabled ? '#E2E8F0' : color,
    borderColor: disabled ? '#CBD5E1' : borderColor,
    borderBottomColor: disabled ? '#94A3B8' : bottomBorderColor,
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, dynamicStyles, style, animatedStyle]}
      accessible={true}
      focusable={false}
      accessibilityRole="button"
      accessibilityLabel={title || 'Knop'}
    >
      {/* Shine overlay for bubbly look */}
      <View style={styles.shine} />
      
      {title ? (
        <Text 
          style={[styles.text, textStyle, disabled && { color: '#64748B' }]}
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
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // to keep shine inside
  },
  shine: {
    position: 'absolute',
    top: 4,
    left: '10%',
    right: '10%',
    height: '25%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  text: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
