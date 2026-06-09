import React, { useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

export interface TimerBarRef {
  addTime: (ms: number) => void;
  subtractTime: (ms: number) => void;
}

interface TimerBarProps {
  readonly duration: number; // ms (max duration)
  readonly running: boolean;
  readonly onTimeUp: () => void;
  readonly onPanicChange?: (isPanicking: boolean) => void;
  readonly resetKey?: number; // change to reset timer completely
}

export const TimerBar = React.forwardRef<TimerBarRef, TimerBarProps>(
  ({ duration, running, onTimeUp, onPanicChange, resetKey }, ref) => {
    const progress = useSharedValue(1);
    const hasPanicked = useSharedValue(false);

    const startTimer = (fromProgress: number) => {
      cancelAnimation(progress);
      hasPanicked.value = false;
      if (onPanicChange) onPanicChange(false);
      progress.value = withTiming(0, {
        duration: fromProgress * duration,
        easing: Easing.linear,
      });
    };

    useImperativeHandle(ref, () => ({
      addTime: (ms) => {
        const addedProgress = ms / duration;
        const newProgress = Math.min(1, progress.value + addedProgress);
        progress.value = newProgress;
        if (running) startTimer(newProgress);
      },
      subtractTime: (ms) => {
        const subProgress = ms / duration;
        const newProgress = Math.max(0, progress.value - subProgress);
        progress.value = newProgress;
        if (running) startTimer(newProgress);
      }
    }));

    React.useEffect(() => {
      if (running) {
        progress.value = 1;
        startTimer(1);
      } else {
        cancelAnimation(progress);
        progress.value = 1;
        hasPanicked.value = false;
        if (onPanicChange) onPanicChange(false);
      }
    }, [resetKey, running]);

    useAnimatedReaction(
      () => progress.value,
      (value) => {
        if (value <= 0 && running) {
          runOnJS(onTimeUp)();
        } else if (value <= 0.25 && value > 0 && running && !hasPanicked.value) {
          hasPanicked.value = true;
          if (onPanicChange) {
            runOnJS(onPanicChange)(true);
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
);

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
