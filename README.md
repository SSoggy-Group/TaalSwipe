<p align="center">
  <img src="assets/logo.png" alt="TaalSwipe logo" width="140" />
</p>

# TaalSwipe

TaalSwipe is a swipe game for Dutch spelling, slang, grammar, and word knowledge. You get a card with a word or sentence and swipe left or right before the timer runs out.

[![Build and Release App](https://github.com/SSoggy-Group/TaalSwipe/actions/workflows/build-apk.yml/badge.svg)](https://github.com/SSoggy-Group/TaalSwipe/actions/workflows/build-apk.yml) 
[![Deploy to GitHub Pages](https://github.com/SSoggy-Group/TaalSwipe/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/SSoggy-Group/TaalSwipe/actions/workflows/deploy-pages.yml)

## How to play
- **Right:** correct, real, or existing.
- **Left:** incorrect, fake, or made up.
- **Beat the timer:** the bar at the top runs down. If it empties, the round ends.
- **Build a combo:** correct answers in a row earn more XP. One mistake resets it.

## Modes
- **Straattaal of AI?** — Real slang or AI nonsense?
- **Steenkolenengels** — A real proverb or a literal translation?
- **Speed-spelling** — Correctly spelled or not? The clock is running.
- **D/t-grammatica** — Pick the right verb form.
- **Dikke Van Dale** — In the dictionary or made up?
- **Merk of soort?** — Brand name or generic word?
- **Multiplayer** — Two players, one screen. First to 15 points wins.

## Shop and stats
You earn XP by playing. Spend it on themes, card styles, power-ups, and XP boosters. The stats page tracks rounds, combos, correct answers, and records.

---

## How to run it

TaalSwipe uses React Native, Expo, Zustand, and Tauri. It runs on web, iOS, Android, macOS, and Windows.

Swipe physics use `react-native-reanimated` and `react-native-gesture-handler`.

### Project layout
- `src/screens/` — Home, Game, Shop, Result, Stats, and the rest.
- `src/components/` — shared UI such as `SwipeCard`, `ScoreBar`, and buttons.
- `src/store/` — Zustand stores for XP, stats, and shop items.
- `src/data/` — question data for each mode.
- `src-tauri/` — desktop shell.
- `assets/` — app icons, splash screens, and the logo.

### Adding questions
Add an entry to one of the arrays in `src/data/`, such as `spellingData.ts`:

For example:
```typescript
{
  id: 999,
  text: "Gezamenlijk",
  isCorrect: true,
  correction: "Goed gespeld!"
}
```

### Development

**Mobile (Expo):**
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go, or press `i` for the iOS simulator.

**Web:**
```bash
npm run web
```
Starts the local web server.

**Desktop (macOS/Windows):**
Install Rust from [rustup.rs](https://rustup.rs), then:
```bash
npm run desktop:dev
```
This builds and launches the Tauri window.

### Release signing

Android release APKs are signed with a private keystore that CI reads from GitHub Actions secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD`.

Without those secrets (for example on a fork) the build falls back to the debug keystore. Keep a backup of the release keystore: if it is lost, installed apps can no longer receive updates under the same identity.

### Bypassing macOS "Damaged App" Warning
If you downloaded the pre-built Mac `.dmg` from the internet, macOS Gatekeeper might block it and say the app is "damaged" because it's an unsigned student project. 
To bypass this without using the terminal, you have two options:

**Method 1: The Right-Click Trick (Recommended)**
1. Open the `.dmg` and drag the app to your Applications folder.
2. **Do not double-click the app.** Instead, **Right-Click (or Control-Click)** the app and select **Open**.
3. A popup will appear—just click **Open** again and the game will launch normally!

**Method 2: Using Sentinel**
If you deal with a lot of indie apps on Mac, you can download a free GUI tool called [Sentinel](https://github.com/alienator88/Sentinel). It allows you to easily remove the Apple Quarantine flag from any app without having to use the terminal.
