# TaalSwipe

Een snelle, swipe-based game (denk aan Tinder) om je Nederlandse spelling en taalweetjes te testen. Je krijgt woorden, zinnen of stellingen te zien en swipet naar links of rechts om te bepalen of het klopt of niet.

## Spelmodi

- **Merken of soortnaam?**: Is *pindakaas* een merk, of is *chocomel* een soortnaam?
- **D/T spelling**: De klassieke d/t-fouten, plus twijfelgevallen zoals *geüpdatet* vs. *geüpdate*.
- **Dunglish**: Bestaan uitspraken als *"It rains pipe stems"* echt, of is het onzin?
- **Algemene spelling**: Van *pannenkoek* tot *onmiddellijk*.
- **Straattaal**: Betekenissen van woorden als *waggie* of *fissa*.
- **Dikke Van Dale**: Bestaat het woord *snackslaaf* echt?

## Architectuur & Mappenstructuur

Het project is opgezet met een duidelijke scheiding tussen data, state en UI:

- **`src/screens/`**: Bevat de belangrijkste schermen van de app, waaronder `HomeScreen`, `GameScreen` (waar de swipe-logica leeft), `ResultScreen`, `ShopScreen`, `StatsScreen` en `SettingsScreen`.
- **`src/components/`**: Herbruikbare UI-componenten zoals `SwipeCard`, `ThemeCard` en custom buttons.
- **`src/store/`**: Bevat Zustand-stores voor globale state:
  - `settingsStore.ts`: Beheert sound effects, haptische feedback, muntjes en ontgrendelde/geactiveerde thema's.
  - `statsStore.ts`: Houdt de highscores, ervaringspunten (XP) en beantwoorde vragen per categorie bij.
- **`src/data/`**: De datasets met woorden en stellingen per categorie.
- **`src/theme/`**: Dynamische kleurschema's (`colors.ts`) die reageren op systeeminstellingen (dark/light) en de shop-items.
- **`src-tauri/`**: De Tauri-wrapper waarmee de app als native desktop applicatie gebouwd kan worden.

## Vragen toevoegen of bewerken

De data per spelmodus bevindt zich in `src/data/`. Elke dataset exporteert een array van objecten die voldoen aan dit type:

```typescript
export interface SpellingItem {
  id: string | number;     // Unieke identifier
  text: string;            // Het getoonde woord of de zin
  isCorrect: boolean;      // Swipe rechts = true (goed), swipe links = false (fout)
  correction?: string;     // Optionele uitleg of correctie als de speler het fout heeft
}
```

### Voorbeeld

Wil je een nieuwe vraag toevoegen aan de spellingmodus? Open `src/data/spellingData.ts` en voeg een object toe aan de array:

```typescript
{
  id: "nieuw-woord-1",
  text: "Gezamenlijk",
  isCorrect: true,
  correction: "Goed gespeld!"
},
{
  id: "nieuw-woord-2",
  text: "Gezamelijk",
  isCorrect: false,
  correction: "Fout! Het is 'Gezamenlijk' met een tussen-n."
}
```

## Thema's & Shop

Gebruikers verdienen muntjes door games te spelen. Met deze muntjes kunnen ze in de shop nieuwe achtergronden (`equippedBackground`) en kaartstijlen (`equippedCard`) kopen. 

Deze thema's zijn gedefinieerd in `src/theme/colors.ts`. De hook `useAppTheme` leest de actieve selectie uit de `settingsStore` en vertaalt dit naar de juiste kleurcodes (zoals gradient layers en transparantieniveaus voor de glassmorphism UI).

## Ontwikkeling

### Mobiel (Expo)

1. Installeer dependencies:
   ```bash
   npm install
   ```
2. Start Expo:
   ```bash
   npx expo start
   ```
3. Scan de QR-code met de Expo Go app op je telefoon, of druk op `i` / `a` voor de iOS of Android simulator.

### Web & Desktop

- Web dev server: `npm run web`
- Web export: `npm run web:export`
- Desktop dev (Tauri): `npm run desktop:dev`
- Desktop build (Tauri): `npm run desktop:build`

*Opmerking voor desktop builds: zorg dat je Rust en Cargo hebt geïnstalleerd via [rustup.rs](https://rustup.rs/). De desktop-app draait op Tauri en laadt een geoptimaliseerde web build van de Expo-app.*


