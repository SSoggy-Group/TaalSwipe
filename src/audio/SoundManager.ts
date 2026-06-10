import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { useSettingsStore } from '../store/settingsStore';

type SoundKey = 'swoosh' | 'correct' | 'incorrect' | 'gameover' | 'win' | 'purchase';

const SOUND_FILES: Record<string, any> = {
  swoosh: require('../../assets/sounds/swoosh.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  incorrect: require('../../assets/sounds/incorrect.wav'),
  gameover: require('../../assets/sounds/gameover.wav'),
  win: require('../../assets/sounds/win.wav'),
  purchase: require('../../assets/sounds/purchase.wav'),

  // Swoosh candidates
  'swoosh_166': require('../../assets/sounds/candidates/swoosh_166.wav'),
  'swoosh_1152': require('../../assets/sounds/candidates/swoosh_1152.wav'),
  'swoosh_1153': require('../../assets/sounds/candidates/swoosh_1153.wav'),
  
  // Incorrect candidates
  'incorrect_240': require('../../assets/sounds/candidates/incorrect_240.wav'),
  'incorrect_472': require('../../assets/sounds/candidates/incorrect_472.wav'),
  'incorrect_950': require('../../assets/sounds/candidates/incorrect_950.wav'),
  'incorrect_954': require('../../assets/sounds/candidates/incorrect_954.wav'),
  'incorrect_1540': require('../../assets/sounds/candidates/incorrect_1540.wav'),
  'incorrect_2042': require('../../assets/sounds/candidates/incorrect_2042.wav'),
  'incorrect_2939': require('../../assets/sounds/candidates/incorrect_2939.wav'),

  // Game Over candidates
  'gameover_568': require('../../assets/sounds/candidates/gameover_568.wav'),
  'gameover_571': require('../../assets/sounds/candidates/gameover_571.wav'),
  'gameover_2941': require('../../assets/sounds/candidates/gameover_2941.wav'),
  'gameover_2960': require('../../assets/sounds/candidates/gameover_2960.wav'),
  'gameover_3053': require('../../assets/sounds/candidates/gameover_3053.wav'),
};

class SoundManager {
  private players: Record<string, AudioPlayer> = {};
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
      });

      for (const key of Object.keys(SOUND_FILES)) {
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

  private play(key: string, rate: number = 1.0) {
    if (!useSettingsStore.getState().isSoundEnabled) return;
    let player = this.players[key];
    if (!player) {
      const fallbackKey = key.startsWith('swoosh') ? 'swoosh' : 
                          key.startsWith('incorrect') ? 'incorrect' :
                          key.startsWith('gameover') ? 'gameover' : '';
      player = this.players[fallbackKey];
    }
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

  playSwoosh() {
    const id = useSettingsStore.getState().swooshSoundId || 'default';
    const key = id === 'default' ? 'swoosh' : `swoosh_${id}`;
    this.play(key);
  }
  
  playCorrect(combo: number = 0) {
    const rate = Math.min(1.0 + (combo * 0.05), 1.6);
    this.play('correct', rate);
  }

  playIncorrect() {
    const id = useSettingsStore.getState().incorrectSoundId || 'default';
    const key = id === 'default' ? 'incorrect' : `incorrect_${id}`;
    this.play(key);
  }

  playGameOver() {
    const id = useSettingsStore.getState().gameoverSoundId || 'default';
    const key = id === 'default' ? 'gameover' : `gameover_${id}`;
    this.play(key);
  }

  playWin() { this.play('win'); }
  playPurchase() { this.play('purchase'); }

  testIncorrect(id: string) {
    const key = id === 'default' ? 'incorrect' : `incorrect_${id}`;
    this.play(key);
  }

  testGameOver(id: string) {
    const key = id === 'default' ? 'gameover' : `gameover_${id}`;
    this.play(key);
  }

  testSwoosh(id: string) {
    const key = id === 'default' ? 'swoosh' : `swoosh_${id}`;
    this.play(key);
  }

  unload() {
    for (const key of Object.keys(this.players)) {
      try {
        this.players[key]?.remove();
      } catch (_) {}
    }
    this.players = {};
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();
