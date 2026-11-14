/**
 * The number of cards that should count toward a result total.
 *
 * `currentIndex` is the zero-based index of the card currently on screen.
 * When a feedback sheet is open, that card has already been answered but the
 * index has not advanced yet, so it must be included in the total.
 */
export function getResultTotal(currentIndex: number, hasPendingFeedback: boolean): number {
  return currentIndex + (hasPendingFeedback ? 1 : 0);
}
