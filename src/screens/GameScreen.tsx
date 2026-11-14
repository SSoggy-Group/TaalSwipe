import React, { useState, useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from '../platform/haptics';
import * as Speech from '../platform/speech';
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
import { dtData } from '../data/dtData';
import { vanDaleData, VanDaleItem } from '../data/vanDaleData';
import { brandData, BrandItem } from '../data/brandData';
import { useAppTheme, RADIUS } from '../theme/colors';
import { statsStore, AppStats } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
import { soundManager } from '../audio/SoundManager';
import { useKeyboardNavigation, useWakeLock } from '../hooks/usePlatform';

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

const HEART_KEYS = ['heart-0', 'heart-1', 'heart-2'] as const;

interface CardContentProps {
  readonly mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt' | 'vandale' | 'brand';
  readonly item: any;
  readonly theme: any;
  readonly speakWord: (text: string, lang?: string) => void;
}

const CardContent = React.memo(function CardContent({ mode, item, theme, speakWord }: CardContentProps) {
  if (!item) return null;
  switch (mode) {
    case 'straattaal': {
      const s = item as StraattaalItem;
      return (
        <View style={styles.cardContent}>
          <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Echt of verzonnen?</Text>
          <View style={styles.wordRow}>
            <Text style={[styles.wordText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>{s.word}</Text>
            <TouchableOpacity onPress={() => speakWord(s.word)} style={[styles.speakButton, { backgroundColor: theme.accentSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Woord uitspreken"
            >
              <Ionicons name="volume-high" size={18} color={theme.accent} />
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
          <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Echt spreekwoord?</Text>
          <View style={styles.wordRow}>
            <Text style={[styles.proverbText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>"{d.text}"</Text>
            <TouchableOpacity onPress={() => speakWord(d.text, 'en-US')} style={[styles.speakButton, { backgroundColor: theme.accentSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Woord uitspreken"
            >
              <Ionicons name="volume-high" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    case 'spelling': {
      const sp = item as SpellingItem;
      return (
        <View style={styles.cardContent}>
          <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Goed gespeld?</Text>
          <View style={styles.wordRow}>
            <Text style={[styles.spellingText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>{sp.text}</Text>
            <TouchableOpacity onPress={() => speakWord(sp.text)} style={[styles.speakButton, { backgroundColor: theme.accentSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Woord uitspreken"
            >
              <Ionicons name="volume-high" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    case 'dt': {
      const dt = item;
      const displayedAnswer = dt.isCorrect ? dt.correctAnswer : dt.wrongAnswer;
      const parts = dt.sentence.split('___');
      
      return (
        <View style={styles.cardContent}>
          <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Juiste vorm?</Text>
          <View style={[styles.wordRow, { paddingHorizontal: 16 }]}>
            <Text style={[styles.spellingText, { fontSize: 24, textAlign: 'center', lineHeight: 34, color: theme.cardTextPrimary }]}>
              {parts[0]}
              <Text style={{ color: theme.accent, fontFamily: 'Inter_700Bold' }}>
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
          <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>In de Van Dale?</Text>
          <View style={styles.wordRow}>
            <Text style={[styles.wordText, { color: theme.cardTextPrimary, flexShrink: 1, textAlign: 'center' }]}>{vd.word}</Text>
            <TouchableOpacity onPress={() => speakWord(vd.word)} style={[styles.speakButton, { backgroundColor: theme.accentSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Woord uitspreken"
            >
              <Ionicons name="volume-high" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    case 'brand': {
      const b = item as BrandItem;
      return (
        <View style={styles.cardContent}>
          <Text style={[styles.instructionText, { color: theme.cardTextSecondary }]}>Merk of soort?</Text>
          <View style={styles.wordRow}>
            <Text style={[styles.wordText, { color: theme.cardTextPrimary }]}>{b.word}</Text>
            <TouchableOpacity onPress={() => speakWord(b.word)} style={[styles.speakButton, { backgroundColor: theme.accentSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Woord uitspreken"
            >
              <Ionicons name="volume-high" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    default:
      return null;
  }
});

function checkIsCorrect(item: any, mode: string, swipedRight: boolean): boolean {
  if (!item) return false;
  switch (mode) {
    case 'straattaal':
      return swipedRight === (item as StraattaalItem).isReal;
    case 'dunglish':
      return swipedRight === (item as DunglishItem).isRealProverb;
    case 'spelling':
      return swipedRight === (item as SpellingItem).isCorrect;
    case 'dt':
      return swipedRight === item.isCorrect;
    case 'vandale':
      return swipedRight === (item as VanDaleItem).inVanDale;
    case 'brand':
      return swipedRight === (item as BrandItem).isBrand;
    default:
      return false;
  }
}

function getItemDetails(item: any, mode: string): { wordText: string; explanationText: string } {
  if (!item) return { wordText: '', explanationText: '' };
  switch (mode) {
    case 'straattaal': {
      const s = item as StraattaalItem;
      return { wordText: s.word, explanationText: s.definition };
    }
    case 'dunglish': {
      const d = item as DunglishItem;
      return { wordText: d.text, explanationText: d.explanation };
    }
    case 'spelling': {
      const sp = item as SpellingItem;
      return { wordText: sp.text, explanationText: sp.correction || 'Goed gespeld!' };
    }
    case 'dt': {
      return {
        wordText: item.sentence.replace('___', item.correctAnswer),
        explanationText: item.explanation,
      };
    }
    case 'vandale': {
      const vd = item as VanDaleItem;
      return { wordText: vd.word, explanationText: vd.definition };
    }
    case 'brand': {
      const b = item as BrandItem;
      return { wordText: b.word, explanationText: b.explanation };
    }
    default:
      return { wordText: '', explanationText: '' };
  }
}

function getStraattaalFeedback(s: StraattaalItem) {
  return {
    title: s.isReal ? 'Echt' : 'Verzonnen',
    message: s.isReal
      ? `"${s.word}" bestaat. ${s.definition}`
      : `"${s.word}" bestaat niet.`,
  };
}

function getDunglishFeedback(d: DunglishItem) {
  return {
    title: d.isRealProverb ? 'Echt' : 'Verzonnen',
    message: d.isRealProverb
      ? `Letterlijk vertaald: ${d.explanation}`
      : `Niet echt. ${d.explanation}`,
  };
}

function getSpellingFeedback(sp: SpellingItem) {
  return {
    title: sp.isCorrect ? 'Goed' : 'Fout',
    message: sp.isCorrect
      ? `"${sp.text}" is goed gespeld.`
      : `"${sp.text}" moet zijn: ${sp.correction}`,
  };
}

function getVanDaleFeedback(vd: VanDaleItem) {
  return {
    title: vd.inVanDale ? 'Staat erin' : 'Staat er niet in',
    message: vd.inVanDale
      ? `"${vd.word}" staat in de Van Dale. ${vd.definition}`
      : `"${vd.word}" staat niet in de Van Dale.`,
  };
}

function getBrandFeedback(b: BrandItem) {
  return {
    title: b.isBrand ? 'Merknaam' : 'Soortnaam',
    message: `"${b.word}" is een ${b.isBrand ? 'merknaam' : 'soortnaam'}. ${b.explanation}`,
  };
}

function getFeedbackTitleAndMessage(item: any, mode: string): { title: string; message: string } {
  if (!item) return { title: 'Fout', message: '' };
  switch (mode) {
    case 'straattaal':
      return getStraattaalFeedback(item);
    case 'dunglish':
      return getDunglishFeedback(item);
    case 'spelling':
      return getSpellingFeedback(item);
    case 'dt':
      return {
        title: 'Foute vorm',
        message: item.explanation,
      };
    case 'vandale':
      return getVanDaleFeedback(item);
    case 'brand':
      return getBrandFeedback(item);
    default:
      return { title: 'Fout', message: '' };
  }
}

const modeLabels: Record<string, string> = {
  straattaal: 'Straattaal of AI?',
  dunglish: 'Steenkolenengels',
  spelling: 'Speed-spelling',
  dt: 'D/t-grammatica',
  vandale: 'Dikke Van Dale',
  brand: 'Merknaam of Soortnaam',
};

function getItemId(item: any): string {
  if (item.id) return item.id.toString();
  if (item.word) return item.word;
  if (item.text) return item.text;
  if (item.sentence) return item.sentence;
  return Math.random().toString();
}function speakWord(text: string, lang: string = 'nl-NL') {
  Speech.stop();
  Speech.speak(text, { language: lang, rate: 0.9 });
}

export function GameScreen({ navigation, route }: Readonly<Props>) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const { mode } = route.params;
  const { hardcoreMode, equippedCard, survivalMode, speedrunMode } = useSettingsStore();

  const theme = useAppTheme(mode);
  
  const timerRef = React.useRef<TimerBarRef>(null);
  const stopwatchRef = React.useRef<StopwatchRef>(null);

  const sessionXpMultiplier = React.useRef(1);

  const [data, setData] = useState<any[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [, setIsPanicking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState<{ word: string; correct: boolean; explanation: string }[]>([]);

  const [lives, setLives] = useState(hardcoreMode ? 3 : 0);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [showShieldAlert, setShowShieldAlert] = useState(false);
  const [showTimeSlowAlert, setShowTimeSlowAlert] = useState(false);
  const [activeHint, setActiveHint] = useState<'left' | 'right' | null>(null);

  const isSpelling = mode === 'spelling';

  // Web-native hooks - must be after state declarations
  const { request: requestWakeLock } = useWakeLock(!gameOver && !isPaused && !showTutorial);


  React.useEffect(() => {
    async function initGame() {
      await statsStore.updateStreak(); // Track daily streak
      const currentStats = await statsStore.getStats();
      if (currentStats) {
        sessionXpMultiplier.current = currentStats.doubleXpBonuses > 0 ? 2 : 1;
        if (currentStats.doubleXpBonuses > 0) currentStats.doubleXpBonuses -= 1;
        currentStats.sessionsPlayed = (currentStats.sessionsPlayed ?? 0) + 1;
        await statsStore.saveStats(currentStats);
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
  }, [mode, speedrunMode]);

  const updateStats = async (currentCombo: number, earnedXp: number = 0, wasCorrect?: boolean) => {
    const currentStats = await statsStore.getStats();
    currentStats.totalSwipes += 1;
    if (wasCorrect === true)  currentStats.totalCorrect = (currentStats.totalCorrect ?? 0) + 1;
    if (wasCorrect === false) currentStats.totalWrong   = (currentStats.totalWrong   ?? 0) + 1;
    
    const multiplier = currentStats.xpMultiplier || 1;
    const finalXp = Math.round(earnedXp * multiplier * sessionXpMultiplier.current);
    
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

    const navigateToResult = (finalScore: number, finalTotal: number) => {
      navigation.replace('Result', {
        score: finalScore,
        total: finalTotal,
        mode: modeLabels[mode],
        rawMode: mode,
        history,
        timeMs: speedrunMode ? stopwatchRef.current?.getTime() : undefined,
      });
    };

    if (gameOver) {
      // currentIndex has not advanced yet, but the terminal wrong answer counts.
      navigateToResult(score, currentIndex + 1);
      return;
    }

    if (!wasCorrect && isSpelling && !survivalMode && !speedrunMode) {
      setGameOver(true);
      navigateToResult(score, currentIndex + 1);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= data.length) {
      navigateToResult(wasCorrect ? score + 1 : score, data.length);
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

  const handleCorrectAnswer = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    soundManager.playCorrect(combo);
    setScore((s) => s + 1);
    setCombo((c) => {
      const newCombo = c + 1;
      updateStats(newCombo, 10 + (newCombo * 2), true); // Earn XP!
      return newCombo;
    });
    advanceGame(true);
  }, [combo, advanceGame, updateStats]);

  const handleIncorrectAnswer = useCallback((item: any) => {
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
    const feedback = getFeedbackTitleAndMessage(item, mode);
    showFeedback(feedback.title, feedback.message);

    if (hardcoreMode) {
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
    }
  }, [stats, advanceGame, survivalMode, mode, showFeedback, hardcoreMode, updateStats]);

  const lastAnswerAtRef = useRef(0);
  const lastContinueAtRef = useRef(0);

  const handleAnswer = useCallback((swipedRight: boolean) => {
    // Block answers while feedback, a pause, or the tutorial is open, and
    // collapse rapid duplicate inputs (key repeat, double taps) into one.
    if (gameOver || isPaused || showTutorial || feedbackInfo) return;
    if (Date.now() - lastAnswerAtRef.current < 180) return;

    const item = data[currentIndex];
    if (!item) return;
    lastAnswerAtRef.current = Date.now();

    const correct = checkIsCorrect(item, mode, swipedRight);
    const { wordText, explanationText } = getItemDetails(item, mode);
    
    // Add to history
    setHistory(prev => [...prev, { word: wordText, correct, explanation: explanationText }]);

    // Mark as seen in cache
    statsStore.markAsSeen(mode, getItemId(item));

    if (correct) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer(item);
    }
  }, [currentIndex, data, gameOver, isPaused, showTutorial, feedbackInfo, mode, handleCorrectAnswer, handleIncorrectAnswer]);

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
    const correctDirection: 'left' | 'right' = checkIsCorrect(item, mode, true) ? 'right' : 'left';

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
  
  const handleContinue = useCallback(() => {
    if (!feedbackInfo) return;
    if (Date.now() - lastContinueAtRef.current < 250) return;
    lastContinueAtRef.current = Date.now();
    setFeedbackInfo(null);
    advanceGame(false);
  }, [feedbackInfo, advanceGame]);

  // Custom keyboard handlers for game (must be after handler definitions)
  const keyboardHandlers = React.useMemo(() => ({
    ArrowLeft: (event: KeyboardEvent) => { if (!event.repeat) handleSwipeLeft(); },
    ArrowRight: (event: KeyboardEvent) => { if (!event.repeat) handleSwipeRight(); },
    Escape: (event: KeyboardEvent) => { if (!event.repeat) handleClose(); },
    Enter: (event: KeyboardEvent) => { if (!event.repeat) handleContinue(); },
    ' ': (event: KeyboardEvent) => { if (!event.repeat) handleContinue(); },
  }), [handleSwipeLeft, handleSwipeRight, handleClose, handleContinue]);
  
  useKeyboardNavigation(
    !isPaused && !showTutorial && (!gameOver || Boolean(feedbackInfo)),
    keyboardHandlers,
  );

  const currentItem = data[currentIndex];
  const nextItem = currentIndex + 1 < data.length ? data[currentIndex + 1] : null;

  // Context menu for Tauri desktop app (right-click to copy/search words)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    if (!(globalThis as any).__TAURI_INTERNALS__) return;

    const handleContextMenu = async (event: MouseEvent) => {
      if (gameOver || isPaused || !currentItem) return;
      event.preventDefault();
      
      const { wordText, explanationText } = getItemDetails(currentItem, mode);
      if (!wordText) return;

      try {
        const { Menu, MenuItem } = await import('@tauri-apps/api/menu');
        
        const copyItem = await MenuItem.new({
          text: `Kopieer: "${wordText}"`,
          action: () => {
            Clipboard.setStringAsync(wordText);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        });
        
        const searchItem = await MenuItem.new({
          text: 'Zoek op Google',
          action: () => {
            const url = `https://www.google.com/search?q=${encodeURIComponent(wordText)}`;
            window.open(url, '_blank');
          }
        });
        
        const menu = await Menu.new({ items: [copyItem, searchItem] });
        await menu.popup();
      } catch (err) {
        console.warn('Failed to show Tauri context menu', err);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [gameOver, isPaused, currentItem, mode]);

  let leftLabel = 'Fout';
  let rightLabel = 'Goed';

  if (mode === 'brand') {
    leftLabel = 'Soortnaam';
    rightLabel = 'Merknaam';
  } else if (mode === 'straattaal') {
    leftLabel = 'Verzonnen';
    rightLabel = 'Echt';
  } else if (mode === 'vandale') {
    leftLabel = 'Onzin';
    rightLabel = 'Van Dale';
  } else if (mode === 'dunglish') {
    leftLabel = 'Nep';
    rightLabel = 'Echt';
  }

  const renderTimerOrStopwatch = () => {
    const isRunning = !isPaused && !gameOver && !showTutorial;
    if (speedrunMode) {
      return <Stopwatch ref={stopwatchRef} running={isRunning} />;
    }
    if (isSpelling || survivalMode) {
      let spellingDuration = 1500;
      if (isSpelling) {
        const currentItem = data[currentIndex];
        if (currentItem) {
          const { wordText } = getItemDetails(currentItem, mode);
          // Scale duration based on word length (base 2.0s, +100ms per letter)
          spellingDuration = 2000 + (wordText?.length || 5) * 100;
        }
      }

      return (
        <TimerBar
          ref={timerRef}
          duration={survivalMode ? 15000 : spellingDuration}
          running={isRunning}
          onTimeUp={handleTimeUp}
          onPanicChange={setIsPanicking}
          resetKey={survivalMode ? undefined : timerKey}
        />
      );
    }
    return null;
  };

  return (
    <GradientBackground>
      <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopGameShell]} edges={['top']}>
        {hardcoreMode && (
          <Animated.View entering={FadeInDown} style={styles.heartsContainer}>
            {HEART_KEYS.map((key, i) => (
              <Ionicons
                key={key}
                name={i < lives ? 'heart' : 'heart-outline'}
                size={20}
                color={i < lives ? theme.incorrect : theme.inkMuted}
              />
            ))}
          </Animated.View>
        )}

        <View style={[styles.headerContainer, isDesktop && styles.desktopHeaderContainer]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Pauzeren"
          >
            <Ionicons name="close" size={22} color={theme.inkSecondary} />
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

        {renderTimerOrStopwatch()}

        {isDesktop && (
          <View
            style={[
              styles.desktopHotkeyStrip,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.hotkeyText, { color: theme.inkSecondary }]}>
              <Text style={[styles.hotkeyCap, { color: theme.ink }]}>←</Text> {leftLabel}
            </Text>
            <Text style={[styles.hotkeyDivider, { color: theme.border }]}>·</Text>
            <Text style={[styles.hotkeyText, { color: theme.inkSecondary }]}>
              <Text style={[styles.hotkeyCap, { color: theme.ink }]}>→</Text> {rightLabel}
            </Text>
            <Text style={[styles.hotkeyDivider, { color: theme.border }]}>·</Text>
            <Text style={[styles.hotkeyText, { color: theme.inkSecondary }]}>
              <Text style={[styles.hotkeyCap, { color: theme.ink }]}>Esc</Text> pauze
            </Text>
          </View>
        )}

        <View style={[styles.cardStack, isDesktop && styles.desktopCardStack]}>
          {/* Next card preview (behind) */}
          {nextItem && (
            <View
              style={[styles.previewCard, { transform: [{ scale: 0.94 }, { translateY: 12 }], width: '88%' }]}
              pointerEvents="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              aria-hidden
            >
              <CardSkinWrapper equippedCard={equippedCard} theme={theme}>
                <View style={styles.previewContent}>
                  <CardContent
                    mode={mode}
                    item={nextItem}
                    theme={theme}
                    speakWord={speakWord}
                  />
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
              active={!gameOver && !isPaused && !showTutorial && !feedbackInfo}
              leftLabel={leftLabel}
              rightLabel={rightLabel}
              combo={combo}
            >
              <CardContent
                mode={mode}
                item={currentItem}
                theme={theme}
                speakWord={speakWord}
              />
            </SwipeCard>
          )}
        </View>

        {/* Power-up HUD */}
        {!gameOver && currentItem && !showTutorial && !feedbackInfo && stats && (
          <View style={styles.powerupRow}>
            <View
              style={[
                styles.powerupBadge,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: stats.shields > 0 ? 1 : 0.45,
                },
              ]}
            >
              <Ionicons name="shield-checkmark-outline" size={15} color={theme.inkSecondary} />
              <Text style={[styles.powerupCount, { color: theme.inkSecondary }]}>{stats.shields}</Text>
            </View>

            {isSpelling && (
              <TouchableOpacity
                onPress={handleUseTimeSlow}
                disabled={stats.timeSlows <= 0}
                style={[
                  styles.powerupButton,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  stats.timeSlows <= 0 && styles.powerupDisabled,
                ]}
                testID="powerup-button"
                accessible
                accessibilityRole="button"
                accessibilityLabel="Tijd vertragen"
              >
                <Ionicons name="timer-outline" size={18} color={theme.inkSecondary} />
                <View
                  style={[
                    styles.countBadge,
                    { backgroundColor: theme.surfaceMuted, borderColor: theme.surface },
                  ]}
                >
                  <Text style={[styles.countText, { color: theme.ink }]}>{stats.timeSlows}</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleUseHint}
              disabled={stats.hints <= 0 || activeHint !== null}
              style={[
                styles.powerupButton,
                { backgroundColor: theme.surface, borderColor: theme.border },
                (stats.hints <= 0 || activeHint !== null) && styles.powerupDisabled,
              ]}
              testID="powerup-button"
              accessible
              accessibilityRole="button"
              accessibilityLabel="Hint gebruiken"
            >
              <Ionicons name="search-outline" size={18} color={theme.inkSecondary} />
              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: theme.surfaceMuted, borderColor: theme.surface },
                ]}
              >
                <Text style={[styles.countText, { color: theme.ink }]}>{stats.hints}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Swipe actions */}
        {!gameOver && currentItem && !showTutorial && !feedbackInfo && (
          <Animated.View
            entering={FadeInDown.delay(120).duration(260)}
            style={[styles.actionRow, isDesktop && styles.desktopActionRow]}
          >
            <Pressable
              onPress={handleSwipeLeft}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: pressed ? theme.incorrectBg : theme.surface,
                  borderColor: activeHint === 'left' ? theme.incorrect : theme.border,
                  borderWidth: activeHint === 'left' ? 2 : 1,
                },
              ]}
              testID="action-button"
              accessibilityRole="button"
              accessibilityLabel={`${leftLabel}, swipe naar links`}
            >
              <Ionicons name="arrow-back" size={18} color={theme.incorrect} />
              <Text style={[styles.actionButtonText, { color: theme.incorrect }]} numberOfLines={1}>
                {leftLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSwipeRight}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: pressed ? theme.correct : theme.correct,
                  borderColor: activeHint === 'right' ? theme.ink : theme.correct,
                  borderWidth: activeHint === 'right' ? 2 : 1,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
              testID="action-button"
              accessibilityRole="button"
              accessibilityLabel={`${rightLabel}, swipe naar rechts`}
            >
              <Text
                style={[styles.actionButtonText, { color: theme.isDark ? '#0F1012' : '#FFFFFF' }]}
                numberOfLines={1}
              >
                {rightLabel}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={theme.isDark ? '#0F1012' : '#FFFFFF'}
              />
            </Pressable>
          </Animated.View>
        )}
      </SafeAreaView>

      {showTutorial && <TutorialOverlay mode={mode} onDismiss={handleDismissTutorial} />}

      {feedbackInfo && (
        <Animated.View
          entering={SlideInDown.duration(240)}
          exiting={SlideOutDown.duration(180)}
          style={[
            styles.feedbackPanel,
            { backgroundColor: theme.surface, borderColor: theme.border },
            isDesktop && styles.desktopFeedbackPanel,
          ]}
        >
          <View style={styles.feedbackHeader}>
            <View style={[styles.feedbackIcon, { backgroundColor: theme.incorrectBg }]}>
              <Ionicons name="close" size={16} color={theme.incorrect} />
            </View>
            <View style={styles.feedbackHeading}>
              <Text style={[styles.feedbackKicker, { color: theme.incorrect }]}>Fout</Text>
              <Text style={[styles.feedbackTitle, { color: theme.ink }]}>{feedbackInfo.title}</Text>
            </View>
          </View>

          <Text style={[styles.feedbackSubtitle, { color: theme.inkSecondary }]}>
            {feedbackInfo.subtitle}
          </Text>

          <BouncyButton
            title={gameOver ? 'Bekijk resultaten' : 'Doorgaan'}
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </Animated.View>
      )}

      <PauseModal
        visible={isPaused && !showTutorial}
        onResume={() => setIsPaused(false)}
        onQuit={handleQuit}
        score={score}
      />

      {showShieldAlert && (
        <Animated.View
          entering={FadeInDown.duration(240)}
          exiting={FadeOut.duration(200)}
          style={styles.toastContainer}
        >
          <View style={[styles.toast, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="shield-checkmark-outline" size={15} color={theme.inkSecondary} />
            <Text style={[styles.toastText, { color: theme.ink }]}>
              Schild gebruikt, fout voorkomen
            </Text>
          </View>
        </Animated.View>
      )}

      {showTimeSlowAlert && (
        <Animated.View
          entering={FadeInDown.duration(240)}
          exiting={FadeOut.duration(200)}
          style={styles.toastContainer}
        >
          <View style={[styles.toast, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="timer-outline" size={15} color={theme.inkSecondary} />
            <Text style={[styles.toastText, { color: theme.ink }]}>
              Tijd gereset, 1,5 seconde extra
            </Text>
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
  desktopGameShell: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  heartsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  desktopHeaderContainer: {
    paddingTop: 12,
    paddingHorizontal: 0,
  },
  closeButton: {
    padding: 8,
    marginRight: -6,
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
  desktopCardStack: {
    minHeight: 420,
    maxHeight: 540,
  },
  desktopHotkeyStrip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  hotkeyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  hotkeyCap: {
    fontFamily: 'Inter_600SemiBold',
  },
  hotkeyDivider: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  previewCard: {
    position: 'absolute',
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    opacity: 0.45,
  },
  previewContent: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.1,
    marginBottom: 4,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  speakButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 34,
    letterSpacing: -1,
    textAlign: 'center',
  },
  definitionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  proverbText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
  },
  spellingText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    letterSpacing: -0.8,
    textAlign: 'center',
    lineHeight: 40,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 20,
    width: '100%',
    gap: 10,
  },
  desktopActionRow: {
    justifyContent: 'center',
    paddingBottom: 20,
    maxWidth: 460,
    alignSelf: 'center',
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: RADIUS.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  actionButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  feedbackPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 36,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 100,
  },
  desktopFeedbackPanel: {
    left: '50%',
    right: undefined,
    width: 520,
    transform: [{ translateX: -260 }],
    bottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    paddingBottom: 24,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  feedbackIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.control,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  feedbackHeading: {
    flex: 1,
  },
  feedbackKicker: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.1,
    marginBottom: 2,
  },
  feedbackTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  feedbackSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  continueButton: {
    width: '100%',
  },
  powerupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  powerupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 40,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    gap: 6,
  },
  powerupCount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  powerupButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  powerupDisabled: {
    opacity: 0.4,
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 17,
    height: 17,
    borderRadius: RADIUS.pill,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 3,
  },
  countText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  toastContainer: {
    position: 'absolute',
    top: 88,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.control,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  toastText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
});
