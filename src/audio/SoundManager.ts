import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { useSettingsStore } from '../store/settingsStore';

type SoundKey = 'swoosh' | 'correct' | 'incorrect' | 'gameover' | 'win' | 'purchase';

const SOUND_FILES: Record<SoundKey, any> = {
  swoosh: require('../../assets/sounds/swoosh.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  incorrect: require('../../assets/sounds/incorrect_soft.wav'),
  gameover: require('../../assets/sounds/gameover.wav'),
  win: require('../../assets/sounds/win.wav'),
  purchase: require('../../assets/sounds/purchase.wav'),
};

class SoundManager {
  private players: Partial<Record<SoundKey, AudioPlayer>> = {};
  private lastPlayedAt: Partial<Record<SoundKey, number>> = {};
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: 'mixWithOthers',
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

  private play(key: SoundKey, minInterval: number = 0) {
    if (!useSettingsStore.getState().isSoundEnabled) return;

    const now = Date.now();
    if (minInterval > 0 && now - (this.lastPlayedAt[key] ?? 0) < minInterval) return;

    const player = this.players[key];
    if (!player) {
      console.warn(`[SoundManager] Player "${key}" not loaded`);
      return;
    }
    this.lastPlayedAt[key] = now;

    try {
      // Pause before seeking so a replayed cue never clicks or stretches a
      // sound that is still ringing out.
      player.pause();
      player.seekTo(0);
      player.play();
    } catch (e) {
      console.warn(`[SoundManager] Error playing "${key}":`, e);
    }
  }

  playSwoosh() {
    this.play('swoosh', 90);
  }

  playCorrect() {
    // One calm cue per answer; no pitch shift, which made fast answers chirp.
    this.play('correct', 260);
  }

  playIncorrect() {
    this.play('incorrect', 320);
  }

  playGameOver() {
    this.play('gameover', 800);
  }

  playWin() {
    this.play('win', 800);
  }

  playPurchase() {
    this.play('purchase', 400);
  }

  unload() {
    for (const key of Object.keys(this.players) as SoundKey[]) {
      try {
        this.players[key]?.remove();
      } catch (error) {
        // Player removal error can be safely ignored
      }
    }
    this.players = {};
    this.lastPlayedAt = {};
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();
