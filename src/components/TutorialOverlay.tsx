import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInDown } from 'react-native-reanimated';
import { useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  readonly mode: string;
  readonly onDismiss: () => void;
}

export function TutorialOverlay({ mode, onDismiss }: Props) {
  const theme = useAppTheme();

  let leftText = 'FOUT';
  let rightText = 'GOED';
  let explanation = 'Swipe rechts als het klopt,\nswipe links als het fout is!';

  switch (mode) {
    case 'straattaal':
      leftText = 'NEP';
      rightText = 'ECHT';
      explanation = 'Sommige woorden zijn verzonnen door AI.\nSwipe NEP (links) of ECHT (rechts)!';
      break;
    case 'dunglish':
      leftText = 'NEP';
      rightText = 'ECHT';
      explanation = 'Bestaat dit spreekwoord echt of is het Dunglish?';
      break;
    case 'spelling':
      leftText = 'FOUT';
      rightText = 'GOED';
      explanation = 'Let goed op de spelling!\nIs het goed geschreven?';
      break;
    case 'dt':
      leftText = 'FOUT';
      rightText = 'GOED';
      explanation = 'Werkwoordspelling: met een d, t, of dt?';
      break;
    case 'vandale':
      leftText = 'ONZIN';
      rightText = 'VAN DALE';
      explanation = 'Staat dit echt in het woordenboek,\nof is het grote onzin?';
      break;
    case 'brand':
      leftText = 'SOORT';
      rightText = 'MERK';
      explanation = 'Is het een beschermd merk,\nof een algemene soortnaam?';
      break;
  }

  return (
    <TouchableWithoutFeedback onPress={onDismiss}>
      <Animated.View 
        entering={FadeIn.duration(400)} 
        exiting={FadeOut.duration(300)} 
        style={styles.container}
      >
        <View style={styles.overlayBackground} />
        
        {/* Helper Arrows and Labels */}
        <Animated.View entering={SlideInDown.delay(300)} style={styles.helperRow}>
          <View style={styles.helperColumn}>
            <Ionicons name="arrow-back-circle" size={48} color="#FF4B4B" />
            <Text style={styles.helperLabelRed}>{leftText}</Text>
          </View>
          <View style={styles.helperColumn}>
            <Ionicons name="arrow-forward-circle" size={48} color="#34D399" />
            <Text style={styles.helperLabelGreen}>{rightText}</Text>
          </View>
        </Animated.View>

        {/* Mascot / Explanation Card */}
        <Animated.View 
          entering={ZoomIn.delay(600).springify()} 
          style={[styles.explanationCard, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}
        >
          <Text style={styles.mascotEmoji}>🦉</Text>
          <Text style={[styles.title, { color: theme.cardTextPrimary }]}>Hoe het werkt</Text>
          <Text style={[styles.explanation, { color: theme.cardTextSecondary }]}>{explanation}</Text>
          
          <View style={styles.dismissButton}>
            <Text style={styles.dismissText}>Tik om te beginnen</Text>
          </View>
        </Animated.View>

      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 60,
  },
  helperColumn: {
    alignItems: 'center',
    gap: 8,
  },
  helperLabelRed: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#FF4B4B',
  },
  helperLabelGreen: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#34D399',
  },
  explanationCard: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    width: '85%',
  },
  mascotEmoji: {
    fontSize: 64,
    marginBottom: 16,
    marginTop: -64, // Pop out of the card
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    marginBottom: 12,
  },
  explanation: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  dismissButton: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  dismissText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 16,
  },
});
