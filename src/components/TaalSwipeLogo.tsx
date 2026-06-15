import React from 'react';
import Svg, { Rect, Path, G, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

interface TaalSwipeLogoProps {
  size?: number;
}

export default function TaalSwipeLogo({ size = 120 }: TaalSwipeLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#ffffff" />
          <Stop offset="100%" stopColor="#f1f2f6" />
        </LinearGradient>
        <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#1a1a2e" />
          <Stop offset="100%" stopColor="#16213e" />
        </LinearGradient>
      </Defs>

      {/* App Icon Background */}
      <Rect x="0" y="0" width="100" height="100" rx="22" fill="url(#bgGrad)" />

      {/* Bottom Card Shadow */}
      <G transform="translate(16, 22) rotate(-5, 35, 30)">
        <Rect x="0" y="0" width="70" height="60" rx="8" fill="#000000" opacity="0.3" />
      </G>

      {/* Bottom Card */}
      <G transform="translate(15, 20) rotate(-5, 35, 30)">
        <Rect x="0" y="0" width="70" height="60" rx="8" fill="#a4b0be" />
      </G>

      {/* Top Swiping Card Shadow */}
      <G transform="translate(26, 17) rotate(10, 35, 30)">
        <Rect x="0" y="0" width="70" height="60" rx="8" fill="#000000" opacity="0.4" />
      </G>

      {/* Top Swiping Card */}
      <G transform="translate(25, 15) rotate(10, 35, 30)">
        <Rect x="0" y="0" width="70" height="60" rx="8" fill="url(#cardGrad)" />
        
        {/* Simple flashcard lines */}
        <Path d="M 10 24 L 60 24" fill="none" stroke="#ff6b81" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <Path d="M 10 34 L 60 34" fill="none" stroke="#7bed9f" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <Path d="M 10 44 L 45 44" fill="none" stroke="#70a1ff" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        
        {/* The text TAAL */}
        <Text x="35" y="14" fontSize="10" fontWeight="bold" fill="#2f3542" textAnchor="middle">
          TAAL
        </Text>
      </G>

      {/* Red X Shadow */}
      <G transform="translate(13, 57)">
        <Path d="M 0 0 L 15 15 M 15 0 L 0 15" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
      </G>

      {/* Red X on the left */}
      <G transform="translate(12, 55)">
        <Path d="M 0 0 L 15 15 M 15 0 L 0 15" fill="none" stroke="#ff4757" strokeWidth="5" strokeLinecap="round" />
      </G>

      {/* Green Check Shadow */}
      <G transform="translate(69, 57)">
        <Path d="M 0 8 L 5 15 L 15 0" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </G>

      {/* Green Check on the right */}
      <G transform="translate(68, 55)">
        <Path d="M 0 8 L 5 15 L 15 0" fill="none" stroke="#2ed573" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </G>

    </Svg>
  );
}
