# Špeezy — Multiplayer (v2.2)

A real-time multiplayer math dice game. One shared game runs forever on the
server; anyone who opens the URL joins the round in progress. Up to 6 players
(one per color: Sky, Pink, Lime, Violet, Amber, Teal); extra visitors spectate.

## Files
- `server.js` — Express + Socket.IO server (one always-running game room).
- `game.js` — shared logic: math engine, computer solver, rules, and the
  authoritative `Game` state machine. Also served to the browser.
- `public/index.html` — the game client.
- `package.json` — dependencies + start script.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000 in a few tabs to test.

## Deploy to Railway (from GitHub)
1. Put these files in a GitHub repo (flat at the root is fine — keep
   `index.html`, `game.js`, `server.js`, `package.json`). Don't commit `node_modules`.
2. Railway → New Project → Deploy from GitHub repo → pick it. Runs `npm install`
   then `npm start`, reads `PORT` automatically.
3. Service → Settings → Networking → Generate Domain. Share the URL.

## What's new in 2.2
- Calculator messages fade out after 5 seconds.
- Left-side player roster (aligned with the timer box): your editable 2-letter
  initials, the color, and that color's points across the last 5 rounds.
- One unified, server-driven sound when any tile is taken (same for everyone);
  distinct sounds for locking a pair and for a steal.
- Protected tiles show a live ticking countdown; bigger emotes on tiles; the
  frozen "wait Xs" text was removed from calculator messages.
- Mutations toggle (under the calculator). First one: **Premature crossing off** —
  when on, impossible tiles get the red ✗ at the 0:30 mark. Off by default; a
  change takes effect on the next board (after New Game).

## Notes
No accounts, no lobbies, no anti-cheat — built for a trusted group of friends.
A single server instance keeps the game in memory (perfect for one group).
