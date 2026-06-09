import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface ScoreBarProps {
  score: number;
  total: number;
  combo?: number;
  mode: string;
}

export function ScoreBar({ score, total, combo, mode }: ScoreBarProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = 1.3;
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.modeLabel}>{mode}</Text>
      </View>
      <View style={styles.center}>
        {combo !== undefined && combo > 1 && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>🔥 {combo}x</Text>
          </View>
        )}
      </View>
      <Animated.View style={[styles.right, animatedStyle]}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.divider}>/</Text>
        <Text style={styles.total}>{total}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  left: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
  modeLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  score: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  divider: {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: Colors.textMuted,
    marginHorizontal: 2,
  },
  total: {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: Colors.textSecondary,
  },
  comboBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  comboText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#FBBF24',
  },
});
