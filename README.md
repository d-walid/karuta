# Karuta

A web-based blind test game inspired by the traditional Japanese Karuta card game.

## Description

Karuta is a memory and music recognition game. Cards are displayed on screen, each representing a work. A music clip plays each round and you must find the two matching cards before the timer runs out.

## Rules

- Cards are displayed on screen (2 per work)
- A music clip plays each round, find the matching pair before time runs out
- Click the 2 cards matching the music to score
- **Correct card** → points awarded, card highlights
- **Wrong card** → penalty
- **Pair found** → both cards disappear, next round
- **Timer expires, 0 found** → both cards disappear, penalty
- **Timer expires, 1 found** → missing card disappears, no additional penalty

## Stack

- **React + TypeScript** — Vite
- **Zustand** — state management
- **Framer Motion** — animations
- **Howler.js** — audio
- **React Router** — routing
- **Supabase** — database + file storage
- **Netlify** — deployment

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.