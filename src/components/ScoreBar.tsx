import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useAppTheme, RADIUS } from '../theme/colors';

interface ScoreBarProps {
  readonly score: number;
  readonly currentIndex: number;
  readonly maxTotal: number;
  readonly combo?: number;
  readonly mode: string;
}

export function ScoreBar({ score, currentIndex, maxTotal, combo, mode }: ScoreBarProps) {
  const theme = useAppTheme();
  const progressPercent = maxTotal > 0 ? Math.min(1, currentIndex / maxTotal) : 0;

  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withTiming(progressPercent * 100, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [progressPercent]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.modeLabel, { color: theme.inkMuted }]} numberOfLines={1}>
          {mode}
        </Text>
        <Text style={[styles.scoreLabel, { color: theme.ink }]}>
          {score}
          <Text style={{ color: theme.inkMuted }}> / {maxTotal}</Text>
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: theme.accent }, animatedProgressStyle]}
        />
      </View>

      <View style={styles.comboContainer}>
        {combo !== undefined && combo > 1 ? (
          <Text style={[styles.comboText, { color: theme.inkSecondary }]}>
            {combo} op rij
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 12,
  },
  modeLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.1,
    flex: 1,
  },
  scoreLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 4,
    width: '100%',
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  comboContainer: {
    alignItems: 'center',
    marginTop: 8,
    minHeight: 18,
  },
  comboText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
});
