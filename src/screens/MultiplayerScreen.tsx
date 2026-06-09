import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, SlideInDown, ZoomIn } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { straattaalData } from '../data/straattaalData';
import { soundManager } from '../audio/SoundManager';
import ConfettiCannon from 'react-native-confetti-cannon';

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

export function MultiplayerScreen({ navigation }: Props) {
  const [data, setData] = useState(() => shuffleArray(straattaalData));
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [player1Score, setPlayer1Score] = useState(0); // Bottom player
  const [player2Score, setPlayer2Score] = useState(0); // Top player (rotated)
  
  const [winner, setWinner] = useState<number | null>(null);

  const currentItem = data[currentIndex];
  
  // End game if someone reaches 5 points
  useEffect(() => {
    if (player1Score >= 5) setWinner(1);
    if (player2Score >= 5) setWinner(2);
  }, [player1Score, player2Score]);

  const handleAnswer = useCallback((player: 1 | 2, answerIsRight: boolean) => {
    if (winner !== null) return;
    
    const isCorrect = currentItem.correct === answerIsRight;
    
    Haptics.impactAsync(isCorrect ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Heavy);
    if (isCorrect) {
      soundManager.playCorrect();
      if (player === 1) setPlayer1Score(s => s + 1);
      if (player === 2) setPlayer2Score(s => s + 1);
    } else {
      soundManager.playIncorrect();
      if (player === 1) setPlayer1Score(s => Math.max(0, s - 1));
      if (player === 2) setPlayer2Score(s => Math.max(0, s - 1));
    }
    
    setCurrentIndex(i => (i + 1) % data.length);
  }, [currentItem, winner, data.length]);

  const renderPlayerArea = (player: 1 | 2) => {
    const isP2 = player === 2;
    return (
      <View style={[styles.playerArea, isP2 && styles.rotated]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Speler {player}</Text>
          <Text style={styles.scoreValue}>{player === 1 ? player1Score : player2Score}</Text>
        </View>
        
        {winner === null ? (
          <Animated.View key={currentIndex} entering={ZoomIn.duration(300).springify()} style={styles.card}>
            <Text style={styles.word}>{currentItem.word}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: Colors.incorrect, borderBottomColor: '#B91C1C' }]}
                onPress={() => handleAnswer(player, false)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>NEP</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: Colors.correct, borderBottomColor: '#047857' }]}
                onPress={() => handleAnswer(player, true)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>ECHT</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.word}>
              {winner === player ? '🏆 JIJ WINT!' : '💀 VERLOREN...'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {winner !== null && <ConfettiCannon count={100} origin={{x: -10, y: 0}} />}
      
      {/* Player 2 Area (Top) */}
      {renderPlayerArea(2)}
      
      <View style={styles.divider}>
        <TouchableOpacity style={styles.quitBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.quitText}>STOP</Text>
        </TouchableOpacity>
      </View>

      {/* Player 1 Area (Bottom) */}
      {renderPlayerArea(1)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  playerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
  divider: {
    height: 60,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#334155',
  },
  quitBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quitText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 16,
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  scoreLabel: {
    color: '#94A3B8',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  scoreValue: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 48,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    borderBottomWidth: 8,
  },
  word: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 36,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomWidth: 6,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 24,
  },
});
