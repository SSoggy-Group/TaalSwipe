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
  color: string;
}

const MODES_CONFIG = [
  { key: 'spelling', name: 'Spelling', color: '#0EA5E9', icon: '✍️' },
  { key: 'dt', name: 'D/T Spelling', color: '#F59E0B', icon: '📝' },
  { key: 'straattaal', name: 'Straattaal', color: '#8B5CF6', icon: '🤙' },
  { key: 'dunglish', name: 'Dunglish', color: '#EC4899', icon: '🇳🇱🇬🇧' },
  { key: 'vandale', name: 'Van Dale', color: '#10B981', icon: '📖' },
  { key: 'brand', name: 'Merken', color: '#EF4444', icon: '🏷️' },
];

const TARGET_SCORE = 15;
const PENALTY_MS = 600; // Snappy lockout

export function MultiplayerScreen({ navigation }: Props) {
  const theme = useAppTheme();
  
  const [gameStarted, setGameStarted] = useState(false);
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
    setEnabledModes(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Make sure at least one mode remains enabled
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
      selectedData.push(...spellingData.map(x => ({ text: x.text, isCorrect: x.isCorrect, mode: 'SPELLING', leftLabel: 'FOUT ✗', rightLabel: 'GOED ✓', color: '#0EA5E9' })));
    }
    if (enabledModes.dt) {
      selectedData.push(...dtData.map(x => ({ text: x.text, isCorrect: x.isCorrect, mode: 'D/T SPELLING', leftLabel: 'FOUT ✗', rightLabel: 'GOED ✓', color: '#F59E0B' })));
    }
    if (enabledModes.straattaal) {
      selectedData.push(...straattaalData.map(x => ({ text: x.word, isCorrect: x.isReal, mode: 'STRAATTAAL', leftLabel: 'VERZONNEN ✗', rightLabel: 'ECHT ✓', color: '#8B5CF6' })));
    }
    if (enabledModes.dunglish) {
      selectedData.push(...dunglishData.map(x => ({ text: x.text, isCorrect: x.isRealProverb, mode: 'DUNGLISH', leftLabel: 'NEP ✗', rightLabel: 'ECHT ✓', color: '#EC4899' })));
    }
    if (enabledModes.vandale) {
      selectedData.push(...vanDaleData.map(x => ({ text: x.word, isCorrect: x.isReal, mode: 'VAN DALE', leftLabel: 'ONZIN ✗', rightLabel: 'VAN DALE ✓', color: '#10B981' })));
    }
    if (enabledModes.brand) {
      selectedData.push(...brandData.map(x => ({ text: x.word, isCorrect: x.isReal, mode: 'MERKEN', leftLabel: 'SOORT ✗', rightLabel: 'MERK ✓', color: '#EF4444' })));
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
    
    const currentIndex = player === 1 ? p1Index : p2Index;
    const gameData = player === 1 ? p1Data : p2Data;
    if (gameData.length === 0) return;
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
    if (gameData.length === 0) return null;
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

  // 1. SETUP STATE UI (Before start)
  if (!gameStarted) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.setupContainer}>
          <View style={[styles.setupContent, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}>
            <Text style={[styles.setupTitle, { color: theme.cardTextPrimary }]}>⚔️ Multiplayer Gevecht</Text>
            <Text style={styles.setupSubtitle}>Kies de categorieën voor de strijd:</Text>
            
            <View style={styles.setupList}>
              {MODES_CONFIG.map((m) => {
                const isEnabled = enabledModes[m.key];
                return (
                  <TouchableOpacity
                    key={m.key}
                    onPress={() => toggleMode(m.key)}
                    style={[
                      styles.setupItem,
                      { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                      isEnabled && { borderColor: m.color, backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                    ]}
                    focusable={false}
                  >
                    <View style={styles.setupItemLeft}>
                      <Text style={styles.setupItemIcon}>{m.icon}</Text>
                      <Text style={[styles.setupItemName, { color: theme.cardTextPrimary }]}>{m.name}</Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      { borderColor: theme.glass.border },
                      isEnabled && { backgroundColor: m.color, borderColor: m.color }
                    ]}>
                      {isEnabled && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <BouncyButton
              title="START GEVECHT ⚔️"
              onPress={handleStartGame}
              style={styles.startButton}
            />

            <TouchableOpacity 
              style={[styles.backBtn, { marginTop: 16 }]} 
              focusable={false}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>Annuleren</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // 2. ACTIVE GAMEPLAY STATE UI
  return (
    <GradientBackground>
      {winner !== null && <ConfettiCannon count={150} origin={{x: -10, y: 0}} />}
      <SafeAreaView style={styles.container}>
        {/* Player 2 Area (Top) */}
        {renderPlayerArea(2)}
        
        <View style={styles.divider}>
          {winner !== null ? (
            <BouncyButton 
              title="Terug ⚙️" 
              color="#38BDF8" 
              borderColor="#0284C7" 
              bottomBorderColor="#0369A1" 
              onPress={() => setGameStarted(false)} 
            />
          ) : (
            <TouchableOpacity style={styles.quitBtn} focusable={false} onPress={() => setGameStarted(false)}>
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
  // SETUP STYLES
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  setupContent: {
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
  },
  setupTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 26,
    marginBottom: 4,
    textAlign: 'center',
  },
  setupSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    textAlign: 'center',
  },
  setupList: {
    width: '100%',
    gap: 12,
    marginBottom: 28,
  },
  setupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
  },
  setupItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  setupItemIcon: {
    fontSize: 20,
  },
  setupItemName: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    width: '100%',
    paddingVertical: 16,
  },
  backBtn: {
    paddingVertical: 10,
  },
  backBtnText: {
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
});
