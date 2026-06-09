import React, { useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface StopwatchRef {
  getTime: () => number;
}

interface Props {
  readonly running: boolean;
}

export const Stopwatch = React.memo(React.forwardRef<StopwatchRef, Props>(
  ({ running }, ref) => {
    const [elapsedMs, setElapsedMs] = useState(0);

    useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (running) {
        interval = setInterval(() => {
          setElapsedMs((prev) => prev + 100); // Update every 100ms
        }, 100);
      }
      return () => clearInterval(interval);
    }, [running]);

    useImperativeHandle(ref, () => ({
      getTime: () => elapsedMs,
    }));

    const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const deciseconds = Math.floor((ms % 1000) / 100);
      
      const mStr = minutes > 0 ? `${minutes}:` : '';
      const sStr = minutes > 0 ? seconds.toString().padStart(2, '0') : seconds.toString();
      
      return `${mStr}${sStr}.${deciseconds}`;
    };

    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>{formatTime(elapsedMs)}</Text>
      </View>
    );
  }
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timeText: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#38BDF8',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
});
