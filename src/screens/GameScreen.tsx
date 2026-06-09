import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { SwipeCard, CardSkinWrapper } from '../components/SwipeCard';
import { ScoreBar } from '../components/ScoreBar';
import { TimerBar, TimerBarRef } from '../components/TimerBar';
import { Stopwatch, StopwatchRef } from '../components/Stopwatch';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { PauseModal } from '../components/PauseModal';
import { BouncyButton } from '../components/BouncyButton';
import { straattaalData, StraattaalItem } from '../data/straattaalData';
import { dunglishData, DunglishItem } from '../data/dunglishData';
import { spellingData, SpellingItem } from '../data/spellingData';
import { dtData, DtItem } from '../data/dtData';
import { vanDaleData, VanDaleItem } from '../data/vanDaleData';
import { brandData, BrandItem } from '../data/brandData';
import { Colors, useAppTheme } from '../theme/colors';
import { statsStore, AppStats } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
import { soundManager } from '../audio/SoundManager';
import ConfettiCannon from 'react-native-confetti-cannon';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt' | 'vandale' | 'brand' };
  Result: { score: number; total: number; mode: string; rawMode: string; history?: { word: string; correct: boolean; explanation: string }[], timeMs?: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

// No progressive shuffle anymore, just fully random so the user doesn't get the same short words every time!
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function GameScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const { hardcoreMode, equippedCard, survivalMode, speedrunMode } = useSettingsStore();

  const theme = useAppTheme(mode);
  
  const timerRef = React.useRef<TimerBarRef>(null);
  const stopwatchRef = React.useRef<StopwatchRef>(null);

  const [data, setData] = useState<any[]>([]);

  const getItemId = useCallback((item: any) => {
    if (item.id) return item.id.toString();
    if (item.word) return item.word;
    if (item.text) return item.text;
    if (item.sentence) return item.sentence;
    return Math.random().toString();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isPanicking, setIsPanicking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shootConfetti, setShootConfetti] = useState(false);
  const [history, setHistory] = useState<{ word: string; correct: boolean; explanation: string }[]>([]);

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
    vandale: 'Dikke Van Dale',
    brand: 'Merknaam of Soortnaam',
  };

  React.useEffect(() => {
    async function initGame() {
      await statsStore.updateStreak(); // Track daily streak
      const currentStats = await statsStore.getStats();
      if (currentStats) {
        setStats(currentStats);
        // Ensure tutorial is shown first time
        if (!(currentStats.tutorialSeen as any)[mode]) {
          setShowTutorial(true);
          setIsPaused(true);
        }
      }

      // Load data with cache checking
      let rawData: any[] = [];
      switch (mode) {
        case 'straattaal': rawData = [...straattaalData]; break;
        case 'dunglish': rawData = [...dunglishData]; break;
        case 'spelling': rawData = [...spellingData]; break;
        case 'dt': rawData = dtData.map(item => ({
          ...item,
          isCorrect: Math.random() > 0.5,
        })); break;
        case 'vandale': rawData = [...vanDaleData]; break;
        case 'brand': rawData = [...brandData]; break;
      }

      const seenIds = currentStats?.seenHistory?.[mode] || [];
      
      const unseen = rawData.filter(item => !seenIds.includes(getItemId(item)));
      const seen = rawData.filter(item => seenIds.includes(getItemId(item)));

      let shuffled = [
        ...shuffleArray(unseen),
        ...shuffleArray(seen) // Fallback if unseen runs out
      ];

      if (speedrunMode) {
        setData(shuffled.slice(0, 50));
      } else {
        setData(shuffled.slice(0, 20));
      }
    }
    initGame();
    // Track sessions played
    statsStore.getStats().then(s => {
      s.sessionsPlayed = (s.sessionsPlayed ?? 0) + 1;
      statsStore.saveStats(s);
    });
  }, [mode, speedrunMode, getItemId]);

  const updateStats = async (currentCombo: number, earnedXp: number = 0, wasCorrect?: boolean) => {
    const currentStats = await statsStore.getStats();
    currentStats.totalSwipes += 1;
    if (wasCorrect === true)  currentStats.totalCorrect = (currentStats.totalCorrect ?? 0) + 1;
    if (wasCorrect === false) currentStats.totalWrong   = (currentStats.totalWrong   ?? 0) + 1;
    
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
    setActiveHint(null);

    if (gameOver) {
      navigation.replace('Result', {
        score,
        total: currentIndex,
        mode: modeLabels[mode],
        rawMode: mode,
        history,
        timeMs: speedrunMode ? stopwatchRef.current?.getTime() : undefined,
      });
      return;
    }

    if (!wasCorrect && isSpelling && !survivalMode && !speedrunMode) {
      setGameOver(true);
      navigation.replace('Result', {
        score,
        total: currentIndex,
        mode: modeLabels[mode],
        rawMode: mode,
        history,
      });
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= data.length) {
      navigation.replace('Result', {
        score: wasCorrect ? score + 1 : score,
        total: data.length,
        mode: modeLabels[mode],
        rawMode: mode,
        history,
        timeMs: speedrunMode ? stopwatchRef.current?.getTime() : undefined,
      });
    } else {
      setCurrentIndex(nextIndex);
      if (survivalMode) {
        if (wasCorrect) timerRef.current?.addTime(2000);
      } else if (isSpelling) {
        setTimerKey((k) => k + 1);
      }
    }
  }, [currentIndex, data.length, gameOver, isSpelling, mode, navigation, score, speedrunMode, survivalMode, history]);

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
      case 'vandale':
        correct = swipedRight === (item as VanDaleItem).inVanDale;
        break;
      case 'brand':
        correct = swipedRight === (item as BrandItem).isBrand;
        break;
    }

    let wordText = '';
    let explanationText = '';
    if (mode === 'straattaal') {
      wordText = (item as StraattaalItem).word;
      explanationText = (item as StraattaalItem).definition;
    } else if (mode === 'dunglish') {
      wordText = (item as DunglishItem).text;
      explanationText = (item as DunglishItem).explanation;
    } else if (mode === 'spelling') {
      wordText = (item as SpellingItem).text;
      explanationText = (item as SpellingItem).correction || 'Goed gespeld!';
    } else if (mode === 'dt') {
      wordText = (item as any).sentence.replace('___', (item as any).correctAnswer);
      explanationText = (item as any).explanation;
    } else if (mode === 'vandale') {
      wordText = (item as VanDaleItem).word;
      explanationText = (item as VanDaleItem).definition;
    } else if (mode === 'brand') {
      wordText = (item as BrandItem).word;
      explanationText = (item as BrandItem).explanation;
    }
    
    // Add to history
    setHistory(prev => [...prev, { word: wordText, correct, explanation: explanationText }]);

    // Mark as seen in cache
    statsStore.markAsSeen(mode, getItemId(item));

    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundManager.playCorrect(combo);
      setScore((s) => s + 1);
      setCombo((c) => {
        const newCombo = c + 1;
        updateStats(newCombo, 10 + (newCombo * 2), true); // Earn XP!
        
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
      updateStats(0, 0, false);

      if (survivalMode) {
        timerRef.current?.subtractTime(3000); // 3 seconds penalty!
        advanceGame(false);
        return;
      }
      
      // Show seamless feedback
      if (mode === 'straattaal') {
        const s = item as StraattaalItem;
        showFeedback(
          s.isReal ? 'ECHT! ❌' : 'NEP! ❌',
          `"${s.word}" is ${s.isReal ? 'echt bestaande straattaal' : 'AI-verzonnen nep-slang'}!\n\nBetekenis: ${s.definition}`
        );
      } else if (mode === 'dunglish') {
        const d = item as DunglishItem;
        showFeedback(
          d.isRealProverb ? 'ECHT! ❌' : 'NEP! ❌',
          `"${d.text}" is ${d.isRealProverb ? 'een echt spreekwoord' : 'een verzonnen spreekwoord'}!\n\nBetekenis: ${d.explanation}`
        );
      } else if (mode === 'spelling') {
        const sp = item as SpellingItem;
        if (sp.isCorrect) {
          showFeedback('GOED GESPELD! ❌', `"${sp.text}" is juist gespeld!`);
        } else {
          showFeedback('FOUT GESPELD! ❌', `"${sp.text}" is onjuist gespeld!\n\nDe juiste spelling is: ${sp.correction}`);
        }
      } else if (mode === 'dt') {
        const dt = item as any;
        showFeedback('FOUT! ❌', `Dit is onjuist!\n\nUitleg: ${dt.explanation}`);
      } else if (mode === 'vandale') {
        const vd = item as VanDaleItem;
        showFeedback(
          vd.inVanDale ? 'ECHT VAN DALE! ❌' : 'VERZONNEN! ❌',
          `"${vd.word}" staat ${vd.inVanDale ? 'wel degelijk' : 'niet'} in de Van Dale!\n\nBetekenis: ${vd.definition}`
        );
      } else if (mode === 'brand') {
        const b = item as BrandItem;
        showFeedback(
          b.isBrand ? 'MERKNAAM! ❌' : 'SOORTNAAM! ❌',
          `"${b.word}" is een ${b.isBrand ? 'beschermde merknaam' : 'soortnaam'}!\n\nUitleg: ${b.explanation}`
        );
      }

      if (hardcoreMode) {
        setLives((l) => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
      }
    }
  }, [currentIndex, data, gameOver, isSpelling, mode, advanceGame, showFeedback, hardcoreMode, combo, stats, survivalMode]);

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
      case 'vandale':
        correctDirection = (item as VanDaleItem).inVanDale ? 'right' : 'left';
        break;
      case 'brand':
        correctDirection = (item as BrandItem).isBrand ? 'right' : 'left';
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
    
    if (history.length === 0) {
      navigation.replace('Home');
      return;
    }

    navigation.replace('Result', {
      score,
      total: currentIndex,
      mode: modeLabels[mode],
      rawMode: mode,
      history,
    });
  }, [currentIndex, gameOver, isPaused, mode, navigation, score, history, modeLabels]);

  const handleClose = useCallback(() => {
    if (gameOver) return;
    setIsPaused(true);
  }, [gameOver]);

  const handleQuit = useCallback(() => {
    setGameOver(true);
    setIsPaused(false);
    
    if (history.length === 0) {
      navigation.replace('Home');
      return;
    }

    navigation.replace('Result', {
      score,
      total: currentIndex,
      mode: modeLabels[mode],
      rawMode: mode,
      history,
    });
  }, [currentIndex, mode, navigation, score, history, modeLabels]);

  const handleDismissTutorial = async () => {
    setShowTutorial(false);
    setIsPaused(false);
    if (stats) {
      const newStats = {
        ...stats,
        tutorialSeen: {
          ...stats.tutorialSeen,
          [mode]: true,
        }
      };
      await statsStore.saveStats(newStats);
      setStats(newStats);
    }
  };

  const speakWord = useCallback((text: string, lang: string = 'nl-NL') => {
    Speech.stop();
    Speech.speak(text, { language: lang, rate: 0.9 });
  }, []);

  const currentItem = data[currentIndex];
  const nextItem = currentIndex + 1 < data.length ? data[currentIndex + 1] : null;

  let leftLabel = 'FOUT ✗';
  let rightLabel = 'GOED ✓';
  
  if (mode === 'brand') {
    leftLabel = 'SOORT ✗';
    rightLabel = 'MERK ✓';
  } else if (mode === 'straattaal') {
    leftLabel = 'VERZONNEN ✗';
    rightLabel = 'ECHT ✓';
  } else if (mode === 'vandale') {
    leftLabel = 'ONZIN ✗';
    rightLabel = 'VAN DALE ✓';
  } else if (mode === 'dunglish') {
    leftLabel = 'NEP ✗';
    rightLabel = 'ECHT ✓';
  }

  const renderCardContent = (item: typeof data[number]) => {
    switch (mode) {
      case 'straattaal': {
        const s = item as StraattaalItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Echt straattaal of AI-verzonnen?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.wordText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>{s.word}</Text>
              <TouchableOpacity onPress={() => speakWord(s.word)} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.definitionText, { color: theme.cardTextSecondary }]}>"{s.definition}"</Text>
          </View>
        );
      }
      case 'dunglish': {
        const d = item as DunglishItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Echt Nederlands spreekwoord?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.proverbText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>"{d.text}"</Text>
              <TouchableOpacity onPress={() => speakWord(d.text, 'en-US')} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
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
              <Text style={[styles.spellingText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>{sp.text}</Text>
              <TouchableOpacity onPress={() => speakWord(sp.text)} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
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
          </View>
        );
      }
      case 'vandale': {
        const vd = item as VanDaleItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Staat dit in de Van Dale?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.wordText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>{vd.word}</Text>
              <TouchableOpacity onPress={() => speakWord(vd.word)} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      case 'brand': {
        const b = item as BrandItem;
        return (
          <View style={styles.cardContent}>
            <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Merknaam of soortnaam?</Text>
            <View style={styles.wordRow}>
              <Text style={[styles.wordText, { color: theme.cardTextPrimary }]}>{b.word}</Text>
              <TouchableOpacity onPress={() => speakWord(b.word)} style={styles.speakButton}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
  };

  return (
    <GradientBackground>
      {showTutorial && <TutorialOverlay mode={mode} onDismiss={handleDismissTutorial} />}
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
              combo={combo}
              mode={modeLabels[mode]}
            />
          </View>
        </View>

        {speedrunMode ? (
          <Stopwatch ref={stopwatchRef} running={!isPaused && !gameOver && !showTutorial} />
        ) : (isSpelling || survivalMode) ? (
          <TimerBar
            ref={timerRef}
            duration={survivalMode ? 15000 : 1500}
            running={!isPaused && !gameOver && !showTutorial}
            onTimeUp={handleTimeUp}
            onPanicChange={setIsPanicking}
            resetKey={survivalMode ? undefined : timerKey}
          />
        ) : null}

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
              leftLabel={leftLabel}
              rightLabel={rightLabel}
              combo={combo}
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
            <>
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
                <Text style={styles.actionButtonText} numberOfLines={1} adjustsFontSizeToFit>{leftLabel}</Text>
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
                <Text style={styles.actionButtonText} numberOfLines={1} adjustsFontSizeToFit>{rightLabel}</Text>
                {activeHint === 'right' && <View style={styles.hintDot} />}
              </BouncyButton>
            </>
          </Animated.View>
        )}
      </SafeAreaView>

      {showTutorial && (
        <TutorialOverlay
          onDismiss={handleDismissTutorial}
          mode={mode}
        />
      )}

      {feedbackInfo && (
        <Animated.View 
          entering={SlideInDown.duration(300)} 
          exiting={SlideOutDown.duration(250)}
          style={styles.feedbackPanel}
        >
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>{feedbackInfo.title}</Text>
            <Text style={styles.feedbackSubtitle}>{feedbackInfo.subtitle}</Text>
          </View>
          <BouncyButton
            title={gameOver || isSpelling ? "Bekijk Resultaten" : "Doorgaan"}
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
        visible={isPaused && !showTutorial}
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
  actionButtonText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
    color: '#FFFFFF',
    textTransform: 'uppercase',
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
