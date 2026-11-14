import { getResultTotal } from '../utils/gameTotals';

describe('getResultTotal', () => {
  it('counts only completed cards when no feedback is pending', () => {
    expect(getResultTotal(0, false)).toBe(0);
    expect(getResultTotal(5, false)).toBe(5);
  });

  it('includes the card whose feedback is still open', () => {
    expect(getResultTotal(0, true)).toBe(1);
    expect(getResultTotal(5, true)).toBe(6);
  });
});
