import { Platform } from 'react-native';
import * as ExpoSpeech from 'expo-speech';

interface SpeakOptions {
  language?: string;
  rate?: number;
}

function getWebSpeech() {
  if (globalThis.window === undefined) return null;
  return globalThis.window.speechSynthesis ?? null;
}

export function stop() {
  if (Platform.OS === 'web') {
    getWebSpeech()?.cancel();
    return;
  }

  ExpoSpeech.stop();
}

export function speak(text: string, options: SpeakOptions = {}) {
  if (Platform.OS === 'web') {
    const speech = getWebSpeech();
    if (!speech || typeof SpeechSynthesisUtterance === 'undefined') return;

    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language ?? 'nl-NL';
    utterance.rate = options.rate ?? 0.9;
    speech.speak(utterance);
    return;
  }

  ExpoSpeech.speak(text, options);
}
