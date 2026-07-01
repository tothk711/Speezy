# Špeezy — Multiplayer (v3.0)

A real-time multiplayer math dice game. One shared game runs forever on the
server; anyone who opens the URL joins the round in progress. Up to 6 players.

Flat layout — `index.html`, `game.js`, `server.js` and `package.json` all sit at
the top level (no `public/` folder). Drop them into your repo and push.

## What's new in 3.0
**Smoothness refactor**
- The board is built once per round and **diff-updated in place** — CSS animations
  no longer restart on every update, hover states survive, and there's no
  per-render DOM churn. Tooltips and clicks use event delegation.
- The server no longer broadcasts the full game state every second: a tiny
  `tick` event carries the clock (~30 bytes), full state goes out only on real
  changes (claims, joins, round events).
- `index.html`/`game.js` are served with `Cache-Control: no-store`, so a fresh
  deploy shows up on a plain refresh — no more hard-refresh hunting.

**New mutator: ⚡ Surge**
- Once per round, at a random moment between 1:30 and 0:35 left, a **12-second
  surge** hits (electric toast + glow + riser sound): every claim during it is
  worth **+1 point** and adds **+10s**. Tiles claimed during a surge keep a small
  ⚡ badge. On by default, toggleable like the other mutators.

**Game feel**
- Dice **tumble and settle** one by one with little clacks on each new round.
- **Confetti burst** on every lock (bigger and gold for bounty/surge locks),
  a color ripple on every claimed tile, and a floating **"+N"** showing the
  points earned.
- Score numbers **pop** when they increase; the round winner gets a 👑 in the
  end-of-round banner.
- **Streaks:** chain claims within 12s and your success chime rises in pitch,
  with a 🔥×N tag on the floating points.
- Wrong answers get a gentle buzz + input shake; round end plays a soft chord
  (up for a cleared board, down for time-up). Quiet clicks on calculator keys.
- 🔊 **mute toggle** (top-right, remembered).

**Mobile**
- The calculator is now a **fixed bottom sheet** — always reachable while the
  board scrolls, safe-area aware, with a **mini timer** in its header and
  comfier keys. It hides at round end so you can browse solutions.
- The tab resyncs instantly when you come back to it (phones suspend sockets
  in the background).

**Desktop QoL**
- Start typing anywhere — digits/operators go straight into the equation.
- `Esc` clears the selection.

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

## What's new in 2.71
- Stronger colour tint on the calculator (the 2.7 hint was too faint).
- You can type **`s` as shorthand for sqrt** (e.g. `s4` = 2).
- Mobile layout is ~10% more compact (trimmed calculator dead space); the rolled-
  numbers box is back in its original spot above the board.

## What's new in 2.7
- The **rolled-numbers box is tinted with your selected colour** (clear border +
  glow), and the calculator gets a subtle hint of it, so it's obvious which colour
  you're playing.
- **Bounty nerf:** locking the bounty pair now scores **4** (was 5); tiles still 2 each.
- **Mobile:** the rolled-numbers box now sits **right under the calculator**.
- The "Bounty!" pop now shows for **2 seconds** only.

## What's new in 2.65
- All three mutators (❌ 💡 💰) are now **on by default**.
- Rewrote the "How it works" section to be shorter and clearer.

## What's new in 2.64 (bounty polish)
- The 💰 bounty ring now **pulses only for the first 20 seconds** of a round, then
  settles to a steady gold border + badge.
- Once the bounty pair is **locked**, the gold ring is dropped entirely — it looks
  like a normal locked pair, just with the 💰 badge in the top-left corner.

## What's new in 2.63
- **Fixed the 💰 Bounty toggle.** Its checkbox was never wired to the server, so
  ticking it did nothing and it reverted on the next update (and New Game). Now it
  actually enables the bounty for the next round, like the other two mutators.

## What's new in 2.62 (mobile overlap, really fixed)
- The phone layout no longer uses `display:contents` (which iOS Safari wasn't
  laying out reliably). It's now a plain flex column — the calculator simply
  stacks **below** the whole board and cannot overlap it.
- "How it works" is relocated to the very bottom on mobile so the calculator sits
  directly under the numbers.
- NOTE: if the board still looks wrong after deploying, the live site is probably
  a stale build — confirm Railway redeployed (auto-deploy ON) and hard-refresh.

## What's new in 2.61 (mobile layout fixes)
- **Fixed the calculator overlapping the board.** The phone layout now stacks in a
  real single column and the calculator no longer keeps its desktop "sticky"
  position, so board numbers can't hide behind it.
- **Dice emoji are back** next to the rolled numbers on mobile (just smaller).

## What's new in 2.6
- **Third mutator: 💰 Bounty.** A new toggle alongside ❌ and 💡. When on, each
  new round the server marks one pair — chosen so **both halves are solvable** —
  as the gold bounty:
  - Each bounty tile is worth **2** points; **locking the whole pair pays 5**
    (a split bounty pair is 2 each).
  - The pair gets a pulsing **gold ring + 💰 badge**, and a bouncy **"💰 Bounty!"**
    bubble points at it on round start, with a gentle gold chime (and a celebratory
    chime when someone locks it).
  - Like the other mutators it's shared, off by default, and applies next round.
