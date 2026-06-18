# Špeezy — Multiplayer (v2.4)

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

## What's new in 2.4
- **Timer recentred.** The clock now sits dead-centre of the stats bar (directly
  above the middle die) using a 1fr / auto / 1fr grid, so it no longer drifts
  sideways as players' scores change.
- **Multiplayer stability fix.** Players now have a stable identity, so a brief
  network drop no longer leaves them with a dead, unclickable board:
  - Each browser tab gets a persistent **client id**; the server keys colors to
    that id (not the socket), so a reconnect **reclaims the same color** even if
    the old connection hasn't timed out yet. A short **grace period** holds the
    color for a quick return.
  - **Auto-resync watchdog:** if a client stops hearing from the server it asks
    for a fresh state (and on every reconnect), so a missed update self-heals.
  - **Crash-proof board:** the grid is rebuilt off-screen and swapped in atomically,
    and all socket/render handlers are wrapped — a transient error can't wipe the
    board. Colorless clients now show a clear **"spectating"** hint.
  - Server-side handlers are wrapped in error handling so one bad action can't
    wedge a connection.
