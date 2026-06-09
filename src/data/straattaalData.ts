export interface StraattaalItem {
  id: number;
  word: string;
  definition: string;
  isReal: boolean;
}

export const straattaalData: StraattaalItem[] = [
  // ── Real Dutch street slang ──────────────────────────
  { id: 1, word: 'Fissa', definition: 'Een feestje / party', isReal: true },
  { id: 2, word: 'Mocro', definition: 'Iemand van Marokkaanse afkomst', isReal: true },
  { id: 3, word: 'Swaffelen', definition: 'Ergens tegenaan slaan met je piemel', isReal: true },
  { id: 4, word: 'Parra', definition: 'Paranoia / gestrest zijn', isReal: true },
  { id: 5, word: 'Sjansen', definition: 'Flirten of versieren', isReal: true },
  { id: 6, word: 'Bansen', definition: 'Snel weggaan / vluchten', isReal: true },
  { id: 7, word: 'Gestoord', definition: 'Heel cool of indrukwekkend', isReal: true },
  { id: 8, word: 'Hansen', definition: 'Hangen / chillen op straat', isReal: true },
  { id: 9, word: 'Paansen', definition: 'Vertrekken / weggaan', isReal: true },
  { id: 10, word: 'Skull', definition: 'Zoveel mogelijk drinken in een keer', isReal: true },
  { id: 11, word: 'Wollah', definition: 'Ik zweer het / echt waar', isReal: true },
  { id: 12, word: 'Flex', definition: 'Opscheppen / laten zien wat je hebt', isReal: true },
  { id: 13, word: 'Doekoe', definition: 'Geld', isReal: true },

  // ── AI-generated fake slang ──────────────────────────
  { id: 14, word: 'Grompen', definition: 'Snel weglopen zonder reden', isReal: false },
  { id: 15, word: 'Kleppie', definition: 'Iemand die altijd te laat komt', isReal: false },
  { id: 16, word: 'Snorrelen', definition: 'Stiekem iemands eten opeten', isReal: false },
  { id: 17, word: 'Drotten', definition: 'Hard lachen om een flauwe grap', isReal: false },
  { id: 18, word: 'Pietsen', definition: 'Je fiets kwijtraken na een avond uit', isReal: false },
  { id: 19, word: 'Bliemsen', definition: 'Heel snel een bericht typen', isReal: false },
  { id: 20, word: 'Vansen', definition: 'Zonder jas naar buiten gaan in de winter', isReal: false },
  { id: 21, word: 'Knakko', definition: 'Een onhandige maar sympathieke persoon', isReal: false },
  { id: 22, word: 'Plansen', definition: 'Een plan maken maar nooit uitvoeren', isReal: false },
  { id: 23, word: 'Raffelen', definition: 'Heel snel en slordig praten', isReal: false },
  { id: 24, word: 'Tjansen', definition: 'Expres langzaam lopen om iemand te irriteren', isReal: false },
  { id: 25, word: 'Stansen', definition: 'Iets moois per ongeluk kapotmaken', isReal: false },
];
