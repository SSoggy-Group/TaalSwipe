
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Props {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  color?: string;
  borderColor?: string;
  bottomBorderColor?: string;
  disabled?: boolean;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BouncyButton({
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
    scale.value = withSpring(0.96, { damping: 12, stiffness: 300 });
    translateY.value = withSpring(4, { damping: 12, stiffness: 300 }); // squash down effect
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 300 });
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
      onPress={!disabled ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, dynamicStyles, style, animatedStyle]}
    >
      {/* Shine overlay for bubbly look */}
      <View style={styles.shine} />
      
      {title ? (
        <Text style={[styles.text, textStyle, disabled && { color: '#64748B' }]}>{title}</Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

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
