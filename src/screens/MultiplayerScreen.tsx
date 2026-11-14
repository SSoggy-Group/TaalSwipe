import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from '../platform/haptics';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useAppTheme, RADIUS } from '../theme/colors';
import { soundManager } from '../audio/SoundManager';
import { GradientBackground } from '../components/GradientBackground';
import { SwipeCard } from '../components/SwipeCard';
import { BouncyButton } from '../components/BouncyButton';
import { PremiumTopBar } from '../components/PremiumTopBar';
import { Ionicons } from '@expo/vector-icons';

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
type IconName = React.ComponentProps<typeof Ionicons>['name'];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface MultiplayerItem {
  text: string;
  isCorrect: boolean;
  mode: string;
  leftLabel: string;
  rightLabel: string;
  explanation: string;
  subText?: string;
}

const MODES_CONFIG: readonly { key: string; name: string; icon: IconName }[] = [
  { key: 'spelling', name: 'Spelling', icon: 'text-outline' },
  { key: 'dt', name: 'D/t-spelling', icon: 'create-outline' },
  { key: 'straattaal', name: 'Straattaal', icon: 'chatbubbles-outline' },
  { key: 'dunglish', name: 'Dunglish', icon: 'globe-outline' },
  { key: 'vandale', name: 'Van Dale', icon: 'book-outline' },
  { key: 'brand', name: 'Merken', icon: 'pricetag-outline' },
];

const TARGET_SCORE = 15;
const PENALTY_MS = 1200; // 1.2 seconds lockout

