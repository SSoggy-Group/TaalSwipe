import React from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
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
  if (!visible) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  const defaultButtons: CustomAlertButton[] = [
    { text: 'OK', onPress: handleClose, style: 'default' }
  ];

  const renderButtons = buttons || defaultButtons;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose} statusBarTranslucent={true}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
          <Animated.View entering={SlideInUp.springify()} style={styles.alertContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {renderButtons.map((btn, idx) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                return (
                  <BouncyButton
                    key={btn.text}
                    onPress={() => {
                      btn.onPress();
                      handleClose();
                    }}
                    style={[
                      styles.button,
                      isDestructive && styles.buttonDestructive,
                      isCancel && styles.buttonCancel,
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isCancel && styles.buttonTextCancel,
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </BouncyButton>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
  },
  buttonDestructive: {
    backgroundColor: '#ff4444',
  },
  buttonCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextCancel: {
    color: '#fff',
  },
});
