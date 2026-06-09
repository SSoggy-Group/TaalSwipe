import { createAudioPlayer, AudioPlayer } from 'expo-audio';

class SoundManager {
  private swooshPlayer: AudioPlayer | null = null;
  private correctPlayer: AudioPlayer | null = null;
  private incorrectPlayer: AudioPlayer | null = null;

  async init() {
    // Sound Manager ported to Expo SDK 56 + expo-audio.
    // Uncomment these and point to valid assets to enable audio:
    try {
      /*
      this.swooshPlayer = createAudioPlayer(require('../../assets/sounds/swoosh.mp3'));
      this.correctPlayer = createAudioPlayer(require('../../assets/sounds/correct.mp3'));
      this.incorrectPlayer = createAudioPlayer(require('../../assets/sounds/incorrect.mp3'));
      */
    } catch (e) {
      console.warn('Failed to load sounds', e);
    }
  }

  playSwoosh() {
    if (this.swooshPlayer) {
      this.swooshPlayer.seekTo(0);
      this.swooshPlayer.play();
    }
  }

  playCorrect(combo: number = 0) {
    if (this.correctPlayer) {
      const rate = Math.min(1.0 + (combo * 0.05), 1.6);
      this.correctPlayer.playbackRate = rate;
      this.correctPlayer.seekTo(0);
      this.correctPlayer.play();
    }
  }

  playIncorrect() {
    if (this.incorrectPlayer) {
      this.incorrectPlayer.seekTo(0);
      this.incorrectPlayer.play();
    }
  }

  unload() {
    // expo-audio handles garbage collection automatically.
    // Setting references to null is sufficient.
    this.swooshPlayer = null;
    this.correctPlayer = null;
    this.incorrectPlayer = null;
  }
}

export const soundManager = new SoundManager();