export function MultiplayerScreen({ navigation }: Readonly<Props>) {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [gameStarted, setGameStarted] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(true);
  const [enabledModes, setEnabledModes] = useState<Record<string, boolean>>({
    spelling: true,
    dt: true,
    straattaal: true,
    dunglish: true,
    vandale: true,
    brand: true,
  });

  // Independent shuffled data lists for both players
  const [p1Data, setP1Data] = useState<MultiplayerItem[]>([]);
  const [p2Data, setP2Data] = useState<MultiplayerItem[]>([]);

  const [p1Index, setP1Index] = useState(0);
  const [p2Index, setP2Index] = useState(0);

  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const [p1Penalty, setP1Penalty] = useState(false);
  const [p2Penalty, setP2Penalty] = useState(false);

  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    if (gameStarted && p1Score >= TARGET_SCORE && winner === null) setWinner(1);
    if (gameStarted && p2Score >= TARGET_SCORE && winner === null) setWinner(2);
  }, [p1Score, p2Score, winner, gameStarted]);

  const toggleMode = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnabledModes((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const values = Object.values(next);
      if (values.filter(Boolean).length === 0) {
        return prev;
      }
      return next;
    });
  };

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const selectedData: MultiplayerItem[] = [];
    if (enabledModes.spelling) {
      selectedData.push(...spellingData.map((x) => {
        let spellingExplanation = 'Dit woord is onjuist gespeld.';
        if (x.isCorrect) {
          spellingExplanation = 'Dit woord is correct gespeld.';
        } else if (x.correction) {
          spellingExplanation = `Fout gespeld. Het moet zijn: "${x.correction}"`;
        }
        return {
          text: x.text,
          isCorrect: x.isCorrect,
          mode: 'Spelling',
          leftLabel: 'Fout',
          rightLabel: 'Goed',
          explanation: spellingExplanation,
        };
      }));
    }
    if (enabledModes.dt) {
      selectedData.push(...dtData.map((x) => {
        const isCorrect = Math.random() > 0.5;
        const displayedAnswer = isCorrect ? x.correctAnswer : x.wrongAnswer;
        const formattedText = x.sentence.replace('___', displayedAnswer);
        return {
          text: formattedText,
          isCorrect,
          mode: 'D/t',
          leftLabel: 'Fout',
          rightLabel: 'Goed',
          explanation: `Werkwoord: ${x.verb}.\n${x.explanation}`,
          subText: `Werkwoord: ${x.verb}`,
        };
      }));
    }
    if (enabledModes.straattaal) {
      selectedData.push(...straattaalData.map((x) => ({
        text: x.word,
        isCorrect: x.isReal,
        mode: 'Straattaal',
        leftLabel: 'Verzonnen',
        rightLabel: 'Echt',
        explanation: x.isReal
          ? `Bestaat echt. Betekenis: "${x.definition}"`
          : `Verzonnen door AI. Zou betekenen: "${x.definition}"`,
        subText: `"${x.definition}"`,
      })));
    }
    if (enabledModes.dunglish) {
      selectedData.push(...dunglishData.map((x) => ({
        text: x.text,
        isCorrect: x.isRealProverb,
        mode: 'Dunglish',
        leftLabel: 'Nep',
        rightLabel: 'Echt',
        explanation: x.isRealProverb ? x.explanation : `Geen echt spreekwoord. ${x.explanation}`,
      })));
    }
    if (enabledModes.vandale) {
      selectedData.push(...vanDaleData.map((x) => ({
        text: x.word,
        isCorrect: x.inVanDale,
        mode: 'Van Dale',
        leftLabel: 'Onzin',
        rightLabel: 'Van Dale',
        explanation: x.inVanDale
          ? `Staat in de Dikke Van Dale. "${x.definition}"`
          : `Staat niet in de Dikke Van Dale. "${x.definition}"`,
        subText: `"${x.definition}"`,
      })));
    }
    if (enabledModes.brand) {
      selectedData.push(...brandData.map((x) => ({
        text: x.word,
        isCorrect: x.isBrand,
        mode: 'Merken',
        leftLabel: 'Soortnaam',
        rightLabel: 'Merknaam',
        explanation: x.explanation,
      })));
    }

    if (selectedData.length === 0) return;

    setP1Data(shuffleArray(selectedData));
    setP2Data(shuffleArray(selectedData));
    setP1Index(0);
    setP2Index(0);
    setP1Score(0);
    setP2Score(0);
    setP1Penalty(false);
    setP2Penalty(false);
    setWinner(null);
    setGameStarted(true);
  };

  const handleSwipe = useCallback((player: 1 | 2, answerIsRight: boolean) => {
    if (winner !== null) return;
    if (player === 1 && p1Penalty) return;
    if (player === 2 && p2Penalty) return;

    const currentIndex = player === 1 ? p1Index : p2Index;
    const gameData = player === 1 ? p1Data : p2Data;
    if (gameData.length === 0) return;
    const item = gameData[currentIndex % gameData.length];

    const isCorrect = item.isCorrect === answerIsRight;

    if (isCorrect) {
      soundManager.playCorrect();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (player === 1) {
        setP1Score((s) => s + 1);
        setP1Index((i) => i + 1);
      } else {
        setP2Score((s) => s + 1);
        setP2Index((i) => i + 1);
      }
    } else {
      soundManager.playIncorrect();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      if (player === 1) {
        setP1Penalty(true);
        setTimeout(() => {
          setP1Penalty(false);
          setP1Index((i) => i + 1);
        }, PENALTY_MS);
      } else {
        setP2Penalty(true);
        setTimeout(() => {
          setP2Penalty(false);
          setP2Index((i) => i + 1);
        }, PENALTY_MS);
      }
    }
  }, [p1Data, p2Data, p1Index, p2Index, winner, p1Penalty, p2Penalty]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || winner !== null) return;

      const key = e.key.toLowerCase();

      if (isLandscape) {
        // Landscape: P2 is on the left (A/D), P1 is on the right (arrows)
        if (key === 'a') handleSwipe(2, false);
        if (key === 'd') handleSwipe(2, true);
        if (key === 'arrowleft') handleSwipe(1, false);
        if (key === 'arrowright') handleSwipe(1, true);
      } else {
        // Portrait: P1 is at the bottom (A/D), P2 is on top and rotated (arrows)
        if (key === 'a') handleSwipe(1, false);
        if (key === 'd') handleSwipe(1, true);
        if (key === 'arrowright') handleSwipe(2, false);
        if (key === 'arrowleft') handleSwipe(2, true);
      }
    };

    if (typeof window !== 'undefined' && (window as any).addEventListener) {
      // @ts-ignore
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (typeof window !== 'undefined' && (window as any).removeEventListener) {
        // @ts-ignore
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [gameStarted, winner, handleSwipe]);

  const renderPlayerArea = (player: 1 | 2) => {
    const isP2 = player === 2;
    const shouldRotate = isP2 && !isLandscape;
    const score = player === 1 ? p1Score : p2Score;
    const currentIndex = player === 1 ? p1Index : p2Index;
    const isPenalty = player === 1 ? p1Penalty : p2Penalty;
    const gameData = player === 1 ? p1Data : p2Data;
    if (gameData.length === 0) return null;
    const currentItem = gameData[currentIndex % gameData.length];

    const renderCard = () => {
      if (winner !== null) {
        const didWin = winner === player;
        return (
          <Animated.View
            entering={ZoomIn.duration(220)}
            style={[
              styles.statusCard,
              {
                backgroundColor: theme.surface,
                borderColor: didWin ? theme.accent : theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: didWin ? theme.accentSoft : theme.surfaceMuted },
              ]}
            >
              <Ionicons
                name={didWin ? 'trophy-outline' : 'flag-outline'}
                size={20}
                color={didWin ? theme.accent : theme.inkMuted}
              />
            </View>
            <Text style={[styles.statusTitle, { color: theme.ink }]}>
              {didWin ? `Speler ${player} wint` : `Speler ${player} verliest`}
            </Text>
            <Text style={[styles.statusBody, { color: theme.inkSecondary }]}>
              {didWin ? 'Als eerste bij de vijftien punten.' : 'Goed gespeeld, maar net te laat.'}
            </Text>
          </Animated.View>
        );
      }
      if (isPenalty) {
        return (
          <Animated.View
            entering={FadeIn.duration(160)}
            style={[
              styles.penaltyCard,
              { backgroundColor: theme.surface, borderColor: theme.incorrect },
            ]}
          >
            <View style={[styles.penaltyHeaderRow]}>
              <Ionicons name="close-circle-outline" size={16} color={theme.incorrect} />
              <Text style={[styles.penaltyHeader, { color: theme.incorrect }]}>Onjuist</Text>
            </View>
            <Text style={[styles.penaltyWord, { color: theme.ink }]}>{currentItem.text}</Text>
            <Text style={[styles.penaltyExplanation, { color: theme.inkSecondary }]}>
              {currentItem.explanation}
            </Text>
          </Animated.View>
        );
      }
      return (
        <SwipeCard
          key={currentIndex}
          active
          compact
          onSwipeLeft={() => handleSwipe(player, false)}
          onSwipeRight={() => handleSwipe(player, true)}
          leftLabel={currentItem.leftLabel}
          rightLabel={currentItem.rightLabel}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.modeBadge, { color: theme.inkSecondary, backgroundColor: theme.surfaceMuted }]}>
              {currentItem.mode}
            </Text>
          </View>
          <Text
            style={[styles.word, { color: theme.cardTextPrimary }]}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {currentItem.text}
          </Text>
          {showDefinitions && currentItem.subText ? (
            <Text
              style={[styles.cardSubText, { color: theme.cardTextSecondary }]}
              adjustsFontSizeToFit
              numberOfLines={2}
            >
              {currentItem.subText}
            </Text>
          ) : null}
        </SwipeCard>
      );
    };

    return (
      <View style={[styles.playerArea, shouldRotate && styles.rotated]}>
        <View style={styles.scoreHeader}>
          <Text style={[styles.scoreText, { color: theme.inkSecondary }]}>
            Speler {player}
          </Text>
          <Text style={[styles.scoreValue, { color: theme.ink }]}>
            {score}
            <Text style={{ color: theme.inkMuted }}> / {TARGET_SCORE}</Text>
          </Text>
        </View>

        <View style={styles.cardContainer}>{renderCard()}</View>
      </View>
    );
  };

  // 1. SETUP STATE UI (Before start)
  if (!gameStarted) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <PremiumTopBar title="Multiplayer" />
          <ScrollView style={styles.setupScroll} contentContainerStyle={styles.setupContainer}>
            <View style={styles.setupHeader}>
              <Text style={[styles.setupTitle, { color: theme.ink }]}>
                Speel samen op één scherm
              </Text>
              <Text style={[styles.setupSubtitle, { color: theme.inkSecondary }]}>
                Kies de categorieën. Wie het eerst vijftien punten haalt, wint.
              </Text>
            </View>

            <View style={styles.setupList}>
              {MODES_CONFIG.map((m) => {
                const isEnabled = enabledModes[m.key];
                return (
                  <TouchableOpacity
                    key={m.key}
                    onPress={() => toggleMode(m.key)}
                    style={[
                      styles.setupItem,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                    ]}
                    focusable={false}
                  >
                    <View style={styles.setupItemLeft}>
                      <View style={[styles.setupIcon, { backgroundColor: theme.surfaceMuted }]}>
                        <Ionicons name={m.icon} size={16} color={theme.inkSecondary} />
                      </View>
                      <Text style={[styles.setupItemName, { color: theme.ink }]}>{m.name}</Text>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: isEnabled ? theme.accent : theme.borderStrong,
                          backgroundColor: isEnabled ? theme.accent : 'transparent',
                        },
                      ]}
                    >
                      {isEnabled ? (
                        <Ionicons name="checkmark" size={13} color={theme.accentContrast} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDefinitions(!showDefinitions);
              }}
              style={[styles.setupItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
              focusable={false}
            >
              <View style={styles.setupItemLeft}>
                <View style={[styles.setupIcon, { backgroundColor: theme.surfaceMuted }]}>
                  <Ionicons name="reader-outline" size={16} color={theme.inkSecondary} />
                </View>
                <Text style={[styles.setupItemName, { color: theme.ink }]}>Definities tonen</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: showDefinitions ? theme.accent : theme.borderStrong,
                    backgroundColor: showDefinitions ? theme.accent : 'transparent',
                  },
                ]}
              >
                {showDefinitions ? (
                  <Ionicons name="checkmark" size={13} color={theme.accentContrast} />
                ) : null}
              </View>
            </TouchableOpacity>

            <BouncyButton title="Start wedstrijd" onPress={handleStartGame} style={styles.startButton} />

            <BouncyButton
              title="Annuleren"
              variant="quiet"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // 2. ACTIVE GAMEPLAY STATE UI
  return (
    <GradientBackground>
      <SafeAreaView style={[styles.container, isLandscape && styles.landscapeContainer]} edges={['top']}>
        {/* Player 2 Area (Top or Left) */}
        {renderPlayerArea(2)}

        <View style={[styles.divider, isLandscape && styles.verticalDivider]}>
          {winner === null ? (
            <TouchableOpacity
              style={[styles.quitButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              focusable={false}
              onPress={() => setGameStarted(false)}
            >
              <Ionicons name="close" size={14} color={theme.inkSecondary} />
              <Text style={[styles.quitText, { color: theme.inkSecondary }]}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <BouncyButton
              title="Terug naar setup"
              variant="secondary"
              onPress={() => setGameStarted(false)}
            />
          )}
        </View>

        {/* Player 1 Area (Bottom) */}
        {renderPlayerArea(1)}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  landscapeContainer: {
    flexDirection: 'row',
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
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  scoreText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.1,
  },
  scoreValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  cardContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modeBadge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  word: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  cardSubText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  statusCard: {
    width: '100%',
    minHeight: 180,
    borderRadius: RADIUS.card + 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 6,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.control,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statusTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    textAlign: 'center',
  },
  statusBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  penaltyCard: {
    width: '100%',
    minHeight: 180,
    borderRadius: RADIUS.card + 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  penaltyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  penaltyHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  penaltyWord: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  penaltyExplanation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  divider: {
    height: 44,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  verticalDivider: {
    width: 44,
    height: '100%',
  },
  quitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  quitText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  setupScroll: {
    flex: 1,
  },
  setupContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingBottom: 24,
  },
  setupHeader: {
    marginBottom: 20,
    gap: 6,
  },
  setupTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    letterSpacing: -0.6,
  },
  setupSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  setupList: {
    width: '100%',
    gap: 6,
    marginBottom: 6,
  },
  setupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 11,
    borderRadius: RADIUS.control,
    borderWidth: 1,
    width: '100%',
    marginBottom: 6,
  },
  setupItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setupIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupItemName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    width: '100%',
    marginTop: 4,
  },
});
