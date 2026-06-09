import { statsStore } from '../store/statsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('statsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return default stats when storage is empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const stats = await statsStore.getStats();
    expect(stats.totalSwipes).toBe(0);
    expect(stats.xp).toBe(0);
    expect(stats.highScores.straattaal).toBe(0);
  });

  it('should save stats correctly', async () => {
    const defaultStats = await statsStore.getStats();
    defaultStats.xp = 100;
    
    await statsStore.saveStats(defaultStats);
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@taalswipe_stats',
      expect.stringContaining('"xp":100')
    );
  });
});
