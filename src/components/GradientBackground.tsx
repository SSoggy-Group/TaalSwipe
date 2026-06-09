import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradient.layer1.colors as [string, string, string]}
        start={Colors.gradient.layer1.start}
        end={Colors.gradient.layer1.end}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={Colors.gradient.layer2.colors as [string, string]}
        start={Colors.gradient.layer2.start}
        end={Colors.gradient.layer2.end}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={Colors.gradient.layer3.colors as [string, string]}
        start={Colors.gradient.layer3.start}
        end={Colors.gradient.layer3.end}
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
