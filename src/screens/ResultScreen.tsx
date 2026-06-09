import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { GlassButton } from '../components/GlassButton';
import { Colors } from '../theme/colors';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' };
  Result: { score: number; total: number; mode: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

function getResultMessage(score: number, total: number) {
  if (total === 0) return { emoji: '😬', message: 'Beter volgende keer!' };
  const pct = score / total;
  if (pct >= 0.9) return { emoji: '🏆', message: 'Taalmeester!' };
  if (pct >= 0.7) return { emoji: '🔥', message: 'Lekker bezig!' };
  if (pct >= 0.5) return { emoji: '👍', message: 'Niet slecht!' };
  if (pct >= 0.3) return { emoji: '😅', message: 'Kan beter...' };
  return { emoji: '😬', message: 'Oefening baart kunst!' };
}

export function ResultScreen({ navigation, route }: Props) {
  const { score, total, mode } = route.params;
  const { emoji, message } = getResultMessage(score, total);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View
            entering={FadeInDown.delay(100).duration(600).springify()}
            style={styles.resultContainer}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.modeLabel}>{mode}</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.scoreDivider}>/</Text>
              <Text style={styles.scoreTotal}>{total}</Text>
            </View>

            <Text style={styles.percentText}>
              {total > 0 ? Math.round((score / total) * 100) : 0}% goed
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(500).springify()}
            style={styles.buttonsContainer}
          >
            <GlassButton
              emoji="🔄"
              title="Opnieuw"
              onPress={() => navigation.replace('Game', {
                mode: mode === 'Straattaal of AI?' ? 'straattaal'
                  : mode === 'Steenkolenengels' ? 'dunglish'
                  : 'spelling'
              })}
            />
            <GlassButton
              emoji="🏠"
              title="Home"
              onPress={() => navigation.popToTop()}
            />
          </Animated.View>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  modeLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 64,
    color: Colors.correct,
  },
  scoreDivider: {
    fontFamily: 'Inter_400Regular',
    fontSize: 36,
    color: Colors.textMuted,
    marginHorizontal: 8,
  },
  scoreTotal: {
    fontFamily: 'Inter_400Regular',
    fontSize: 36,
    color: Colors.textSecondary,
  },
  percentText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: Colors.textSecondary,
  },
  buttonsContainer: {
    gap: 4,
  },
});
