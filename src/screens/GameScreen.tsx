import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientBackground } from '../components/GradientBackground';
import { SwipeCard } from '../components/SwipeCard';
import { ScoreBar } from '../components/ScoreBar';
import { TimerBar } from '../components/TimerBar';
import { straattaalData, StraattaalItem } from '../data/straattaalData';
import { dunglishData, DunglishItem } from '../data/dunglishData';
import { spellingData, SpellingItem } from '../data/spellingData';
import { Colors } from '../theme/colors';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' };
  Result: { score: number; total: number; mode: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GameScreen({ navigation, route }: Props) {
  const { mode } = route.params;

  const data = useMemo(() => {
    switch (mode) {
      case 'straattaal': return shuffleArray(straattaalData);
      case 'dunglish': return shuffleArray(dunglishData);
      case 'spelling': return shuffleArray(spellingData);
    }
  }, [mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const isSpelling = mode === 'spelling';
  const modeLabels = {
    straattaal: 'Straattaal of AI?',
    dunglish: 'Steenkolenengels',
    spelling: 'Speed-Spelling',
  };

  const handleAnswer = useCallback((swipedRight: boolean) => {
    if (gameOver) return;
    const item = data[currentIndex];
    let correct = false;

    switch (mode) {
      case 'straattaal':
        correct = swipedRight === (item as StraattaalItem).isReal;
        break;
      case 'dunglish':
        correct = swipedRight === (item as DunglishItem).isRealProverb;
        break;
      case 'spelling':
        correct = swipedRight === (item as SpellingItem).isCorrect;
        break;
    }

    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore((s) => s + 1);
      setCombo((c) => c + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setCombo(0);
      if (isSpelling) {
        // Game over in spelling mode on wrong answer
        setGameOver(true);
        navigation.replace('Result', {
          score,
          total: currentIndex,
          mode: modeLabels[mode],
        });
        return;
      }
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= data.length) {
      navigation.replace('Result', {
        score: correct ? score + 1 : score,
        total: data.length,
        mode: modeLabels[mode],
      });
    } else {
      setCurrentIndex(nextIndex);
      if (isSpelling) {
        setTimerKey((k) => k + 1);
      }
    }
  }, [currentIndex, data, gameOver, isSpelling, mode, navigation, score]);

  const handleSwipeRight = useCallback(() => handleAnswer(true), [handleAnswer]);
  const handleSwipeLeft = useCallback(() => handleAnswer(false), [handleAnswer]);

  const handleTimeUp = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    navigation.replace('Result', {
      score,
      total: currentIndex,
      mode: modeLabels[mode],
    });
  }, [currentIndex, gameOver, mode, navigation, score]);

  const currentItem = data[currentIndex];
  const nextItem = currentIndex + 1 < data.length ? data[currentIndex + 1] : null;

  const renderCardContent = (item: typeof data[number]) => {
    switch (mode) {
      case 'straattaal': {
        const s = item as StraattaalItem;
        return (
          <View style={styles.cardContent}>
            <Text style={styles.instructionText}>Echt straattaal of AI-verzonnen?</Text>
            <Text style={styles.wordText}>{s.word}</Text>
            <Text style={styles.definitionText}>"{s.definition}"</Text>
            <View style={styles.hintRow}>
              <Text style={styles.hintLeft}>← Nep</Text>
              <Text style={styles.hintRight}>Echt →</Text>
            </View>
          </View>
        );
      }
      case 'dunglish': {
        const d = item as DunglishItem;
        return (
          <View style={styles.cardContent}>
            <Text style={styles.instructionText}>Echt Nederlands spreekwoord?</Text>
            <Text style={styles.proverbText}>"{d.text}"</Text>
            <View style={styles.hintRow}>
              <Text style={styles.hintLeft}>← Nep</Text>
              <Text style={styles.hintRight}>Echt →</Text>
            </View>
          </View>
        );
      }
      case 'spelling': {
        const sp = item as SpellingItem;
        return (
          <View style={styles.cardContent}>
            <Text style={styles.instructionText}>Goed of fout gespeld?</Text>
            <Text style={styles.spellingText}>{sp.text}</Text>
            <View style={styles.hintRow}>
              <Text style={styles.hintLeft}>← Fout</Text>
              <Text style={styles.hintRight}>Goed →</Text>
            </View>
          </View>
        );
      }
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScoreBar
          score={score}
          total={currentIndex}
          combo={isSpelling ? combo : undefined}
          mode={modeLabels[mode]}
        />
        {isSpelling && (
          <TimerBar
            duration={1500}
            running={!gameOver}
            onTimeUp={handleTimeUp}
            resetKey={timerKey}
          />
        )}

        <View style={styles.cardStack}>
          {/* Next card preview (behind) */}
          {nextItem && (
            <View style={[styles.previewCard, { transform: [{ scale: 0.92 }, { translateY: 12 }] }]}>
              <View style={[styles.cardPlaceholder]}>
                {renderCardContent(nextItem)}
              </View>
            </View>
          )}

          {/* Active card */}
          {currentItem && (
            <SwipeCard
              key={currentIndex}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              active={!gameOver}
            >
              {renderCardContent(currentItem)}
            </SwipeCard>
          )}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    opacity: 0.4,
  },
  cardPlaceholder: {
    width: '85%',
    minHeight: 280,
    borderRadius: 24,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    gap: 16,
  },
  instructionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  wordText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 36,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  definitionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  proverbText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  spellingText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 42,
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  hintLeft: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.incorrect,
    opacity: 0.7,
  },
  hintRight: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.correct,
    opacity: 0.7,
  },
});
