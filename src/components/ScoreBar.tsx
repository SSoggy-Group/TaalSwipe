import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
  FadeIn,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme/colors';

interface ScoreBarProps {
  readonly score: number;
  readonly currentIndex: number;
  readonly maxTotal: number;
  readonly combo?: number;
  readonly mode: string;
}

export function ScoreBar({ score, currentIndex, maxTotal, combo, mode }: ScoreBarProps) {
  const theme = useAppTheme();
  
  // Progress bar fills up based on how many questions answered
  const progressPercent = maxTotal > 0 ? currentIndex / maxTotal : 0;

  const progressWidth = useSharedValue(0);
  const comboScale = useSharedValue(1);

  React.useEffect(() => {
    progressWidth.value = withSpring(progressPercent * 100, { damping: 12, stiffness: 150, mass: 0.8 }); // Bouncier fill
  }, [progressPercent]);

  React.useEffect(() => {
    if (combo && combo > 1) {
      comboScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 250 }),
          withTiming(1, { duration: 250 })
        ),
        -1, // infinite
        true
      );
    } else {
      comboScale.value = 1;
    }
  }, [combo]);

  const isFire = combo !== undefined && combo >= 3;
  const fireColorValue = useSharedValue(0);

  React.useEffect(() => {
    fireColorValue.value = withTiming(isFire ? 1 : 0, { duration: 300 });
  }, [isFire]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      fireColorValue.value,
      [0, 1],
      ['#58CC02', '#FF9600'] // Duolingo green to Bright Duolingo Orange
    );
    const borderColor = interpolateColor(
      fireColorValue.value,
      [0, 1],
      ['#46A302', '#CC7800']
    );

    return {
      width: `${progressWidth.value}%`,
      backgroundColor,
      borderColor,
    };
  });

  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.modeLabel, { color: theme.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit>
          {mode}
        </Text>
        <Text style={[styles.scoreLabel, { color: theme.textPrimary }]}>SCORE: {score}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        {/* Background track */}
        <View style={styles.progressTrack} />
        {/* Fill */}
        <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
        {/* Shine overlay for that 3D glossy Duolingo look */}
        <View style={styles.progressShine} />
        {isFire && (
          <Animated.View style={styles.fireIconContainer} entering={FadeIn}>
            <Text style={styles.fireIcon}>🔥</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.comboContainer}>
        {combo !== undefined && combo > 1 && (
          <Animated.View style={[styles.comboBadge, comboStyle]}>
            <Text style={styles.comboText}>🔥 {combo}x COMBO</Text>
          </Animated.View>
        )}
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
    alignItems: 'center',
    marginBottom: 8,
  },
  modeLabel: {
    fontFamily: 'Inter_900Black',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    flex: 1,
  },
  scoreLabel: {
    fontFamily: 'Inter_900Black',
    fontSize: 16,
    letterSpacing: 1,
  },
  progressContainer: {
    height: 24,
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressTrack: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    borderRightWidth: 2,
  },
  progressShine: {
    position: 'absolute',
    top: 3,
    left: 8,
    right: 8,
    height: 8, // Thicker shine
    backgroundColor: 'rgba(255,255,255,0.4)', // Brighter shine
    borderRadius: 4,
  },
  comboContainer: {
    alignItems: 'center',
    marginTop: 12,
    minHeight: 28,
  },
  comboBadge: {
    backgroundColor: '#FF9600', // Duolingo orange
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderColor: '#CC7800',
    shadowColor: '#FF9600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  comboText: {
    fontFamily: 'Inter_900Black',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  fireIconContainer: {
    position: 'absolute',
    right: 8,
    top: 2,
    bottom: 0,
    justifyContent: 'center',
  },
  fireIcon: {
    fontSize: 16,
  },
});
