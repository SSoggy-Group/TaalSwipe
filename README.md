# TaalSwipe

TaalSwipe is een snelle swipe-game (net als Tinder) waarmee je kunt testen hoe goed je bent in Nederlandse spelling en gekke taalweetjes. Je krijgt kaarten te zien met woorden, zinnen of stellingen. Je moet snel beslissen en swipet naar links of naar rechts!

## Hoe speel je het?

- **Swipe naar rechts**: als het woord of de zin op de kaart **klopt** (of als het antwoord 'ja' is).
- **Swipe naar links**: als de kaart **fout** is (of als het antwoord 'nee' is).
- **Wees snel**: je hebt maar een paar seconden per kaart om te swipen. Als de tijdbalk leeg is, ben je af!
- **Maak streaks**: hoe meer goede antwoorden je achter elkaar geeft, hoe hoger je score en hoe meer munten je verdient.

## De Categorieën

Je kunt kiezen uit verschillende categorieën om te spelen:

- **Merken of soortnaam?**: Is *pindakaas* een merknaam, of is *chocomel* stiekem een soortnaam? Swipe links of rechts!
- **D/T spelling**: De ultieme test voor d/t-fouten en irritante woorden zoals *geüpdatet* vs. *geüpdate*.
- **Dunglish**: Klopt de Engelse zin, of is het letterlijk vertaald Nederlands (steenkolenengels)? Zoals *"It rains pipe stems"*.
- **Algemene spelling**: Van *pannenkoek* tot *onmiddellijk*. Handig als oefening voor je volgende dictee.
- **Straattaal**: Weet jij wat *waggie* of *fissa* betekent, of hebben we het ter plekke verzonnen?
- **Dikke Van Dale**: Bestaat het woord *snackslaaf* echt in het woordenboek, of is het onzin?

## Munten verdienen en de Shop

Tijdens het spelen verdien je munten. Die munten kun je uitgeven in de **Shop**:
- **Achtergronden**: Verander de look van je game met thema's zoals *Cyber Neon*, *Sunset* of *Matrix*.
- **Kaarten**: Koop nieuwe designs voor de swipe-kaarten, zoals een gouden kaart of een retro pixel-kaart.

Op het stats-scherm kun je precies zien hoeveel XP je al hebt en wat je highscore per categorie is.

---

## Voor Developers (Tech Info)

### Projectstructuur

De code is opgedeeld in een paar duidelijke mappen:

- **`src/screens/`**: De schermen van de app (Home, Game, Result, Shop, Stats, Settings).
- **`src/components/`**: Losse onderdelen zoals de swipe-kaarten (`SwipeCard`) en knoppen.
- **`src/store/`**: Zustand-stores voor de app-data:
  - `settingsStore.ts`: Beheert je munten, geluiden, haptische feedback en gekochte thema's.
  - `statsStore.ts`: Slaat je highscores en XP op.
- **`src/data/`**: Hier staan alle vragen per categorie.
- **`src/theme/`**: De kleuren en thema's (`colors.ts`).
- **`src-tauri/`**: Tauri-configuratie om de app als desktop-app te bouwen.

### Vragen toevoegen of aanpassen

De vragen staan in de bestanden in `src/data/`. Elk vraag-object gebruikt dit type:

```typescript
export interface SpellingItem {
  id: string | number;     // Uniek ID (nummer of tekst)
  text: string;            // Het woord of de zin op de kaart
  isCorrect: boolean;      // true = swipe rechts (goed), false = swipe links (fout)
  correction?: string;     // Uitleg die je ziet als je het fout hebt gedaan
}
```

#### Voorbeeld
Als je een nieuwe vraag wilt toevoegen aan de spellingcategorie, open dan `src/data/spellingData.ts` en zet dit in de lijst:

```typescript
{
  id: "gezamenlijk-goed",
  text: "Gezamenlijk",
  isCorrect: true,
  correction: "Goed gespeld!"
},
{
  id: "gezamenlijk-fout",
  text: "Gezamelijk",
  isCorrect: false,
  correction: "Fout! Het is 'Gezamenlijk' met een tussen-n."
}
```

### Ontwikkeling

#### Mobiel (Expo)

1. Dependencies installeren:
   ```bash
   npm install
   ```
2. Dev server starten:
   ```bash
   npx expo start
   ```
3. Scan de QR-code met Expo Go op je telefoon, of druk op `i` (iOS) / `a` (Android) voor een simulator.

#### Web & Desktop

- Web dev server: `npm run web`
- Web build exporteren: `npm run web:export`
- Desktop dev (Tauri): `npm run desktop:dev`
- Desktop build (Tauri): `npm run desktop:build`

*Voor de desktop-build moet je Rust en Cargo geïnstalleerd hebben via [rustup.rs](https://rustup.rs/).*



