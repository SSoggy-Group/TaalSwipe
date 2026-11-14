import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Share, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { BouncyButton } from '../components/BouncyButton';
import { PremiumTopBar } from '../components/PremiumTopBar';
import { useAppTheme, RADIUS } from '../theme/colors';
import { statsStore } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';
import { soundManager } from '../audio/SoundManager';

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

function getResultCopy(percentage: number): { title: string; body: string } {
  if (percentage >= 90) {
    return { title: 'Sterk gespeeld', body: 'Bijna foutloos.' };
  }
  if (percentage >= 70) {
    return { title: 'Mooie ronde', body: 'Net niet foutloos.' };
  }
  if (percentage >= 50) {
    return { title: 'Op de goede weg', body: 'Een paar fouten te veel.' };
  }
  return { title: 'Blijf oefenen', body: 'Bekijk hieronder wat er misging.' };
}

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

    const pct = total > 0 ? (score / total) * 100 : 0;
    if (pct >= 80) {
      soundManager.playWin();
    } else {
      soundManager.playGameOver();
    }
  }, [score, total, rawMode]);

  const percentage = total > 0 ? (score / total) * 100 : 0;
  const copy = total === 0
    ? { title: 'Ronde gestopt', body: 'Je hebt nog niets beantwoord.' }
    : getResultCopy(percentage);

  const handleShare = async () => {
    try {
      const timeStr = timeMs ? ` in ${formatTime(timeMs)}` : '';
      await Share.share({
        message: `Ik scoorde ${score}/${total} (${Math.round(percentage)}%)${timeStr} in de TaalSwipe-modus "${mode}". Kan jij beter?`,
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

  const renderHistoryItem = ({ item, index }: { item: NonNullable<typeof history>[0]; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 30).duration(240)}
      style={[styles.historyItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={styles.historyHeader}>
        <View
          style={[
            styles.historyIcon,
            { backgroundColor: item.correct ? theme.correctBg : theme.incorrectBg },
          ]}
        >
          <Ionicons
            name={item.correct ? 'checkmark' : 'close'}
            size={14}
            color={item.correct ? theme.correct : theme.incorrect}
          />
        </View>
        <Text style={[styles.historyWord, { color: theme.ink }]}>{item.word}</Text>
      </View>
      <Text style={[styles.historyExplanation, { color: theme.inkSecondary }]}>
        {item.explanation}
      </Text>
    </Animated.View>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <PremiumTopBar title="Resultaten" />

        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.word}-${index}`}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Animated.View entering={FadeInDown.duration(280)}>
              <View
                style={[
                  styles.scoreCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <View style={styles.scoreCardTop}>
                  <Text style={[styles.kicker, { color: theme.inkMuted }]}>Score</Text>
                  {isNewHighScore ? (
                    <View style={[styles.recordPill, { backgroundColor: theme.accentSoft }]}>
                      <Ionicons name="trophy-outline" size={12} color={theme.accent} />
                      <Text style={[styles.recordText, { color: theme.accent }]}>Nieuw record</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.scoreRow}>
                  <Text style={[styles.scoreValue, { color: theme.ink }]}>{score}</Text>
                  <Text style={[styles.scoreTotal, { color: theme.inkMuted }]}>/ {total}</Text>
                </View>

                <Text style={[styles.resultTitle, { color: theme.ink }]}>{copy.title}</Text>
                <Text style={[styles.resultBody, { color: theme.inkSecondary }]}>{copy.body}</Text>

                <View style={[styles.statsContainer, { borderTopColor: theme.border }]}>
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: theme.ink }]}>
                      {Math.round(percentage)}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.inkMuted }]}>Goed</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: theme.ink }]}>{total - score}</Text>
                    <Text style={[styles.statLabel, { color: theme.inkMuted }]}>Gemist</Text>
                  </View>
                  {timeMs !== undefined ? (
                    <>
                      <View style={[styles.divider, { backgroundColor: theme.border }]} />
                      <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: theme.ink }]}>{formatTime(timeMs)}</Text>
                        <Text style={[styles.statLabel, { color: theme.inkMuted }]}>Tijd</Text>
                      </View>
                    </>
                  ) : null}
                </View>

                <Text style={[styles.modeText, { color: theme.inkMuted }]}>{mode}</Text>
              </View>

              {history && history.length > 0 ? (
                <Text style={[styles.sectionTitle, { color: theme.ink }]}>Antwoorden</Text>
              ) : null}
            </Animated.View>
          }
          renderItem={renderHistoryItem}
          ListFooterComponent={
            <Animated.View entering={FadeInDown.delay(200).duration(240)} style={styles.buttonContainer}>
              <BouncyButton
                title="Nog een keer"
                onPress={() => navigation.navigate('Game', { mode: rawMode || 'spelling' } as any)}
              />
              {total > 0 ? (
                <BouncyButton
                  title="Deel score"
                  variant="secondary"
                  onPress={handleShare}
                />
              ) : null}
              <BouncyButton
                title="Naar menu"
                variant="quiet"
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  scoreCard: {
    padding: 22,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    marginBottom: 24,
  },
  scoreCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kicker: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.1,
  },
  recordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  recordText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  scoreValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  scoreTotal: {
    fontFamily: 'Inter_500Medium',
    fontSize: 22,
    marginLeft: 4,
    fontVariant: ['tabular-nums'],
  },
  resultTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  resultBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 12,
  },
  modeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginBottom: 10,
  },
  historyItem: {
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  historyIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyWord: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    flexShrink: 1,
  },
  historyExplanation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 30,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 20,
  },
});
