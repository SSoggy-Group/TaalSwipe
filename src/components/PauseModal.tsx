import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, useAppTheme } from '../theme/colors';
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
      statusBarTranslucent={true}
    >
      <BlurView intensity={80} tint={theme.glass.background === '#FFFFFF' ? 'light' : 'dark'} style={styles.container}>
        <View style={[styles.content, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}>
          <Text style={[styles.title, { color: theme.cardTextPrimary }]}>Gepauzeerd ⏸️</Text>
          
          <View style={[styles.scoreBox, { backgroundColor: theme.glass.highlight }]}>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={[styles.scoreLabel, { color: theme.cardTextSecondary }]}>Huidige Score</Text>
          </View>

          <View style={styles.buttonContainer}>
            <BouncyButton
              title="Doorgaan"
              color={Colors.accent}
              borderColor="#8B5CF6"
              bottomBorderColor="#7C3AED"
              style={styles.button}
              onPress={onResume}
            />
            <BouncyButton
              title="Stoppen"
              color="#FF4B4B"
              borderColor="#D33333"
              bottomBorderColor="#9A1D1D"
              style={styles.button}
              onPress={onQuit}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: 'rgba(20, 20, 30, 0.75)',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  scoreBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 48,
    color: Colors.correct,
  },
  scoreLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
