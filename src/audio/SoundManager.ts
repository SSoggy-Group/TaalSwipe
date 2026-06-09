import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
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
  private players: Partial<Record<SoundKey, AudioPlayer>> = {};
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      await setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: 'mixWithOthers',
        interruptionModeAndroid: 'doNotMix',
      });

      for (const key of Object.keys(SOUND_FILES) as SoundKey[]) {
        try {
          this.players[key] = createAudioPlayer(SOUND_FILES[key]);
        } catch (e) {
          console.warn(`[SoundManager] Failed to load "${key}":`, e);
        }
      }
      this.initialized = true;
    } catch (e) {
      console.warn('[SoundManager] Failed to init audio mode:', e);
    }
  }

  private play(key: SoundKey, rate: number = 1.0) {
    if (!useSettingsStore.getState().isSoundEnabled) return;
    const player = this.players[key];
    if (!player) {
      console.warn(`[SoundManager] Player "${key}" not loaded`);
      return;
    }
    try {
      player.setPlaybackRate(rate);
      player.seekTo(0);
      player.play();
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

  unload() {
    for (const key of Object.keys(this.players) as SoundKey[]) {
      try {
        this.players[key]?.remove();
      } catch (_) {}
    }
    this.players = {};
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();
