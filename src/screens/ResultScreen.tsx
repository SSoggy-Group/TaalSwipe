import React from 'react';
import { StyleSheet, Text, View, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { BouncyButton } from '../components/BouncyButton';
import { Confetti } from '../components/Confetti';
import { Colors, useAppTheme } from '../theme/colors';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' };
  Result: { score: number; total: number; mode: string };
};

type Props = Readonly<NativeStackScreenProps<RootStackParamList, 'Result'>>;

export function ResultScreen({ route, navigation }: Props) {
  const { score, total, mode } = route.params;
  const theme = useAppTheme();
  
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ik scoorde ${score}/${total} (${Math.round(percentage)}%) in de TaalSwipe modus "${mode}"! ${emoji} Kan jij beter?`,
      });
    } catch (error: any) {
      console.log('Share error:', error.message);
    }
  };

  return (
    <GradientBackground>
      {isPerfect && <Confetti />}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View 
            entering={ZoomIn.duration(600).springify()}
            style={[styles.scoreCard, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}
          >
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
            </View>

            <Text style={[styles.modeText, { color: theme.cardTextSecondary }]}>Modus: {mode}</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.buttonContainer}
          >
            <BouncyButton
              title="Nog een keer 🔄"
              color={Colors.accent}
              borderColor="#8B5CF6"
              bottomBorderColor="#7C3AED"
              onPress={() => navigation.navigate('Game', { mode: route.params.mode as any })}
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
  scoreCard: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 32, // More margin to separate from buttons
    paddingBottom: 40, // Add padding to fix the modeText stickiness
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
  buttonContainer: {
    gap: 12,
  },
});
