import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { SwipeCard, CardSkinWrapper } from '../components/SwipeCard';
import { ScoreBar } from '../components/ScoreBar';
import { TimerBar } from '../components/TimerBar';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { PauseModal } from '../components/PauseModal';
import { BouncyButton } from '../components/BouncyButton';
import { straattaalData, StraattaalItem } from '../data/straattaalData';
import { dunglishData, DunglishItem } from '../data/dunglishData';
import { spellingData, SpellingItem } from '../data/spellingData';
import { dtData, DtItem } from '../data/dtData';
import { Colors, useAppTheme } from '../theme/colors';
import { statsStore, AppStats } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
import { soundManager } from '../audio/SoundManager';
import ConfettiCannon from 'react-native-confetti-cannon';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt' };
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
  const theme = useAppTheme();

  const data = useMemo(() => {
    switch (mode) {
      case 'straattaal': return shuffleArray(straattaalData);
      case 'dunglish': return shuffleArray(dunglishData);
      case 'spelling': return shuffleArray(spellingData);
      case 'dt': return shuffleArray(dtData).map(item => ({
        ...item,
        isCorrect: Math.random() > 0.5,
      }));
    }
  }, [mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isPanicking, setIsPanicking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shootConfetti, setShootConfetti] = useState(false);

  const { hardcoreMode, equippedCard } = useSettingsStore();
  const [lives, setLives] = useState(hardcoreMode ? 3 : 0);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [showShieldAlert, setShowShieldAlert] = useState(false);
  const [showTimeSlowAlert, setShowTimeSlowAlert] = useState(false);
  const [activeHint, setActiveHint] = useState<'left' | 'right' | null>(null);

  const isSpelling = mode === 'spelling';
  const modeLabels = {
    straattaal: 'Straattaal of AI?',
    dunglish: 'Steenkolenengels',
    spelling: 'Speed-Spelling',
    dt: 'D/T Grammatica',
  };

  React.useEffect(() => {
    async function initGame() {
      await statsStore.updateStreak(); // Track daily streak
      const currentStats = await statsStore.getStats();
      setStats(currentStats);
      if (!currentStats.tutorialSeen[mode]) {
        setShowTutorial(true);
      }
    }
    initGame();
  }, [mode]);

  const handleDismissTutorial = async () => {
    setShowTutorial(false);
    const stats = await statsStore.getStats();
    stats.tutorialSeen[mode] = true;
    await statsStore.saveStats(stats);
    // Restart timer when tutorial dismissed
    if (isSpelling) {
      setTimerKey((k) => k + 1);
    }
  };

  const updateStats = async (currentCombo: number, earnedXp: number = 0) => {
    const currentStats = await statsStore.getStats();
    currentStats.totalSwipes += 1;
    
    const multiplier = currentStats.xpMultiplier || 1.0;
    const finalXp = Math.round(earnedXp * multiplier);
    
    currentStats.xp += hardcoreMode ? finalXp * 2 : finalXp; // Double XP for hardcore
    if (currentCombo > currentStats.highestCombo) {
      currentStats.highestCombo = currentCombo;
    }
    await statsStore.saveStats(currentStats);
    setStats(currentStats);
  };

  const [feedbackInfo, setFeedbackInfo] = useState<{ title: string; subtitle: string } | null>(null);

  const advanceGame = useCallback((wasCorrect: boolean) => {
    if (gameOver) return;
    setActiveHint(null);

    if (!wasCorrect && isSpelling) {
      setGameOver(true);
      navigation.replace('Result', {
        score,
        total: currentIndex,
        mode: modeLabels[mode],
      });
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= data.length) {
      navigation.replace('Result', {
        score: wasCorrect ? score + 1 : score,
        total: data.length,
        mode: modeLabels[mode],
      });
    } else {
      setCurrentIndex(nextIndex);
      if (isSpelling) {
        setTimerKey((k) => k + 1);
      }
    }
  }, [currentIndex, data.length, gameOver, isSpelling, mode, navigation, score]);

  const showFeedback = useCallback((title: string, subtitle: string) => {
    setFeedbackInfo({ title, subtitle });
    // Game will wait for the user to press 'Continue' before advancing
  }, []);

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
      case 'dt':
        // We will add `isCorrect` dynamically in useMemo
        correct = swipedRight === (item as any).isCorrect;
        break;
    }

    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundManager.playCorrect(combo);
      setScore((s) => s + 1);
      setCombo((c) => {
        const newCombo = c + 1;
        updateStats(newCombo, 10 + (newCombo * 2)); // Earn XP!
        
        // Trigger confetti every 5 combo
        if (newCombo > 0 && newCombo % 5 === 0) {
          setShootConfetti(true);
          setTimeout(() => setShootConfetti(false), 3000);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        return newCombo;
      });
      advanceGame(true);
    } else {
      if (stats && stats.shields > 0) {
        const newStats = {
          ...stats,
          shields: stats.shields - 1,
        };
        statsStore.saveStats(newStats);
        setStats(newStats);

        setShowShieldAlert(true);
        setTimeout(() => setShowShieldAlert(false), 2000);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        soundManager.playCorrect(0); // safe chime
        
        advanceGame(true); // skip penalty, proceed
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      soundManager.playIncorrect();
      setCombo(0);
      updateStats(0, 0);
      
      // Show seamless feedback
      if (mode === 'straattaal') {
        const s = item as StraattaalItem;
        showFeedback('FOUT! ❌', `${s.word} is ${s.isReal ? 'echt' : 'nep'}! ${s.definition}`);
      } else if (mode === 'dunglish') {
        const d = item as DunglishItem;
        showFeedback('FOUT! ❌', `"${d.text}" is ${d.isRealProverb ? 'echt' : 'nep'}!`);
      } else if (mode === 'spelling') {
        const sp = item as SpellingItem;
        if (sp.correction) {
          showFeedback('FOUT! ❌', `De juiste spelling is: ${sp.correction}`);
        } else {
          showFeedback('FOUT! ❌', 'Dat was helaas onjuist gespeld.');
        }
      } else if (mode === 'dt') {
        const dt = item as any;
        showFeedback('FOUT! ❌', dt.explanation);
      }

      if (hardcoreMode) {
        setLives((l) => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameOver(true);
            // End game after a short delay so they can read the feedback
            setTimeout(() => {
              navigation.replace('Result', {
                score,
                total: currentIndex,
                mode: modeLabels[mode],
              });
            }, 2500);
          }
          return newLives;
        });
      }
    }
  }, [currentIndex, data, gameOver, isSpelling, mode, advanceGame, showFeedback, hardcoreMode, score, navigation, modeLabels, stats]);

  const handleSwipeRight = useCallback(() => handleAnswer(true), [handleAnswer]);
  const handleSwipeLeft = useCallback(() => handleAnswer(false), [handleAnswer]);

  const handleUseTimeSlow = async () => {
    if (!stats || stats.timeSlows <= 0 || gameOver || isPaused) return;

    const newStats = {
      ...stats,
      timeSlows: stats.timeSlows - 1,
    };
    await statsStore.saveStats(newStats);
    setStats(newStats);

    if (isSpelling) {
      setTimerKey((k) => k + 1);
    }
    
    setShowTimeSlowAlert(true);
    setTimeout(() => setShowTimeSlowAlert(false), 1500);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleUseHint = async () => {
    if (!stats || stats.hints <= 0 || gameOver || isPaused || activeHint) return;

    const item = data[currentIndex];
    let correctDirection: 'left' | 'right' = 'right';

    switch (mode) {
      case 'straattaal':
        correctDirection = (item as StraattaalItem).isReal ? 'right' : 'left';
        break;
      case 'dunglish':
        correctDirection = (item as DunglishItem).isRealProverb ? 'right' : 'left';
        break;
      case 'spelling':
        correctDirection = (item as SpellingItem).isCorrect ? 'right' : 'left';
        break;
      case 'dt':
        correctDirection = (item as any).isCorrect ? 'right' : 'left';
        break;
    }

    const newStats = {
      ...stats,
      hints: stats.hints - 1,
    };
    await statsStore.saveStats(newStats);
    setStats(newStats);

    setActiveHint(correctDirection);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleTimeUp = useCallback(() => {
    if (gameOver || isPaused) return;
    setGameOver(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    navigation.replace('Result', {
      score,
      total: currentIndex,
      mode: modeLabels[mode],
    });
  }, [currentIndex, gameOver, isPaused, mode, navigation, score]);

  const handleClose = useCallback(() => {
    if (gameOver) return;
    setIsPaused(true);
  }, [gameOver]);

  const handleQuit = useCallback(() => {
    setGameOver(true);
    setIsPaused(false);
    navigation.replace('Result', {
      score,
      total: currentIndex,
      mode: modeLabels[mode],
    });
  }, [currentIndex, mode, navigation, score]);

  const speakWord = useCallback((text: string, lang: string = 'nl-NL') => {
    Speech.stop();
    Speech.speak(text, { language: lang, rate: 0.9 });
  }, []);

  const currentItem = data[currentIndex];
  const nextItem = currentIndex + 1 < data.length ? data[currentIndex + 1] : null;

  const renderCardContent = (item: typeof data[number]) => {
    switch (mode) {
      case 'straattaal': {
        const s = item as StraattaalItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Echt straattaal of AI-verzonnen?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.wordText, { color: theme.cardTextPrimary }]}>{s.word}</Text>
              <TouchableOpacity onPress={() => speakWord(s.word)} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.definitionText, { color: theme.cardTextSecondary }]}>"{s.definition}"</Text>
            <View style={styles.hintRow}>
              <Text style={[styles.hintLeft, { color: theme.cardTextSecondary }]}>← Nep</Text>
              <Text style={[styles.hintRight, { color: theme.cardTextSecondary }]}>Echt →</Text>
            </View>
          </View>
        );
      }
      case 'dunglish': {
        const d = item as DunglishItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Echt Nederlands spreekwoord?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.proverbText, { color: theme.cardTextPrimary }]}>"{d.text}"</Text>
              <TouchableOpacity onPress={() => speakWord(d.text, 'en-US')} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            <View style={styles.hintRow}>
              <Text style={[styles.hintLeft, { color: theme.cardTextSecondary }]}>← Nep</Text>
              <Text style={[styles.hintRight, { color: theme.cardTextSecondary }]}>Echt →</Text>
            </View>
          </View>
        );
      }
      case 'spelling': {
        const sp = item as SpellingItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Goed of fout gespeld?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.spellingText, { color: theme.cardTextPrimary }]}>{sp.text}</Text>
              <TouchableOpacity onPress={() => speakWord(sp.text)} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            <View style={styles.hintRow}>
              <Text style={[styles.hintLeft, { color: theme.cardTextSecondary }]}>← Fout</Text>
              <Text style={[styles.hintRight, { color: theme.cardTextSecondary }]}>Goed →</Text>
            </View>
          </View>
        );
      }
      case 'dt': {
        const dt = item as any; // DtItem & { isCorrect: boolean }
        const displayedAnswer = dt.isCorrect ? dt.correctAnswer : dt.wrongAnswer;
        const parts = dt.sentence.split('___');
        
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Kies het juiste woord</Text>
            <View style={[styles.wordRow, { paddingHorizontal: 16 }]}>
              <Text style={[styles.spellingText, { fontSize: 24, textAlign: 'center', lineHeight: 34, color: theme.cardTextPrimary }]}>
                {parts[0]}
                <Text style={{ color: Colors.accent, fontFamily: 'Inter_800ExtraBold' }}>
                  {displayedAnswer}
                </Text>
                {parts[1]}
              </Text>
            </View>
            <Text style={[styles.definitionText, { marginTop: 12, color: theme.cardTextSecondary }]}>Werkwoord: {dt.verb}</Text>
            <View style={styles.hintRow}>
              <Text style={[styles.hintLeft, { color: theme.cardTextSecondary }]}>← Fout</Text>
              <Text style={[styles.hintRight, { color: theme.cardTextSecondary }]}>Goed →</Text>
            </View>
          </View>
        );
      }
    }
  };

  return (
    <GradientBackground combo={combo} isPanicking={isPanicking}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {hardcoreMode && (
          <Animated.View entering={FadeInDown} style={styles.heartsContainer}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Ionicons 
                key={i} 
                name={i < lives ? "heart" : "heart-outline"} 
                size={32} 
                color={i < lives ? "#FF4B4B" : "rgba(255,255,255,0.3)"} 
              />
            ))}
          </Animated.View>
        )}

        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={28} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={styles.scoreWrapper}>
            <ScoreBar
              score={score}
              currentIndex={currentIndex}
              maxTotal={data.length}
              combo={isSpelling ? combo : undefined}
              mode={modeLabels[mode]}
            />
          </View>
        </View>

        {isSpelling && (
          <TimerBar
            duration={1500}
            running={!gameOver && !showTutorial}
            onTimeUp={handleTimeUp}
            onPanicChange={setIsPanicking}
            resetKey={timerKey}
          />
        )}

        <View style={styles.cardStack}>
          {/* Next card preview (behind) */}
          {nextItem && (
            <View style={[styles.previewCard, { transform: [{ scale: 0.92 }, { translateY: 16 }], width: '85%' }]}>
              <CardSkinWrapper equippedCard={equippedCard} theme={theme}>
                <View style={{ padding: 32, alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
                  {renderCardContent(nextItem)}
                </View>
              </CardSkinWrapper>
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

        {/* Power-up HUD */}
        {!gameOver && currentItem && !showTutorial && !feedbackInfo && stats && (
          <View style={styles.powerupRow}>
            {/* Shield Indicator */}
            <View style={[styles.powerupBadge, { opacity: stats.shields > 0 ? 1 : 0.5 }]}>
              <Text style={styles.powerupIcon}>🛡️</Text>
              <Text style={styles.powerupCount}>{stats.shields}</Text>
            </View>

            {/* Time Slow Button */}
            {isSpelling && (
              <TouchableOpacity 
                onPress={handleUseTimeSlow}
                disabled={stats.timeSlows <= 0}
                style={[
                  styles.powerupButton, 
                  { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                  stats.timeSlows <= 0 && { opacity: 0.4 }
                ]}
              >
                <Text style={styles.powerupIcon}>⏱️</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{stats.timeSlows}</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Hint Button */}
            <TouchableOpacity 
              onPress={handleUseHint}
              disabled={stats.hints <= 0 || activeHint !== null}
              style={[
                styles.powerupButton, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                (stats.hints <= 0 || activeHint !== null) && { opacity: 0.4 }
              ]}
            >
              <Text style={styles.powerupIcon}>🔍</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{stats.hints}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Bubbly Action Buttons */}
        {!gameOver && currentItem && !showTutorial && !feedbackInfo && (
          <Animated.View 
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.actionRow}
          >
            <BouncyButton
              style={[
                styles.actionButton,
                activeHint === 'left' ? { borderColor: '#FFFFFF', borderWidth: 4 } : undefined
              ]}
              color="#FF4B4B"
              borderColor="#D33333"
              bottomBorderColor="#9A1D1D"
              onPress={handleSwipeLeft}
            >
              <Ionicons name="close" size={48} color="#FFFFFF" />
              {activeHint === 'left' && <View style={styles.hintDot} />}
            </BouncyButton>
            
            <BouncyButton
              style={[
                styles.actionButton,
                activeHint === 'right' ? { borderColor: '#FFFFFF', borderWidth: 4 } : undefined
              ]}
              color="#58CC02"
              borderColor="#46A302"
              bottomBorderColor="#2D6A01"
              onPress={handleSwipeRight}
            >
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
              {activeHint === 'right' && <View style={styles.hintDot} />}
            </BouncyButton>
          </Animated.View>
        )}
      </SafeAreaView>

      <TutorialOverlay
        visible={showTutorial}
        onDismiss={handleDismissTutorial}
        mode={mode}
      />

      {feedbackInfo && (
        <Animated.View 
          entering={FadeInDown.duration(400).springify().damping(15)} 
          style={styles.feedbackPanel}
        >
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>{feedbackInfo.title}</Text>
            <Text style={styles.feedbackSubtitle}>{feedbackInfo.subtitle}</Text>
          </View>
          <BouncyButton
            title="Doorgaan"
            color="#FFFFFF"
            borderColor="#E2E8F0"
            bottomBorderColor="#CBD5E1"
            textStyle={styles.continueButtonText}
            onPress={() => {
              setFeedbackInfo(null);
              advanceGame(false);
            }}
          />
        </Animated.View>
      )}

      <PauseModal
        visible={isPaused}
        onResume={() => setIsPaused(false)}
        onQuit={handleQuit}
        score={score}
      />
      {shootConfetti && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <ConfettiCannon 
            count={60} 
            origin={{x: -10, y: 0}} 
            fallSpeed={2500} 
            explosionSpeed={350} 
            fadeOut={true} 
          />
          <ConfettiCannon 
            count={60} 
            origin={{x: 400, y: 0}} 
            fallSpeed={2500} 
            explosionSpeed={350} 
            fadeOut={true} 
          />
        </View>
      )}

      {showShieldAlert && (
        <Animated.View 
          entering={FadeInDown.duration(300)} 
          exiting={FadeOut.duration(300)} 
          style={styles.toastContainer}
        >
          <View style={[styles.toast, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.toastText}>🛡️ Schild gebruikt! Fout voorkomen.</Text>
          </View>
        </Animated.View>
      )}

      {showTimeSlowAlert && (
        <Animated.View 
          entering={FadeInDown.duration(300)} 
          exiting={FadeOut.duration(300)} 
          style={styles.toastContainer}
        >
          <View style={[styles.toast, { backgroundColor: '#10B981' }]}>
            <Text style={styles.toastText}>⏱️ Tijd gereset! (+1.5s)</Text>
          </View>
        </Animated.View>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  heartsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  closeButton: {
    padding: 8,
    marginRight: -10, // Pull score bar slightly left
    zIndex: 10,
  },
  scoreWrapper: {
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
    opacity: 0.6,
  },
  cardPlaceholder: {
    width: '85%',
    minHeight: 300,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderBottomWidth: 8,
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    gap: 16,
  },
  instructionText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#64748B', // Muted slate
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  speakButton: {
    padding: 8,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderRadius: 20,
  },
  wordText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 36,
    color: '#1E293B', // Dark slate
    textAlign: 'center',
  },
  definitionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: '#475569', // Secondary slate
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  proverbText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1E293B', // Dark slate
    textAlign: 'center',
    lineHeight: 32,
  },
  spellingText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 34,
    color: '#1E293B', // Dark slate
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 40,
    width: '100%',
    gap: 32,
  },
  actionButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderBottomWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  feedbackPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF4B4B',
    padding: 24,
    paddingBottom: 40, // Account for safe area
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 100,
  },
  feedbackContent: {
    marginBottom: 24,
  },
  feedbackTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  feedbackSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    opacity: 0.95,
  },
  continueButtonText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    color: '#FF4B4B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  powerupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  powerupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  powerupCount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  powerupButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  powerupIcon: {
    fontSize: 20,
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EC4899',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  countText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  toastText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  hintDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34D399',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
