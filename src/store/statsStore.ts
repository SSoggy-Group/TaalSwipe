import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppStats {
  totalSwipes: number;
  highestCombo: number;
  xp: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string | null;
  highScores: {
    straattaal: number;
    dunglish: number;
    spelling: number;
    dt: number;
    vandale: number;
    brand: number;
  };
  tutorialSeen: {
    straattaal: boolean;
    dunglish: boolean;
    spelling: boolean;
    dt: boolean;
    vandale: boolean;
    brand: boolean;
  };
  unlockedItems: string[];
  shields: number;
  timeSlows: number;
  hints: number;
  xpMultiplier: number;
  seenHistory: Record<string, string[]>;
}

const DEFAULT_STATS: AppStats = {
  totalSwipes: 0,
  highestCombo: 0,
  xp: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
  highScores: {
    straattaal: 0,
    dunglish: 0,
    spelling: 0,
    dt: 0,
    vandale: 0,
    brand: 0,
  },
  tutorialSeen: {
    straattaal: false,
    dunglish: false,
    spelling: false,
    dt: false,
    vandale: false,
    brand: false,
  },
  unlockedItems: [],
  shields: 0,
  timeSlows: 0,
  hints: 0,
  xpMultiplier: 1,
  seenHistory: {},
};

const STATS_KEY = '@taalswipe_stats';

export const getPlayerTitle = (xp: number) => {
  if (xp < 100) return 'Taal-Noob';
  if (xp < 500) return 'Woord-Wap';
  if (xp < 1000) return 'Taal-Strijder';
  if (xp < 2500) return 'Vocab-Viking';
  if (xp < 5000) return 'Woordkunstenaar';
  return 'Taal-Koning';
};

export const statsStore = {
  async getStats(): Promise<AppStats> {
    try {
      const data = await AsyncStorage.getItem(STATS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...DEFAULT_STATS, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    }
    return DEFAULT_STATS;
  },

  async saveStats(stats: AppStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  },

  async resetStats(): Promise<void> {
    try {
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
    } catch (e) {
      console.error('Failed to reset stats', e);
    }
  },
  
  async updateStreak(): Promise<AppStats> {
    const stats = await this.getStats();
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastPlayedDate === today) {
      // Already played today
      return stats;
    }

    if (stats.lastPlayedDate) {
      const lastPlayed = new Date(stats.lastPlayedDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (stats.lastPlayedDate === yesterdayStr) {
        // Kept streak alive
        stats.currentStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
      } else {
        // Streak broken
        stats.currentStreak = 1;
      }
    } else {
      // First time playing
      stats.currentStreak = 1;
      stats.bestStreak = 1;
    }

    stats.lastPlayedDate = today;
    await this.saveStats(stats);
    return stats;
  },

  async markAsSeen(mode: string, wordId: string): Promise<void> {
    const stats = await this.getStats();
    if (!stats.seenHistory) {
      stats.seenHistory = {};
    }
    if (!stats.seenHistory[mode]) {
      stats.seenHistory[mode] = [];
    }
    
    // Add to history and keep only the last 150 items
    // (We expanded databases to 256, so keeping 150 prevents repeats for a long time
    // while still leaving ~100 completely fresh cards in the pool)
    stats.seenHistory[mode] = stats.seenHistory[mode].filter(id => id !== wordId);
    stats.seenHistory[mode].push(wordId);
    
    if (stats.seenHistory[mode].length > 150) {
      stats.seenHistory[mode] = stats.seenHistory[mode].slice(-150);
    }

    await this.saveStats(stats);
  }
};
