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
    >
      <Pressable accessible={false} style={styles.container} onPress={onResume}>
        <View
          style={[styles.content, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onStartShouldSetResponder={() => true}
        >
          <Text style={[styles.title, { color: theme.ink }]}>Gepauzeerd</Text>

          <View style={[styles.scoreBox, { backgroundColor: theme.surfaceMuted }]}>
            <Text style={[styles.scoreValue, { color: theme.ink }]}>{score}</Text>
            <Text style={[styles.scoreLabel, { color: theme.inkSecondary }]}>Goede antwoorden</Text>
          </View>

          <View style={styles.buttonContainer}>
            <BouncyButton title="Doorgaan" onPress={onResume} style={styles.button} />
            <BouncyButton
              title="Stoppen"
              variant="secondary"
              onPress={onQuit}
              style={styles.button}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(16, 18, 22, 0.45)',
  },
  content: {
    borderRadius: RADIUS.card + 2,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
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
