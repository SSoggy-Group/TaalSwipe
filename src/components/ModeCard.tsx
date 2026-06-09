import React from 'react';
import { StyleSheet, Text, View, Pressable, ViewStyle } from 'react-native';
import { Colors, useAppTheme } from '../theme/colors';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Props {
  emoji: string;
  title: string;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
  delay?: number;
  color?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ModeCard = React.memo(function ModeCard({ emoji, title, description, onPress, style, delay = 0, color = Colors.accent }: Props) {
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
    <Animated.View entering={FadeInUp.delay(delay).duration(600).springify()}>
      <AnimatedPressable 
        style={[
          styles.card, 
          style, 
          animatedStyle,
          { backgroundColor: theme.glass.background, borderColor: theme.glass.border }
        ]} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
      >
        <View style={[styles.iconContainer, { backgroundColor: color, borderBottomColor: 'rgba(0,0,0,0.2)' }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.cardTextPrimary }]}>{title}</Text>
          <Text style={[styles.description, { color: theme.cardTextSecondary }]}>{description}</Text>
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
  emoji: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontFamily: 'Inter_400Regular',
    fontSize: 32,
    marginLeft: 8,
  },
});
