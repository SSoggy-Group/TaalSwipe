import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { BouncyButton } from './BouncyButton';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt';
}

export function TutorialOverlay({ visible, onDismiss, mode }: Props) {
  if (!visible) return null;

  let title = '';
  let description = '';
  let emoji = '';

  switch (mode) {
    case 'straattaal':
      emoji = '🗣️';
      title = 'Hoe werkt het?';
      description = 'Swipe rechts als je denkt dat het écht straattaal is.\n\nSwipe links als je denkt dat AI het heeft verzonnen.';
      break;
    case 'dunglish':
      emoji = '🇬🇧';
      title = 'Hoe werkt het?';
      description = 'Swipe rechts als het een échte letterlijke vertaling van een Nederlands spreekwoord is.\n\nSwipe links als het nep is.';
      break;
    case 'spelling':
      emoji = '⚡';
      title = 'Snelheid is alles!';
      description = 'Kies razendsnel of het woord goed of fout gespeld is.\n\nJe hebt maar 1,5 seconde per woord. Eén fout = game over!';
      break;
    case 'dt':
      emoji = '🧠';
      title = 'D/T Grammatica';
      description = 'Kies of de zin met de juiste werkwoordsvorm is gespeld (d, t, of dt).\n\nSwipe rechts voor goed, links voor fout!';
      break;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={StyleSheet.absoluteFill}
    >
      <BlurView intensity={90} tint="dark" style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>👈 Links = Fout/Nep</Text>
            <Text style={styles.hintText}>Rechts = Goed/Echt 👉</Text>
          </View>
          <BouncyButton 
            title="Let's Go! 🚀" 
            onPress={onDismiss} 
            color={Colors.accent}
            borderColor="#8B5CF6"
            bottomBorderColor="#7C3AED"
            style={{ width: '100%' }}
          />
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100, // Make sure it sits on top of everything
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  hintBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 32,
    gap: 8,
  },
  hintText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
