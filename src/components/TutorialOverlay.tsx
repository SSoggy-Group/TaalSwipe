import React from 'react';
import { StyleSheet, Text, View, Pressable, Modal, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
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
        title: 'Straattaal of AI?',
        body: 'Rechts: echt. Links: verzonnen.',
      };
    case 'dunglish':
      return {
        left: 'Nep',
        right: 'Echt',
        title: 'Steenkolenengels',
        body: 'Rechts: echt spreekwoord, letterlijk vertaald. Links: verzonnen.',
      };
    case 'spelling':
      return {
        left: 'Fout',
        right: 'Goed',
        title: 'Goed of fout gespeld?',
        body: 'Rechts: goed gespeld. Links: fout.',
      };
    case 'dt':
      return {
        left: 'Fout',
        right: 'Goed',
        title: 'D, t of dt?',
        body: 'Rechts: juiste vorm. Links: foute vorm.',
      };
    case 'vandale':
      return {
        left: 'Onzin',
        right: 'Van Dale',
        title: 'Staat het in de Van Dale?',
        body: 'Rechts: staat in de Van Dale. Links: verzonnen.',
      };
    case 'brand':
      return {
        left: 'Soortnaam',
        right: 'Merknaam',
        title: 'Merk of soort?',
        body: 'Rechts: merknaam. Links: soortnaam.',
      };
    default:
      return {
        left: 'Onjuist',
        right: 'Juist',
        title: 'Zo speel je',
        body: 'Rechts: goed. Links: fout.',
      };
  }
}

export function TutorialOverlay({ mode, onDismiss }: Props) {
  const theme = useAppTheme();
  const copy = getCopy(mode);

  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    // The shared modal focus trap lands on its leading focus bracket. Move
    // focus to the tutorial's primary action so Enter starts the round.
    const timer = setTimeout(() => {
      const button = document.querySelector<HTMLElement>('[role="dialog"] [role="button"]');
      button?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal
      transparent
      visible
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
      accessibilityLabel={copy.title}
    >
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(160)}
          style={styles.innerContainer}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
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

            <BouncyButton title="Start" onPress={onDismiss} style={styles.button} autoFocus />
          </Animated.View>
        </Animated.View>
        <Pressable
          accessible={false}
          focusable={false}
          tabIndex={-1}
          style={styles.backdrop}
          onPress={onDismiss}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 18, 22, 0.55)',
    zIndex: 0,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 1,
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
