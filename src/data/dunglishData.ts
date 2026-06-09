export interface DunglishItem {
  id: number;
  text: string;
  explanation: string;
  isRealProverb: boolean;
}

export const dunglishData: DunglishItem[] = [
  // ── Real Dutch proverbs literally translated ─────────
  {
    id: 1,
    text: 'Now the monkey comes out of the sleeve',
    explanation: 'Nu komt de aap uit de mouw — The truth is revealed',
    isRealProverb: true,
  },
  {
    id: 2,
    text: 'Unfortunately peanut butter',
    explanation: 'Helaas pindakaas — Too bad, so sad',
    isRealProverb: true,
  },
  {
    id: 3,
    text: 'To fall with your nose in the butter',
    explanation: 'Met je neus in de boter vallen — To be very lucky',
    isRealProverb: true,
  },
  {
    id: 4,
    text: 'Make that the cat wise',
    explanation: 'Maak dat de kat wijs — Tell that to someone gullible',
    isRealProverb: true,
  },
  {
    id: 5,
    text: 'It rains pipe stems',
    explanation: 'Het regent pijpenstelen — It is raining very hard',
    isRealProverb: true,
  },
  {
    id: 6,
    text: 'To have a board before your head',
    explanation: 'Een plank voor je hoofd hebben — To be clueless',
    isRealProverb: true,
  },
  {
    id: 7,
    text: 'The best helmsmen stand on shore',
    explanation: 'De beste stuurlui staan aan wal — Everyone\'s an expert from the sidelines',
    isRealProverb: true,
  },
  {
    id: 8,
    text: 'Now comes the donkey out of the stable',
    explanation: 'Daar komt het aapje uit het mouwje — The hidden problem surfaces',
    isRealProverb: true,
  },
  {
    id: 9,
    text: 'To walk on your toes',
    explanation: 'Op je tenen lopen — To tread carefully / be cautious',
    isRealProverb: true,
  },
  {
    id: 10,
    text: 'He who has butter on his head should stay out of the sun',
    explanation: 'Wie boter op zijn hoofd heeft, moet uit de zon blijven — If you\'re guilty, don\'t draw attention',
    isRealProverb: true,
  },
  {
    id: 11,
    text: 'To hit the nail on the head',
    explanation: 'De spijker op de kop slaan — To be exactly right',
    isRealProverb: true,
  },
  {
    id: 12,
    text: 'That\'s mustard after the meal',
    explanation: 'Dat is mosterd na de maaltijd — That\'s too late to be useful',
    isRealProverb: true,
  },
  {
    id: 13,
    text: 'Tall trees catch a lot of wind',
    explanation: 'Hoge bomen vangen veel wind — Important people attract criticism',
    isRealProverb: true,
  },

  // ── Fake Dunglish proverbs ───────────────────────────
  {
    id: 14,
    text: 'The tree falls next to the bicycle',
    explanation: 'Not a real proverb — just Dutch-sounding nonsense',
    isRealProverb: false,
  },
  {
    id: 15,
    text: 'You can\'t milk a tulip in December',
    explanation: 'Not a real proverb — fake Dutch wisdom',
    isRealProverb: false,
  },
  {
    id: 16,
    text: 'The cheese slides off the windmill',
    explanation: 'Not a real proverb — stereotypical Dutch words combined',
    isRealProverb: false,
  },
  {
    id: 17,
    text: 'Who sleeps with wooden shoes loses his socks',
    explanation: 'Not a real proverb — sounds Dutch but is nonsense',
    isRealProverb: false,
  },
  {
    id: 18,
    text: 'A herring in the hand is worth two in the canal',
    explanation: 'Not a real proverb — Dutch-themed twist on familiar English one',
    isRealProverb: false,
  },
  {
    id: 19,
    text: 'The dike doesn\'t break from one raindrop',
    explanation: 'Not a real proverb — sounds plausible but doesn\'t exist',
    isRealProverb: false,
  },
  {
    id: 20,
    text: 'Don\'t count your stroopwafels before they\'re baked',
    explanation: 'Not a real proverb — Dutch food + English proverb mashup',
    isRealProverb: false,
  },
  {
    id: 21,
    text: 'Even the longest boat fits through the smallest bridge',
    explanation: 'Not a real proverb — canal-themed fake wisdom',
    isRealProverb: false,
  },
  {
    id: 22,
    text: 'A clean clog makes no noise on the cobblestones',
    explanation: 'Not a real proverb — typical Dutch imagery, zero meaning',
    isRealProverb: false,
  },
  {
    id: 23,
    text: 'Two tulips don\'t make a garden',
    explanation: 'Not a real proverb — flower-themed fake',
    isRealProverb: false,
  },
  {
    id: 24,
    text: 'The windmill turns but the miller sleeps',
    explanation: 'Not a real proverb — plausible but invented',
    isRealProverb: false,
  },
  {
    id: 25,
    text: 'He who cycles against the wind arrives sweaty',
    explanation: 'Not a real proverb — Dutch cycling cliché',
    isRealProverb: false,
  },
];
