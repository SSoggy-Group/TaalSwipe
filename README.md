# TaalSwipe

<p align="center">
  <img src="assets/thumbnail.png" alt="TaalSwipe Banner" width="100%" />
</p>

# TaalSwipe

<p align="center">
  <img src="assets/thumbnail.png" alt="TaalSwipe Banner" width="100%" />
</p>

TaalSwipe is a Tinder-like swipe game I built for a school project. Basically, it tests your knowledge of Dutch spelling, slang, and weird language facts. You get a card with a word or sentence, and you have to swipe left or right before the timer runs out. 

It's super fast, a little stressful, and surprisingly addictive.

## How to play
- **Swipe Right (Yes/True):** The word is spelled correctly, the sentence makes sense, or the statement is true.
- **Swipe Left (No/False):** The spelling is completely botched, it's fake slang, or it's just wrong.
- **Don't take too long:** You have a ticking progress bar. If you freeze up, you're dead.
- **Keep the streak alive:** The more you get right in a row, the higher your score and the more coins you rack up.

## What's actually in it?
I added a bunch of different categories so it's not just boring dictation practice:
- **D/T Spelling:** The classic Dutch struggle. Is it *geüpdatet* or *geüpdate*? 
- **Dunglish:** Literal translations that sound hilarious in English (like "It rains pipe stems").
- **Street Slang:** Do you actually know what *waggie* or *fissa* means, or are you just guessing?
- **Brands vs Nouns:** Is *pindakaas* a brand, or is *Chocomel* actually just a generic noun? 
- **Dictionary Check:** Fake words vs real words that somehow made it into the Van Dale dictionary (like *snackslaaf*).

## The Shop & Stats
You earn coins just by playing. You can drop those coins in the Shop to unlock cool backgrounds (like Cyber Neon or Sunset) and new card designs (like a pixel-art card or a gold foil one). There's also a stats page tracking your highest combo and total XP so you can flex your accuracy.

---

## Nerd Stuff (How to run it)

This project is built using React Native, Expo, Zustand for state management, and Tauri for the desktop app version. It's meant to run everywhere: web, iOS, Android, and Mac/Windows.

### Project Layout
- `src/screens/` - All the main pages (Home, Game, Shop, etc.)
- `src/components/` - The UI parts like the swipable cards and buttons
- `src/store/` - Zustand stores holding your coins, stats, and settings
- `src/data/` - The actual questions for each category. Easy to add more!
- `src-tauri/` - The Rust backend stuff for the desktop build

### Adding your own questions
Want to add more words? Just open up one of the files in `src/data/` (like `spellingData.ts`) and drop a new object in the array:

```typescript
{
  id: "gezamenlijk-goed",
  text: "Gezamenlijk",
  isCorrect: true,
  correction: "Goed gespeld!"
}
```

### Running the dev server

**For mobile (Expo):**
```bash
npm install
npx expo start
```
Then just scan the QR code with the Expo Go app on your phone, or hit `i` to open the iOS simulator.

**For web:**
```bash
npm run web
```

**For desktop (Mac/Windows):**
You'll need Rust installed for this to work (get it from rustup.rs).
```bash
npm run desktop:dev
```



