import React from 'react';
import { Dimensions } from 'react-native';
import { ConfettiBurst } from '../platform/ConfettiBurst';

const { width } = Dimensions.get('window');

export function Confetti() {
  return (
    <ConfettiBurst
      count={150}
      origin={{ x: width / 2, y: -20 }}
      autoStart={true}
      fadeOut={true}
      fallSpeed={2500}
      explosionSpeed={400}
      colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#9D4EDD']}
    />
  );
}
