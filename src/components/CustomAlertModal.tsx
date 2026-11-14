import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useAppTheme, RADIUS } from '../theme/colors';
import { BouncyButton } from './BouncyButton';

interface CustomAlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: CustomAlertButton[];
  onClose?: () => void;
}

export function CustomAlertModal({ visible, title, message, buttons, onClose }: Readonly<CustomAlertModalProps>) {
  const theme = useAppTheme();
  if (!visible) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  const defaultButtons: CustomAlertButton[] = [
    { text: 'OK', onPress: handleClose, style: 'default' },
  ];

  const renderButtons = buttons || defaultButtons;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View
          style={[styles.alertContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onStartShouldSetResponder={() => true}
        >
          <Text style={[styles.title, { color: theme.ink }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.inkSecondary }]}>{message}</Text>

          <View style={styles.buttonContainer}>
            {renderButtons.map((btn) => {
              const variant = btn.style === 'destructive'
                ? 'danger'
                : btn.style === 'cancel'
                  ? 'secondary'
                  : 'primary';
              return (
                <BouncyButton
                  key={btn.text}
                  variant={variant}
                  onPress={() => {
                    btn.onPress();
                    handleClose();
                  }}
                  style={styles.button}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: variant === 'secondary'
                          ? theme.ink
                          : variant === 'danger'
                            ? '#FFFFFF'
                            : theme.accentContrast,
                      },
                    ]}
                  >
                    {btn.text}
                  </Text>
                </BouncyButton>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 18, 22, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    borderRadius: RADIUS.card + 2,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
