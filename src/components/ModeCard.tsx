import React from 'react';
import { StyleProp, StyleSheet, Text, View, Pressable, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/colors';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from '../platform/haptics';

interface Props {
  emoji: string;
  title: string;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
  wrapperStyle?: StyleProp<ViewStyle>;
  delay?: number;
  color?: string;
  compact?: boolean;
  isSelected?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ModeCard = React.memo(function ModeCard({ emoji, title, description, onPress, style, wrapperStyle, delay = 0, color, compact = false, isSelected = false }: Props) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const cardColor = color || theme.accent;

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 12, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500).springify()} style={wrapperStyle}>
      <AnimatedPressable 
        style={[
          styles.card, 
          compact && styles.compactCard,
          { 
            backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : theme.glass.background, 
            borderColor: isSelected ? '#38BDF8' : theme.glass.border,
            borderBottomColor: isSelected ? '#38BDF8' : theme.glass.highlight,
            shadowColor: theme.cardTextPrimary,
          },
          style, 
          animatedStyle,
          compact && styles.desktopCardSurface,
        ]} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessible={true}
        focusable={false}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
        // @ts-ignore
        className="mode-card"
      >
        <View style={[styles.iconContainer, compact && styles.compactIconContainer, { backgroundColor: cardColor, borderBottomColor: 'rgba(0,0,0,0.15)' }]}>
          <Text style={[styles.emoji, compact && styles.compactEmoji]}>{emoji}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, compact && styles.compactTitle, { color: theme.cardTextPrimary }]}>{title}</Text>
          <Text style={[styles.description, compact && styles.compactDescription, { color: theme.cardTextSecondary }]}>{description}</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  compactCard: {
    minHeight: 120,
    padding: 14,
    marginBottom: 0,
    borderRadius: 20,
    borderBottomWidth: 3,
  },
  desktopCardSurface: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderBottomWidth: 2,
  },
  compactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 12,
  },
  emoji: {
    fontSize: 28,
  },
  compactEmoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  compactTitle: {
    fontSize: 16,
  },
  description: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  compactDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
