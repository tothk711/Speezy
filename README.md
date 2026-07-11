# Špeezy — Multiplayer (v4.4)

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

## What's new in 4.4
- **Streaks are a spectacle now.** Collection streaks are tracked for every
  player (not just you): the streaker's score in the top bar catches fire for
  a second (🔥 flame + glow pulse), the floating "+N 🔥×streak" text grows with
  the streak, and your own success chime still climbs in pitch.
- **Duplicate dice dim correctly.** With a roll like 3·3·10, tapping the
  second "3" key now greys out *that* key, not the first one.
- **Three new dopamine hits:** a full-screen edge glow flashes in the locker's
  color on every pair lock (gold for bounty locks); the board deals itself in
  with a staggered cascade at round start; and round end fires a winner
  celebration — confetti burst over the banner + edge glow in the winner's
  color.

## What's new in 4.3
- **The extras drawer actually opens now.** Root cause of it appearing to do
  nothing: the app shell used `position:fixed` on the `<body>`, which iOS
  Safari handles erratically (it also caused 4.1's white background). The
  shell is now a fixed **div** (`.wrap`) with native inner touch-scrolling —
  the reliable mobile-web pattern. Opening the drawer smooth-scrolls the shell
  down to it; closing snaps back to a fits-on-one-screen game.

## What's new in 4.2
- **Dark theme restored on mobile** (iOS stopped propagating the body
  background once the app shell made the body fixed — the base color now also
  lives on `<html>`).
- **No more sideways scrolling** (the inner scroller is `overflow-x:hidden`).
- **New mobile structure, per Vit's design:** the calculator sits in normal
  flow right under the board (no longer pinned to the screen bottom — no
  height-measuring needed), and the "Players · Mutators · Help" drawer lives
  *below* the calculator; opening it grows the page and smooth-scrolls down to
  it. The calculator is ~10% taller for comfier keys.

## What's new in 4.1
- **Time bonuses retuned:** +2s / +5s / +10s / +15s / +20s (was +5 through
  +25) — each segment a notch lower.
- **Zero page scroll on mobile.** The mobile layout is now a fixed app shell:
  the body never scrolls (no rubber-banding, no empty void under the board),
  the content area ends exactly at the calculator's top edge (its real height
  is measured live), and only overflows internally when the extras drawer is
  open. Hint/bounty bubbles track the inner scroller.

## What's new in 4.0 — the phone release
- **No more screen jumps.** Tapping a tile or calculator key no longer scrolls
  the page: the equation field is never focused on mobile (Safari scroll-jumps
  to focused inputs), editing is append-style there, and tapping the field
  itself is inert. The board and calculator stay exactly where they are.
- **Extras live in a drawer.** Mutators, the player roster and "How it works"
  are tucked into a thin "Players · Mutators · Help" bar under the board —
  hidden by default, one tap to expand. The whole game (stats, dice, board,
  calculator) now fits on screen with room to spare. Desktop is unchanged.
- **Overlaps fixed.** The top is now one static row (status · title · buttons)
  that can't overlap the score bar, and the dice strip has clearance from the
  stats above and the bounty badges below.

## What's new in 3.5.1
- **Three big-number pairs join the rotation:** `120+240`, `360+720` and
  `100+1024`. Numbers picked empirically (solver coverage across all 108
  possible rolls) and paired to maximize joint lockability (75% / 54% / 44% of
  rolls can lock them — factorials and powers do the heavy lifting).
- Solver value cap raised 1000 → 1024 so the new tile is solvable and gets
  crossed/hinted correctly.

## What's new in 3.5
- **Zoom is dead on mobile.** Double-tap zoom no longer fires anywhere in the
  mobile layout (`touch-action:manipulation` page-wide + `maximum-scale=1` set
  dynamically while mobile is active), and pinch-zoom is blocked via gesture
  events. Desktop keeps normal zooming.
- **Calmer phase countdown.** The last-10s countdown now lives in a
  permanently reserved slot inside the chip and just fades in — the pill never
  changes size ("10s" → "9s" used to resize it every second). The warning
  pulse is slower and softer.
- **Smoother phase morph.** The grow-swap-shrink is now a gentle 1.5s
  sequence: softer scale (1.35×, no bounce), the label cross-fades instead of
  snapping, and the pill width glides to its new size while the text is
  invisible — no more jitter.

## What's new in 3.4
- **Last-10-seconds phase warning.** The phase chip shows a countdown only for
  the final 10s of a phase (pulsing gently), and the joker die blinks when it's
  about to vanish. No full-time clock — just a heads-up when it matters.
- **No more abrupt endings.** When the joker phase expires and nothing is left
  to solve, the round no longer slams shut instantly: the chip morphs to
  "🏁 Ending · 5s" and winds down with soft ticks before settling. A successful
  claim cancels the wind-down; settles caused by your own final claim are still
  instant.
- **"How it works" trimmed:** the phases bullet and the prewrite/brackets
  bullet are gone (the game teaches these by playing).

## What's new in 3.3
- **Phase announcements are calmer:** the big center-screen toast is gone. The
  phase chip itself grows ~1.75× for half a second, the label swaps while it's
  big (with a shine sweep), then it settles back down.
- **No countdown in the phase chip** — two clocks running next to each other
  was distracting; you learn the phase timings after a round or two.
- **Joker rebalanced:** the phase now starts at **1:00** (was 1:10), and the
  rule is stricter — **all three base dice are still required**; the joker is
  an optional 4th number you may add to the mix.
- **Mobile fits (much closer to) one screen:** board tiles are shorter instead
  of square, the calculator sheet, dice, header, stats and roster are all
  tighter. The important parts — stats, dice, board, calculator — now fit a
  phone viewport without the calculator swallowing the bottom board row.

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
