import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useAppTheme, RADIUS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BouncyButton } from './BouncyButton';

interface Props {
  readonly mode: string;
  readonly onDismiss: () => void;
}

interface TutorialCopy {
  left: string;
  right: string;
  title: string;
  body: string;
}

function getCopy(mode: string): TutorialCopy {
  switch (mode) {
    case 'straattaal':
      return {
        left: 'Verzonnen',
        right: 'Echt',
        title: 'Echte straattaal of AI?',
        body: 'Swipe rechts als het woord echt bestaat. Swipe links als een AI het verzonnen heeft.',
      };
    case 'dunglish':
      return {
        left: 'Nep',
        right: 'Echt',
        title: 'Steenkolenengels',
        body: 'Swipe rechts als dit een echt Engels spreekwoord is. Links als het letterlijk uit het Nederlands vertaald is.',
      };
    case 'spelling':
      return {
        left: 'Fout',
        right: 'Goed',
        title: 'Goed of fout gespeld?',
        body: 'Swipe rechts als de spelling klopt. Links als er een fout in het woord zit.',
      };
    case 'dt':
      return {
        left: 'Fout',
        right: 'Goed',
        title: 'D, t of dt?',
        body: 'Lees de zin en swipe rechts als de werkwoordsvorm klopt. Links als hij fout is.',
      };
    case 'vandale':
      return {
        left: 'Onzin',
        right: 'Van Dale',
        title: 'Staat het in de Van Dale?',
        body: 'Swipe rechts als dit woord echt in de Dikke Van Dale staat. Links als het verzonnen is.',
      };
    case 'brand':
      return {
        left: 'Soortnaam',
        right: 'Merknaam',
        title: 'Merk of soort?',
        body: 'Swipe rechts als dit een beschermde merknaam is. Links als het een algemene soortnaam is.',
      };
    default:
      return {
        left: 'Onjuist',
        right: 'Juist',
        title: 'Zo werkt het',
        body: 'Swipe rechts als het klopt en links als het niet klopt.',
      };
  }
}

export function TutorialOverlay({ mode, onDismiss }: Props) {
  const theme = useAppTheme();
  const copy = getCopy(mode);

  return (
    <Pressable style={styles.container} onPress={onDismiss}>
      <View style={styles.backdrop} />
      <Animated.View entering={FadeIn.duration(200)} style={styles.innerContainer}>
        <Animated.View
          entering={ZoomIn.duration(220)}
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.helperRow}>
            <View style={styles.helperColumn}>
              <View style={[styles.helperIcon, { backgroundColor: theme.incorrectBg }]}>
                <Ionicons name="arrow-back" size={20} color={theme.incorrect} />
              </View>
              <Text style={[styles.helperLabel, { color: theme.incorrect }]}>{copy.left}</Text>
            </View>

            <View style={[styles.helperDivider, { backgroundColor: theme.border }]} />

            <View style={styles.helperColumn}>
              <View style={[styles.helperIcon, { backgroundColor: theme.correctBg }]}>
                <Ionicons name="arrow-forward" size={20} color={theme.correct} />
              </View>
              <Text style={[styles.helperLabel, { color: theme.correct }]}>{copy.right}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: theme.ink }]}>{copy.title}</Text>
          <Text style={[styles.body, { color: theme.inkSecondary }]}>{copy.body}</Text>

          <BouncyButton title="Beginnen" onPress={onDismiss} style={styles.button} />
        </Animated.View>
      </Animated.View>
    </Pressable>
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
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 18, 22, 0.55)',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    padding: 24,
    borderRadius: RADIUS.card + 2,
    borderWidth: 1,
    width: '100%',
    maxWidth: 380,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  helperColumn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  helperIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  helperDivider: {
    width: 1,
    height: 40,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    letterSpacing: -0.2,
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
