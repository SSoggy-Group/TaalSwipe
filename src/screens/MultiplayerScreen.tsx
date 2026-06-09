import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import Animated, { ZoomIn, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { spellingData } from '../data/spellingData';
import { soundManager } from '../audio/SoundManager';
import ConfettiCannon from 'react-native-confetti-cannon';
import { GradientBackground } from '../components/GradientBackground';
import { SwipeCard } from '../components/SwipeCard';
import { BouncyButton } from '../components/BouncyButton';
import { useAppTheme } from '../theme/colors';

type RootStackParamList = {
  Home: undefined;
  Multiplayer: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Multiplayer'>;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TARGET_SCORE = 15;
const PENALTY_MS = 1500;

export function MultiplayerScreen({ navigation }: Props) {
  const theme = useAppTheme();
  // Use same randomized data for both players so it's fair
  const [gameData] = useState(() => shuffleArray(spellingData));
  
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
    const item = gameData[currentIndex % gameData.length];
    
    // Spelling mode has an 'isCorrect' property (boolean) meaning "is this spelled correctly?"
    // User swipes right (true) if they think it's spelled correctly.
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
      
      // Penalty
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
  }, [gameData, p1Index, p2Index, winner]);

  const renderPlayerArea = (player: 1 | 2) => {
    const isP2 = player === 2;
    const score = player === 1 ? p1Score : p2Score;
    const currentIndex = player === 1 ? p1Index : p2Index;
    const isPenalty = player === 1 ? p1Penalty : p2Penalty;
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
              leftLabel="FOUT ✗"
              rightLabel="GOED ✓"
            >
              <Text style={[styles.word, { color: theme.cardTextPrimary }]} adjustsFontSizeToFit numberOfLines={2}>{currentItem.text}</Text>
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
            <TouchableOpacity style={styles.quitBtn} onPress={() => navigation.goBack()}>
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
    marginBottom: 10,
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
  word: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
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
