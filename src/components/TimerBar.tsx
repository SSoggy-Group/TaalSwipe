import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface TimerBarProps {
  duration: number; // ms
  running: boolean;
  onTimeUp: () => void;
  resetKey: number; // change to reset timer
}

export function TimerBar({ duration, running, onTimeUp, resetKey }: TimerBarProps) {
  const progress = useSharedValue(1);

  React.useEffect(() => {
    if (running) {
      progress.value = 1;
      progress.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });
    } else {
      progress.value = 1;
    }
  }, [resetKey, running]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value <= 0 && running) {
        runOnJS(onTimeUp)();
      }
    },
    [running],
  );

  const barStyle = useAnimatedStyle(() => {
    const width = `${progress.value * 100}%` as any;
    const color =
      progress.value > 0.5
        ? Colors.timerActive
        : progress.value > 0.25
        ? Colors.timerWarning
        : Colors.timerDanger;

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
