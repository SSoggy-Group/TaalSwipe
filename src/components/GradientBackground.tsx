import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../theme/colors';

interface Props {
  readonly children: React.ReactNode;
  /** Kept for API compatibility; combo no longer changes the backdrop. */
  readonly combo?: number;
  /** Kept for API compatibility; the timer communicates urgency itself. */
  readonly isPanicking?: boolean;
}

/**
 * Static paper backdrop. The selected shop background only changes the tint,
 * so text contrast and the overall visual language stay consistent.
 */
export function GradientBackground({ children }: Props) {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundTint]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
