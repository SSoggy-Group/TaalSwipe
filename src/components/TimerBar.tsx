import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface TimerBarProps {
  readonly duration: number; // ms
  readonly running: boolean;
  readonly onTimeUp: () => void;
  readonly onPanicChange?: (isPanicking: boolean) => void;
  readonly resetKey: number; // change to reset timer
}

export function TimerBar({ duration, running, onTimeUp, onPanicChange, resetKey }: TimerBarProps) {
  const progress = useSharedValue(1);
  const hasPanicked = useSharedValue(false);

  React.useEffect(() => {
    if (running) {
      progress.value = 1;
      hasPanicked.value = false;
      if (onPanicChange) onPanicChange(false);
      progress.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });
    } else {
      progress.value = 1;
      hasPanicked.value = false;
      if (onPanicChange) onPanicChange(false);
    }
  }, [resetKey, running]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value <= 0 && running) {
        onTimeUp();
      } else if (value <= 0.25 && value > 0 && running && !hasPanicked.value) {
        hasPanicked.value = true;
        if (onPanicChange) {
          onPanicChange(true);
        }
      }
    },
    [running, onPanicChange],
  );

  const barStyle = useAnimatedStyle(() => {
    const width = `${progress.value * 100}%` as any;
    let color: string;
    if (progress.value > 0.5) {
      color = Colors.timerActive;
    } else if (progress.value > 0.25) {
      color = Colors.timerWarning;
    } else {
      color = Colors.timerDanger;
    }

    return {
      width,
      backgroundColor: color,
    };
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.bar, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginTop: 12,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
});
