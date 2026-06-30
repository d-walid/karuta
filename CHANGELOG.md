# Changelog

## [0.4.0]

**New theme**
- Movie theme added — 48 films, selectable from the home page alongside Anime

**Gameplay**
- Combo system: 2 points per card instead of 1 once 3 consecutive pairs are found without error
- Speed bonus: +1 point per card if found within 5 seconds of the music starting (stacks with combo)
- Score floor enforced at 0 across all scoring paths

**UI**
- Points popup (+N / -N) fades in on each card click to show exactly what was earned
- HUD redesigned: icons and distinct colors per badge (Score, Errors, Round, Time)
- Combo badge pulses while active, with its own accent color
- Home page rules updated to reflect combo and speed bonus scoring

**Bug fixes**
- Fixed React "setState during render" warning from the round timer
- Fixed found pair card not flashing green when it completed the match

---

## [0.3.0]

**New features**
- Nickname input before starting a game (saved between sessions)
- Live stopwatch in the HUD during the game
- Leaderboard on the home page, top scores sorted by score then time
- Scores are saved to the database at the end of each game

**Gameplay**
- Score floor at 0, score can no longer go negative
- Missing cards are now revealed in gold at the end of a round before disappearing
- Found cards flash green before disappearing when a pair is completed

**UI**
- Home page redesigned
- Time displayed in mm:ss:ms format on results screen and leaderboard

**Bug fixes**
- Fixed duplicate score submission when navigating back to the results screen

---

## [0.2.0]

**UI/UX**
- Smooth Timerbar with color transitions (green / orange / red)
- Improved card animations

**Gameplay**
- Round indicator in HUD
- 2s freeze between rounds before next music plays
- Results screen enriched with Found/Missed

**Bug fixes**
- Fixed early click bug during transitions
- Fixed back-to-menu navigation bug
- Fixed F5 page refresh on Netlify (SPA routing)

---

## [0.1.0]

**Initial release**
- Vite + React + TypeScript project setup
- 70 works, 140 cards, 70 musics stored in Supabase
- 30 random works selected per game
- Core gameplay: 30 cards displayed, 30s timer per round, pair matching
- Zustand store with persisted volume
- Howler.js audio with play/stop
- Framer Motion animations
- Deployed on Netlify