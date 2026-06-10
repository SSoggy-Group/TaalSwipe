import { Platform } from 'react-native';
import * as ExpoHaptics from 'expo-haptics';

export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;
export type ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export type NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;

export async function impactAsync(style: ExpoHaptics.ImpactFeedbackStyle) {
  if (Platform.OS === 'web') return;

  try {
    await ExpoHaptics.impactAsync(style);
  } catch {
    // Haptics are optional feedback. Ignore unsupported desktop/native cases.
  }
}

export async function notificationAsync(type: ExpoHaptics.NotificationFeedbackType) {
  if (Platform.OS === 'web') return;

  try {
    await ExpoHaptics.notificationAsync(type);
  } catch {
    // Haptics are optional feedback. Ignore unsupported desktop/native cases.
  }
}
