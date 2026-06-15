import React from 'react';
import { StyleProp, StyleSheet, Text, View, Pressable, ViewStyle } from 'react-native';
import { Colors, useAppTheme } from '../theme/colors';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring, createAnimatedComponent } from 'react-native-reanimated';
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

const AnimatedPressable = createAnimatedComponent(Pressable);

export const ModeCard = React.memo(function ModeCard({ emoji, title, description, onPress, style, wrapperStyle, delay = 0, color = Colors.accent, compact = false, isSelected = false }: Props) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600).springify()} style={wrapperStyle}>
      <AnimatedPressable 
        style={[
          styles.card, 
          compact && styles.compactCard,
          style, 
          animatedStyle,
          { backgroundColor: theme.glass.background, borderColor: theme.glass.border },
          compact && styles.desktopCardSurface,
          isSelected && styles.selectedCardSurface,
        ]} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessible={true}
        focusable={false}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
      >
        <View style={[styles.iconContainer, compact && styles.compactIconContainer, { backgroundColor: color, borderBottomColor: 'rgba(0,0,0,0.2)' }]}>
          <Text style={[styles.emoji, compact && styles.compactEmoji]}>{emoji}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, compact && styles.compactTitle, { color: compact ? '#FFFFFF' : theme.cardTextPrimary }]}>{title}</Text>
          <Text style={[styles.description, compact && styles.compactDescription, { color: compact ? 'rgba(255,255,255,0.68)' : theme.cardTextSecondary }]}>{description}</Text>
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
    marginBottom: 20,
    borderWidth: 2,
    borderBottomWidth: 8,
  },
  compactCard: {
    minHeight: 132,
    padding: 14,
    marginBottom: 0,
    borderRadius: 18,
    borderBottomWidth: 6,
  },
  desktopCardSurface: {
    backgroundColor: 'rgba(15, 23, 42, 0.56)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  selectedCardSurface: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  compactIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginRight: 12,
  },
  emoji: {
    fontSize: 32,
  },
  compactEmoji: {
    fontSize: 26,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 16,
  },
  description: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },
  compactDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  chevron: {
    fontFamily: 'Inter_400Regular',
    fontSize: 32,
    marginLeft: 8,
  },
});
