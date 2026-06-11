import React from 'react';
import { Platform } from 'react-native';
import ConfettiCannon, { ExplosionProps } from 'react-native-confetti-cannon';

export function ConfettiBurst(props: Readonly<ExplosionProps>) {
  if (Platform.OS === 'web') return null;
  return <ConfettiCannon {...props} />;
}
