import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Share, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { BouncyButton } from '../components/BouncyButton';
import { Confetti } from '../components/Confetti';
import { Colors, useAppTheme } from '../theme/colors';
import { statsStore } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: string };
  Result: { 
    score: number; 
    total: number; 
    mode: string; 
    rawMode?: string;
    history?: { word: string; correct: boolean; explanation: string }[];
    timeMs?: number;
  };
};

type Props = Readonly<NativeStackScreenProps<RootStackParamList, 'Result'>>;

export function ResultScreen({ route, navigation }: Props) {
  const { score, total, mode, rawMode, history, timeMs } = route.params;
  const theme = useAppTheme(rawMode);
  
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    async function checkHighScore() {
      if (rawMode) {
        const stats = await statsStore.getStats();
        const currentHigh = (stats.highScores as any)[rawMode] || 0;
        if (score > currentHigh) {
          setIsNewHighScore(true);
          const newStats = { ...stats };
          (newStats.highScores as any)[rawMode] = score;
          await statsStore.saveStats(newStats);
        }
      }
    }
    checkHighScore();
  }, [score, rawMode]);

  const percentage = total > 0 ? (score / total) * 100 : 0;
  let emoji = '😐';
  let message = 'Kan beter...';
  
  if (percentage >= 80) {
    emoji = '🔥';
    message = 'Taal-Baas!';
  } else if (percentage >= 50) {
    emoji = '👍';
    message = 'Lekker bezig!';
  }

  const isPerfect = percentage >= 100 && total > 5;
  const showConfetti = isPerfect || isNewHighScore;

  const handleShare = async () => {
    try {
      const timeStr = timeMs ? ` in ${formatTime(timeMs)}` : '';
      await Share.share({
        message: `Ik scoorde ${score}/${total} (${Math.round(percentage)}%)${timeStr} in de TaalSwipe modus "${mode}"! ${emoji} Kan jij beter?`,
      });
    } catch (error: any) {
      console.log('Share error:', error.message);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const deciseconds = Math.floor((ms % 1000) / 100);
    const mStr = minutes > 0 ? `${minutes}:` : '';
    const sStr = minutes > 0 ? seconds.toString().padStart(2, '0') : seconds.toString();
    return `${mStr}${sStr}.${deciseconds}`;
  };

  const renderHistoryItem = ({ item, index }: { item: NonNullable<typeof history>[0], index: number }) => (
    <Animated.View entering={FadeInDown.delay(300 + index * 50)} style={[styles.historyItem, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
      <View style={styles.historyHeader}>
        <Ionicons name={item.correct ? "checkmark-circle" : "close-circle"} size={24} color={item.correct ? Colors.correct : Colors.incorrect} />
        <Text style={[styles.historyWord, { color: theme.cardTextPrimary }]}>{item.word}</Text>
      </View>
      <Text style={[styles.historyExplanation, { color: theme.cardTextSecondary }]}>{item.explanation}</Text>
    </Animated.View>
  );

  return (
    <GradientBackground>
      {showConfetti && <Confetti />}
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.word}-${index}`}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Animated.View 
              entering={ZoomIn.duration(600).springify()}
              style={[styles.scoreCard, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}
            >
              {isNewHighScore && <Text style={styles.highScoreBadge}>🏆 NIEUW RECORD!</Text>}
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={[styles.message, { color: theme.cardTextPrimary }]}>{message}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: theme.cardTextPrimary }]}>{score}</Text>
                  <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Goed</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.glass.border }]} />
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: theme.cardTextPrimary }]}>{total}</Text>
                  <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Totaal</Text>
                </View>
                {timeMs !== undefined && (
                  <>
                    <View style={[styles.divider, { backgroundColor: theme.glass.border }]} />
                    <View style={styles.statBox}>
                      <Text style={[styles.statValue, { color: '#38BDF8', fontSize: 32 }]}>{formatTime(timeMs)}</Text>
                      <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Tijd</Text>
                    </View>
                  </>
                )}
              </View>

              <Text style={[styles.modeText, { color: theme.cardTextSecondary }]}>Modus: {mode}</Text>
            </Animated.View>
          }
          renderItem={renderHistoryItem}
          ListFooterComponent={
            <Animated.View 
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.buttonContainer}
            >
              <BouncyButton
                title="Nog een keer 🔄"
                color={Colors.accent}
                borderColor="#8B5CF6"
                bottomBorderColor="#7C3AED"
                onPress={() => navigation.navigate('Game', { mode: rawMode || 'spelling' } as any)}
              />
              <BouncyButton
                title="Deel Score 📤"
                color="#38BDF8"
                borderColor="#0284C7"
                bottomBorderColor="#0369A1"
                onPress={handleShare}
              />
              <BouncyButton
                title="Naar Menu 🏠"
                color="#94A3B8"
                borderColor="#64748B"
                bottomBorderColor="#475569"
                onPress={() => navigation.navigate('Home')}
              />
            </Animated.View>
          }
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  scoreCard: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 40,
  },
  highScoreBadge: {
    position: 'absolute',
    top: -16,
    backgroundColor: '#F59E0B',
    color: '#FFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
    marginTop: 8,
  },
  message: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontFamily: 'Inter_900Black',
    fontSize: 48,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    width: 2,
    height: 40,
  },
  modeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  historyItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  historyWord: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
  },
  historyExplanation: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 32, // align with text, skip icon
  },
  buttonContainer: {
    gap: 12,
    marginTop: 12,
  },
});
