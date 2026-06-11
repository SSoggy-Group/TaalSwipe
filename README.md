# TaalSwipe

Een snelle, swipe-based game (denk aan Tinder) om je Nederlandse spelling en taalweetjes te testen. Je krijgt woorden, zinnen of stellingen te zien en swipet naar links of rechts om te bepalen of het klopt of niet.

## Spelmodi

- **Merken of soortnaam?**: Is *pindakaas* een merk, of is *chocomel* een soortnaam?
- **D/T spelling**: De klassieke d/t-fouten, plus twijfelgevallen zoals *geüpdatet* vs. *geüpdate*.
- **Dunglish**: Bestaan uitspraken als *"It rains pipe stems"* echt, of is het onzin?
- **Algemene spelling**: Van *pannenkoek* tot *onmiddellijk*.
- **Straattaal**: Betekenissen van woorden als *waggie* of *fissa*.
- **Dikke Van Dale**: Bestaat het woord *snackslaaf* echt?

## Features

- **Thema's**: Spaar muntjes tijdens het spelen om nieuwe kleurenthema's te unlocken (zoals Cyber Neon of Retro Arcade).
- **Offline first**: Werkt volledig zonder internetverbinding.
- **Statistieken**: Houdt je highscores en win-ratio per categorie bij.
- **Glassmorphism UI**: Semi-transparante kaarten met vloeiende swipe-animaties.

## Tech stack

De app is gebouwd met React Native (Expo) en TypeScript:
- **State management**: Zustand (voor muntjes, thema's en statistieken).
- **Animaties**: React Native Reanimated & Gesture Handler voor de swipe-mechanics.
- **Multiplatform**: Draait op iOS, Android, web, en heeft een Tauri-wrapper voor desktop.

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
3. Scan de QR-code met de Expo Go app op je telefoon, of druk op `i` / `a` voor de simulator.

### Web & Desktop

- Web dev server: `npm run web`
- Web export: `npm run web:export`
- Desktop dev (Tauri): `npm run desktop:dev`
- Desktop build (Tauri): `npm run desktop:build`

*Opmerking voor desktop builds: zorg dat je Rust en Cargo hebt geïnstalleerd via [rustup.rs](https://rustup.rs/).*

