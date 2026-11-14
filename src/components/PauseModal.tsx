import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { useAppTheme, RADIUS } from '../theme/colors';
import { BouncyButton } from './BouncyButton';

interface Props {
  readonly visible: boolean;
  readonly onResume: () => void;
  readonly onQuit: () => void;
  readonly score: number;
}

export function PauseModal({ visible, onResume, onQuit, score }: Props) {
  const theme = useAppTheme();
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onResume}
      statusBarTranslucent
      accessibilityLabel="Spel gepauzeerd"
    >
      <View style={styles.container}>
        <View
          style={[styles.content, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Text style={[styles.title, { color: theme.ink }]}>Gepauzeerd</Text>

          <View style={[styles.scoreBox, { backgroundColor: theme.surfaceMuted }]}>
            <Text style={[styles.scoreValue, { color: theme.ink }]}>{score}</Text>
            <Text style={[styles.scoreLabel, { color: theme.inkSecondary }]}>Goede antwoorden</Text>
          </View>

          <View style={styles.buttonContainer}>
            <BouncyButton title="Doorgaan" onPress={onResume} style={styles.button} autoFocus />
            <BouncyButton
              title="Stoppen"
              variant="secondary"
              onPress={onQuit}
              style={styles.button}
            />
          </View>
        </View>
        <Pressable
          accessible={false}
          focusable={false}
          tabIndex={-1}
          style={styles.backdrop}
          onPress={onResume}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(16, 18, 22, 0.45)',
    zIndex: 0,
  },
  content: {
    borderRadius: RADIUS.card + 2,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    letterSpacing: -0.2,
    marginBottom: 18,
    textAlign: 'center',
  },
  scoreBox: {
    borderRadius: RADIUS.control,
    padding: 16,
    alignItems: 'center',
    marginBottom: 22,
  },
  scoreValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 34,
    fontVariant: ['tabular-nums'],
  },
  scoreLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginTop: 2,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    width: '100%',
  },
});
