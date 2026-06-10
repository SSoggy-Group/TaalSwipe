# TaalSwipe 📱👆

Welkom bij **TaalSwipe**! Dit is geen standaard saaie taal-app, maar een snelle, swipe-based game (denk aan Tinder, maar dan voor spelling en taalweetjes). Je krijgt woorden, zinnen of spreekwoorden op je scherm en het is aan jou om supersnel te bepalen: is dit goed of fout? Echt of verzonnen?

Het doel? Je reactievermogen en je taalkennis testen, zonder dat het voelt als huiswerk.

## 🎮 Wat kun je spelen?

We hebben verschillende game modes om je hersens te laten kraken:

- **Merken of Soortnaam?** - Is *Pindakaas* een merk, of is *Chocomel* gewoon een soortnaam? Swipe links of rechts!
- **D/T Spelling** - De absolute nachtmerrie van iedereen. *Ik vind* of *hij vindt*? *Geüpdatet* of *Geüpdate*?
- **Dunglish (Steenkolenengels)** - Bestaat de uitspraak *"It rains pipe stems"* echt, of is het dikke onzin?
- **Spelling** - Hoe schrijf je *pannenkoek* of *onmiddellijk*? 
- **Straattaal** - Weet jij wat *waggie* of *fissa* betekent, of verzin ik hier maar wat?
- **Dikke Van Dale** - Bestaat het woord *snackslaaf* echt in het woordenboek?

## ✨ Features

- **Glassmorphism Design**: De UI zweeft, is semi-transparant en voelt super soepel aan (3D-ish bouncy feel).
- **Shop & Thema's**: Verdien muntjes door te spelen en koop nieuwe kleurthema's (zoals *Cyber Neon*, *Ocean Breeze* of *Retro Arcade*) om de app helemaal naar jouw smaak aan te passen.
- **Offline First**: Je hebt geen internet nodig om te spelen. Alles laadt bliksemsnel in.
- **Uitgebreide Statistieken**: Houd je win-ratio en highscores per categorie bij.

## 🛠️ Tech Stack

Ik heb dit gebouwd met een focus op performance en een strakke UI:

- **React Native (Expo)** - Voor een naadloze app op zowel iOS als Android.
- **TypeScript** - Omdat we geen onverwachte type-errors willen tijdens het swipen.
- **Zustand** - Voor bliksemsnelle, lichtgewicht state management (voor je muntjes, thema's en statistieken).
- **React Native Reanimated & Gesture Handler** - Voor die boterzachte 60fps swipe-animaties en springende knoppen.

## 🚀 Aan de slag

Zelf proberen of meehelpen bouwen? Super simpel:

1. Clone deze repo.
2. Installeer de packages: `npm install`
3. Start de development server: `npx expo start`
4. Scan de QR-code met je telefoon (Expo Go app) of druk op `i` om de iOS simulator te starten.

## 🌐 Web & desktop

TaalSwipe kan nu ook als web build draaien en heeft een Tauri-shell voor macOS en Windows.

- Web development: `npm run web`
- Web export: `npm run web:export`
- Desktop development: `npm run desktop:dev`
- Desktop build: `npm run desktop:build`

Voor desktop builds heb je Rust/Cargo nodig via [rustup.rs](https://rustup.rs/). De desktop-app gebruikt dezelfde Expo Web build, dus de game blijft TypeScript/React Native.

---
*Gemaakt met veel koffie, zweet, en frustratie over d/t fouten.*
