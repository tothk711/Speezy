# Špeezy — Multiplayer (v2.65)

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
