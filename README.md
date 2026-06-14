# TaalSwipe

<p align="center">
  <img src="assets/thumbnail.png" alt="TaalSwipe Banner" width="100%" />
</p>

TaalSwipe is a Tinder-like swipe game I built for a school project. Basically, it tests your knowledge of Dutch spelling, slang, and weird language facts. You get a flashcard with a word or sentence, and you have to swipe left or right before the panic timer runs out. 

It's super fast, a little stressful, and surprisingly addictive once you get the hang of it. I wanted to make something that actually feels like a modern mobile app rather than just another boring multiple-choice quiz.

## How to play
- **Swipe Right (Yes/True):** The word is spelled correctly, the sentence makes sense, or the statement is true.
- **Swipe Left (No/False):** The spelling is completely botched, it's fake slang, or it's just factually wrong.
- **Don't freeze up:** You have a ticking progress bar at the top of the screen. If you take too long to think, the bar turns red and you fail the round.
- **Build your combo:** The more cards you get right in a row, the higher your score multiplier goes and the more coins you rack up. If you get one wrong, your combo resets to zero.

## What's actually in it?
I added a bunch of different categories so you're not just doing boring dictation practice. Here are the main game modes you can play:

- **D/T Spelling:** The classic Dutch struggle. Is it *geüpdatet* or *geüpdate*? Is it *word* or *wordt*? This mode will expose you.
- **Dunglish:** Literal translations that sound hilarious in English (like "It rains pipe stems" or "Make that the cat wise"). You have to guess if it's a real Dutch proverb translated literally, or if I just made it up.
- **Street Slang (Straattaal):** Do you actually know what *waggie* or *fissa* means, or are you just guessing? Prove you're not a boomer.
- **Brands vs Nouns:** Is *pindakaas* a brand name, or is *Chocomel* actually just a generic noun? Some of these will really surprise you.
- **Dictionary Check:** I dug through the Van Dale dictionary to find the weirdest real words (like *snackslaaf*) and mixed them in with completely made-up nonsense.

## The Shop & Stats
You earn coins just by playing the game (and you get bonus coins for keeping a long streak). You can drop those coins in the in-game Shop to unlock cool cosmetics:
- **Backgrounds:** Swap out the standard dark mode for cool animated backgrounds like "Cyber Neon" or "Sunset".
- **Card Styles:** Change how your flashcards look. You can unlock a pixel-art card, a gold foil one, and more.

There's also a stats page tracking your total swipes, your highest combo, and your total XP so you can flex your accuracy. 

---

## Nerd Stuff (How to run it)

If you're looking at the code for grading (or you just want to run it locally), here's the tech stack. This project is built using React Native, Expo, Zustand for state management, and Tauri for the desktop app version. It's meant to run everywhere: web, iOS, Android, and native Mac/Windows.

I also used `react-native-reanimated` and `react-native-gesture-handler` to build the Tinder-style swiping physics from scratch.

### Project Layout
- `src/screens/` - All the main pages (Home, Game, Shop, Result, Stats, etc.)
- `src/components/` - The reusable UI parts like the swipable `SwipeCard`, the `ScoreBar`, and custom buttons.
- `src/store/` - Zustand stores holding your coins, stats, and equipped shop items.
- `src/data/` - The actual question databases for each category. It's very easy to add more!
- `src-tauri/` - The Rust backend stuff for the desktop build.
- `assets/` - All the app icons, splash screens, and the logo.

### Adding your own questions
Want to add more words to test your friends? Just open up one of the files in `src/data/` (like `spellingData.ts`) and drop a new object in the array. 

For example:
```typescript
{
  id: 999,
  text: "Gezamenlijk",
  isCorrect: true,
  correction: "Goed gespeld!"
}
```

### Running the dev server

**For mobile (Expo):**
First, make sure you have Node installed, then run:
```bash
npm install
npx expo start
```
Then just scan the QR code in your terminal with the Expo Go app on your phone, or hit `i` to open the iOS simulator if you have Xcode installed.

**For web:**
```bash
npm run web
```
This will spin up a local web server so you can play the game right in your browser.

**For desktop (Mac/Windows):**
You'll need Rust installed for this to work (get it from rustup.rs). Once installed:
```bash
npm run desktop:dev
```
This builds and launches a native desktop window using Tauri.

### Bypassing macOS "Damaged App" Warning
If you downloaded the pre-built Mac `.dmg` from the internet, macOS Gatekeeper might block it and say the app is "damaged" because it's an unsigned student project. 
To bypass this without using the terminal, you have two options:

**Method 1: The Right-Click Trick (Recommended)**
1. Open the `.dmg` and drag the app to your Applications folder.
2. **Do not double-click the app.** Instead, **Right-Click (or Control-Click)** the app and select **Open**.
3. A popup will appear—just click **Open** again and the game will launch normally!

**Method 2: Using Sentinel**
If you deal with a lot of indie apps on Mac, you can download a free GUI tool called [Sentinel](https://github.com/alienator88/Sentinel). It allows you to easily remove the Apple Quarantine flag from any app without having to use the terminal.
