# Špeezy — Multiplayer (v3.1)

A real-time multiplayer math dice game. One shared game runs forever on the
server; anyone who opens the URL joins the round in progress. Up to 6 players.

Flat layout — `index.html`, `game.js`, `server.js` and `package.json` all sit at
the top level (no `public/` folder). Drop them into your repo and push.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000 in a few tabs.

## Deploy to Railway (GitHub)
Push these files to your repo root. Railway runs `npm install` then `npm start`
and reads `PORT` automatically. (Make sure auto-deploy is enabled in
Settings → "Auto deploys when pushed to GitHub".) Don't commit `node_modules`.

## What's new in 3.1
- **Select any tile, any time.** Protected or cooling-down tiles no longer block
  clicks — select one, prewrite your equation, and press Check the instant it
  unlocks. Selecting shows how long you'll wait; the server politely tells you
  the remaining seconds if you fire too early.
- **Cooldown countdown on tiles.** After you claim a value, every other tile of
  that value shows a live countdown (same style as the steal-protection timer).
- **⚡ Surge removed.**
- **New mutator: 🃏 Joker die.** Once per round, at a random moment, a violet
  4th die (1–6) rolls in next to the others for **30 seconds**. While it's up,
  equations may use **any 3 — or all 4 — dice**, each at most once. It gets its
  own calculator key, a toast + countdown by the timer, and fades away when the
  window closes. The early "nothing left to solve" check pauses during the
  window (a joker claim might still be possible), and the window always closes
  before the ❌ crossing at 0:30 so crosses stay accurate.

## What's new in 3.0
- **Smoothness refactor:** diff-updated board (no re-render churn), 1-per-second
  light `tick` event instead of full state broadcasts, `no-store` cache headers.
- **Game feel:** dice tumble, confetti on locks, claim ripples, floating "+N",
  score pops, streak pitch (🔥×N), error buzz + shake, round-end chords, key
  clicks, 🔊 mute toggle.
- **Mobile:** fixed bottom-sheet calculator with mini timer, safe-area aware,
  hides at round end; instant resync when the tab wakes.
- **Extras:** 👑 crown on round winners, type-anywhere on desktop, Esc clears
  selection.

(Older release notes live in the Speezy2.71 folder's README.)
