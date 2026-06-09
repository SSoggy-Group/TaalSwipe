export interface SpellingItem {
  id: number;
  text: string;
  isCorrect: boolean;
  correction?: string;
}

export const spellingData: SpellingItem[] = [
  // ── Correct spellings ────────────────────────────────
  { id: 1, text: 'Hij wordt boos', isCorrect: true },
  { id: 2, text: 'Zij vindt het leuk', isCorrect: true },
  { id: 3, text: 'Pannenkoek', isCorrect: true },
  { id: 4, text: 'Geïnteresseerd', isCorrect: true },
  { id: 5, text: 'Angstvallig', isCorrect: true },
  { id: 6, text: 'Sympathiek', isCorrect: true },
  { id: 7, text: 'Cadeau', isCorrect: true },
  { id: 8, text: 'Bureaucratie', isCorrect: true },
  { id: 9, text: 'Eigenlijk', isCorrect: true },
  { id: 10, text: 'Geëmancipeerd', isCorrect: true },
  { id: 11, text: 'Choqueren', isCorrect: true },
  { id: 12, text: 'Cappuccino', isCorrect: true },

  // ── Incorrect spellings ──────────────────────────────
  { id: 13, text: 'Me fiets is kapot', isCorrect: false, correction: 'Mijn fiets is kapot' },
  { id: 14, text: 'Hij word boos', isCorrect: false, correction: 'Hij wordt boos' },
  { id: 15, text: 'Ik heb het geziend', isCorrect: false, correction: 'Ik heb het gezien → gezien' },
  { id: 16, text: 'Aggressief', isCorrect: false, correction: 'Agressief' },
  { id: 17, text: 'Geintresseerd', isCorrect: false, correction: 'Geïnteresseerd' },
  { id: 18, text: 'Sympatiek', isCorrect: false, correction: 'Sympathiek' },
  { id: 19, text: 'Zij vind het leuk', isCorrect: false, correction: 'Zij vindt het leuk' },
  { id: 20, text: 'Cappucino', isCorrect: false, correction: 'Cappuccino' },
  { id: 21, text: 'Burgemeester doet goed', isCorrect: true },
  { id: 22, text: 'Reünie', isCorrect: true },
  { id: 23, text: 'Kontakt', isCorrect: false, correction: 'Contact' },
  { id: 24, text: 'Extreem koud weer', isCorrect: true },
  { id: 25, text: 'Dacquoise', isCorrect: true },
];
