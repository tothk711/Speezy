# Špeezy — Multiplayer (v3.2)

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

## What's new in 3.2
- **Bracket rescue on both ends.** A missing `(` at the start is now fixed the
  same way a missing `)` at the end always was — `4+5)*2` evaluates as
  `(4+5)*2` in the live preview, in claims, and in the stored equation.
- **The round now flows through phases** (shown in a color-morphing chip next
  to the dice, with a countdown to the next phase):
  - 🍦 **Vanilla** — above 1:10, the normal game.
  - 🃏 **Joker** — from 1:10 to 0:30 (if the 🃏 mutator is on): the 4th die
    joins and equations may use any 3 or all 4 dice. Time bonuses stretch the
    phase — phases never rewind.
  - 🧹 **Cleanup** — below 0:30 (if ❌ is on): the joker die is gone for good
    and impossible tiles get crossed. With ❌ off it's a plain ⏱ Endgame.
  - Early "nothing left to solve" detection now waits while a joker phase is
    still coming, and re-checks the moment the joker chance is gone.
- **Less boxy look:** the dice float free on the page (your player color tints
  the dice themselves now), the mutations row lost its border, and the score
  bar got softer. Phase transitions pop with a shine sweep + sound.

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
