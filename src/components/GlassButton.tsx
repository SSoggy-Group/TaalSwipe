import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';

interface GlassButtonProps {
  title: string;
  emoji?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function GlassButton({ title, emoji, onPress, style }: GlassButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        style,
      ]}
    >
      <BlurView intensity={30} tint="light" style={styles.blur}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={styles.title}>{title}</Text>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 8,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  blur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: 20,
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontFamily: 'Inter_700Bold', // Make it bolder for playfulness
    fontSize: 20,
    color: '#1E293B', // Dark slate instead of white
    letterSpacing: -0.3,
  },
});
