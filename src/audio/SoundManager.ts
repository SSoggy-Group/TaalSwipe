import { Audio } from 'expo-av';
import { useSettingsStore } from '../store/settingsStore';

type SoundKey = 'swoosh' | 'correct' | 'incorrect' | 'gameover' | 'win' | 'purchase';

const SOUND_FILES: Record<SoundKey, any> = {
  swoosh: require('../../assets/sounds/swoosh.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  incorrect: require('../../assets/sounds/incorrect.wav'),
  gameover: require('../../assets/sounds/gameover.wav'),
  win: require('../../assets/sounds/win.wav'),
  purchase: require('../../assets/sounds/purchase.wav'),
};

class SoundManager {
  private sounds: Partial<Record<SoundKey, Audio.Sound>> = {};
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      for (const key of Object.keys(SOUND_FILES) as SoundKey[]) {
        const { sound } = await Audio.Sound.createAsync(SOUND_FILES[key]);
        this.sounds[key] = sound;
      }
      this.initialized = true;
    } catch (e) {
      console.warn('[SoundManager] Failed to init sounds:', e);
    }
  }

  private async play(key: SoundKey, rate: number = 1.0) {
    if (!useSettingsStore.getState().isSoundEnabled) return;
    const sound = this.sounds[key];
    if (!sound) {
      console.warn(`[SoundManager] Sound "${key}" not loaded`);
      return;
    }
    try {
      await sound.setRateAsync(rate, true);
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (e) {
      console.warn(`[SoundManager] Error playing "${key}":`, e);
    }
  }

  playSwoosh() { this.play('swoosh'); }
  playCorrect(combo: number = 0) {
    const rate = Math.min(1.0 + (combo * 0.05), 1.6);
    this.play('correct', rate);
  }
  playIncorrect() { this.play('incorrect'); }
  playGameOver() { this.play('gameover'); }
  playWin() { this.play('win'); }
  playPurchase() { this.play('purchase'); }

  async unload() {
    for (const sound of Object.values(this.sounds)) {
      try { await sound.unloadAsync(); } catch (_) {}
    }
    this.sounds = {};
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();
