import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { GlassButton } from '../components/GlassButton';
import { Colors } from '../theme/colors';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' };
  Result: { score: number; total: number; mode: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Title */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600).springify()}
            style={styles.titleContainer}
          >
            <Text style={styles.titleEmoji}>🇳🇱</Text>
            <Text style={styles.title}>TaalSwipe</Text>
            <Text style={styles.subtitle}>Swipe je weg door de Nederlandse taal</Text>
          </Animated.View>

          {/* Mode Buttons */}
          <View style={styles.buttonsContainer}>
            <Animated.View entering={FadeInDown.delay(250).duration(500).springify()}>
              <GlassButton
                emoji="🗣️"
                title="Straattaal of AI?"
                onPress={() => navigation.navigate('Game', { mode: 'straattaal' })}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
              <GlassButton
                emoji="🇬🇧"
                title="Steenkolenengels"
                onPress={() => navigation.navigate('Game', { mode: 'dunglish' })}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(550).duration(500).springify()}>
              <GlassButton
                emoji="⚡"
                title="Speed-Spelling"
                onPress={() => navigation.navigate('Game', { mode: 'spelling' })}
              />
            </Animated.View>
          </View>

          {/* Footer */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(400)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Swipe rechts = Echt • Swipe links = Nep</Text>
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 44,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  buttonsContainer: {
    gap: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
