import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme/colors';

interface Props {
  children: React.ReactNode;
  combo?: number;
  isPanicking?: boolean;
}

export function GradientBackground({ children, combo = 0, isPanicking = false }: Props) {
  const colors = useAppTheme();
  const intensity = useSharedValue(0);
  const panicIntensity = useSharedValue(0);
  const breatheIntensity = useSharedValue(0);

  useEffect(() => {
    // Start infinite breathing animation for the background
    breatheIntensity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    intensity.value = withTiming(combo > 2 ? 1 : 0, { duration: 500 });
  }, [combo]);

  useEffect(() => {
    if (isPanicking) {
      panicIntensity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 150 }),
          withTiming(0.2, { duration: 150 })
        ),
        -1, // infinite
        true
      );
    } else {
      panicIntensity.value = withTiming(0, { duration: 200 });
    }
  }, [isPanicking]);

  const breatheStyle = useAnimatedStyle(() => ({
    opacity: breatheIntensity.value,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: intensity.value,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const panicStyle = useAnimatedStyle(() => ({
    opacity: panicIntensity.value,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient.layer1.colors as [string, string]}
        start={colors.gradient.layer1.start}
        end={colors.gradient.layer1.end}
        style={StyleSheet.absoluteFill}
      />

      {/* Breathing overlay for dynamic gradient feel */}
      <Animated.View style={breatheStyle} pointerEvents="none">
        <LinearGradient
          colors={colors.gradient.layer2.colors as [string, string]}
          start={colors.gradient.layer2.start}
          end={colors.gradient.layer2.end}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      
      {/* Intense Combo Overlay (Subtle Red Glow) */}
      <Animated.View style={overlayStyle} pointerEvents="none">
        <LinearGradient
          colors={['rgba(255, 60, 0, 0)', 'rgba(255, 60, 0, 0.15)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Panic Overlay */}
      <Animated.View style={panicStyle} pointerEvents="none" />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
