import { dtData } from '../data/dtData';

describe('Game Logic: DT Rules', () => {
  it('should have valid dtData items', () => {
    expect(dtData.length).toBeGreaterThan(0);
    
    dtData.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('sentence');
      expect(item).toHaveProperty('correctAnswer');
      expect(item).toHaveProperty('wrongAnswer');
      expect(item).toHaveProperty('explanation');
      expect(typeof item.id).toBe('string');
      expect(typeof item.sentence).toBe('string');
      expect(typeof item.correctAnswer).toBe('string');
      expect(typeof item.wrongAnswer).toBe('string');
      expect(typeof item.explanation).toBe('string');
    });
  });
});
