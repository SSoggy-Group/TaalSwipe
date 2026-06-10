import React from 'react';
import ConfettiCannon, { ExplosionProps } from 'react-native-confetti-cannon';

export function ConfettiBurst(props: Readonly<ExplosionProps>) {
  return <ConfettiCannon {...props} />;
}
