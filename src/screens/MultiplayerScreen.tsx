import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useAppTheme } from '../theme/colors';
import { soundManager } from '../audio/SoundManager';
import ConfettiCannon from 'react-native-confetti-cannon';
import { GradientBackground } from '../components/GradientBackground';
import { SwipeCard } from '../components/SwipeCard';
import { BouncyButton } from '../components/BouncyButton';

// Import all 6 mode databases
import { straattaalData } from '../data/straattaalData';
import { dunglishData } from '../data/dunglishData';
import { spellingData } from '../data/spellingData';
import { dtData } from '../data/dtData';
import { vanDaleData } from '../data/vanDaleData';
import { brandData } from '../data/brandData';

type RootStackParamList = {
  Home: undefined;
  Multiplayer: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Multiplayer'>;

interface MultiplayerItem {
  text: string;
  isCorrect: boolean;
  mode: string;
  leftLabel: string;
  rightLabel: string;
  color: string;
}

// Map all databases to a single uniform structure
const COMBINED_DATA: MultiplayerItem[] = [
  ...spellingData.map(x => ({ text: x.text, isCorrect: x.isCorrect, mode: 'SPELLING', leftLabel: 'FOUT ✗', rightLabel: 'GOED ✓', color: '#0EA5E9' })),
  ...dtData.map(x => ({ text: x.text, isCorrect: x.isCorrect, mode: 'D/T SPELLING', leftLabel: 'FOUT ✗', rightLabel: 'GOED ✓', color: '#F59E0B' })),
  ...straattaalData.map(x => ({ text: x.word, isCorrect: x.isReal, mode: 'STRAATTAAL', leftLabel: 'VERZONNEN ✗', rightLabel: 'ECHT ✓', color: '#8B5CF6' })),
  ...dunglishData.map(x => ({ text: x.text, isCorrect: x.isRealProverb, mode: 'DUNGLISH', leftLabel: 'NEP ✗', rightLabel: 'ECHT ✓', color: '#EC4899' })),
  ...vanDaleData.map(x => ({ text: x.word, isCorrect: x.isReal, mode: 'VAN DALE', leftLabel: 'ONZIN ✗', rightLabel: 'VAN DALE ✓', color: '#10B981' })),
  ...brandData.map(x => ({ text: x.word, isCorrect: x.isReal, mode: 'MERKEN', leftLabel: 'SOORT ✗', rightLabel: 'MERK ✓', color: '#EF4444' })),
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TARGET_SCORE = 15;
const PENALTY_MS = 600; // Snappy lockout instead of 1500ms

export function MultiplayerScreen({ navigation }: Props) {
  const theme = useAppTheme();
  
  // Independent shuffled data lists for both players to prevent copying and make it a real race!
  const [p1Data] = useState(() => shuffleArray(COMBINED_DATA));
  const [p2Data] = useState(() => shuffleArray(COMBINED_DATA));
  
  const [p1Index, setP1Index] = useState(0);
  const [p2Index, setP2Index] = useState(0);
  
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  
  const [p1Penalty, setP1Penalty] = useState(false);
  const [p2Penalty, setP2Penalty] = useState(false);
  
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    if (p1Score >= TARGET_SCORE && winner === null) setWinner(1);
    if (p2Score >= TARGET_SCORE && winner === null) setWinner(2);
  }, [p1Score, p2Score, winner]);

  const handleSwipe = useCallback((player: 1 | 2, answerIsRight: boolean) => {
    if (winner !== null) return;
    
    const currentIndex = player === 1 ? p1Index : p2Index;
    const gameData = player === 1 ? p1Data : p2Data;
    const item = gameData[currentIndex % gameData.length];
    
    const isCorrect = item.isCorrect === answerIsRight;
    
    if (isCorrect) {
      soundManager.playCorrect();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (player === 1) {
        setP1Score(s => s + 1);
        setP1Index(i => i + 1);
      } else {
        setP2Score(s => s + 1);
        setP2Index(i => i + 1);
      }
    } else {
      soundManager.playIncorrect();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Snappy penalty lockout
      if (player === 1) {
        setP1Penalty(true);
        setTimeout(() => {
          setP1Penalty(false);
          setP1Index(i => i + 1);
        }, PENALTY_MS);
      } else {
        setP2Penalty(true);
        setTimeout(() => {
          setP2Penalty(false);
          setP2Index(i => i + 1);
        }, PENALTY_MS);
      }
    }
  }, [p1Data, p2Data, p1Index, p2Index, winner]);

  const renderPlayerArea = (player: 1 | 2) => {
    const isP2 = player === 2;
    const score = player === 1 ? p1Score : p2Score;
    const currentIndex = player === 1 ? p1Index : p2Index;
    const isPenalty = player === 1 ? p1Penalty : p2Penalty;
    const gameData = player === 1 ? p1Data : p2Data;
    const currentItem = gameData[currentIndex % gameData.length];

    return (
      <View style={[styles.playerArea, isP2 && styles.rotated]}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreText}>P{player}: {score}/{TARGET_SCORE}</Text>
        </View>
        
        <View style={styles.cardContainer}>
          {winner !== null ? (
            <Animated.View entering={ZoomIn} style={styles.winnerCard}>
              <Text style={styles.winnerText}>
                {winner === player ? '🏆 JIJ WINT!' : '💀 VERLOREN...'}
              </Text>
            </Animated.View>
          ) : isPenalty ? (
            <View style={styles.penaltyCard}>
              <Text style={styles.penaltyText}>FOUT! ⏳</Text>
            </View>
          ) : (
            <SwipeCard
              key={currentIndex}
              active={true}
              compact={true}
              onSwipeLeft={() => handleSwipe(player, false)}
              onSwipeRight={() => handleSwipe(player, true)}
              leftLabel={currentItem.leftLabel}
              rightLabel={currentItem.rightLabel}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.modeBadge, { color: currentItem.color, borderColor: currentItem.color }]}>
                  {currentItem.mode}
                </Text>
              </View>
              <Text style={[styles.word, { color: theme.cardTextPrimary }]} adjustsFontSizeToFit numberOfLines={2}>
                {currentItem.text}
              </Text>
            </SwipeCard>
          )}
        </View>
      </View>
    );
  };

  return (
    <GradientBackground>
      {winner !== null && <ConfettiCannon count={150} origin={{x: -10, y: 0}} />}
      <SafeAreaView style={styles.container}>
        {/* Player 2 Area (Top) */}
        {renderPlayerArea(2)}
        
        <View style={styles.divider}>
          {winner !== null ? (
            <BouncyButton 
              title="Terug 🏠" 
              color="#38BDF8" 
              borderColor="#0284C7" 
              bottomBorderColor="#0369A1" 
              onPress={() => navigation.goBack()} 
            />
          ) : (
            <TouchableOpacity style={styles.quitBtn} focusable={false} onPress={() => navigation.goBack()}>
              <Text style={styles.quitText}>STOP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Player 1 Area (Bottom) */}
        {renderPlayerArea(1)}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
  scoreHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    opacity: 0.8,
  },
  cardContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modeBadge: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 11,
    letterSpacing: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  word: {
    fontFamily: 'Inter_900Black',
    fontSize: 28,
    textAlign: 'center',
  },
  penaltyCard: {
    width: '100%',
    minHeight: 180,
    backgroundColor: '#EF4444',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#B91C1C',
    borderBottomWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  penaltyText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 36,
  },
  winnerCard: {
    width: '100%',
    minHeight: 180,
    backgroundColor: '#10B981',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#059669',
    borderBottomWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 32,
  },
  divider: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  quitBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quitText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 16,
  },
});
