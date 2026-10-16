# Tripwrights

Plan a vacation as easily as you play a game. Spin the globe, board a region's expedition vessel, pick what to do, put it in a morning, afternoon or evening.

**Demo:** https://thebeckettlist.github.io/Tripwrights/ (static site, no build; publish the repo root with GitHub Pages).

## What's real in the demo
- **Josie's Cafe** is a real place. Tapping her opens her live site, josiescafe.com, inside Tripwrights (her map, menu board and ordering run on her own data; nothing is copied).
- **The dive shop** (named Paradise in the data, a copy of its page lives in `places/paradise/`) is a stand-in to show how a dive shop, its courses, a diver's card and a front desk fit in. Its map has planning pins; the dive board and the front desk talk to Tripwrights.
- Everything else (other islands, Southeast Asia, getting-there times) is sample. The Cover helicopter and booking are not built yet.
- Your plan is saved on your device only. No login.

## Try it
1. Tap the globe by the fire, then the Caribbean.
2. Tap **Dive** on the vessel, pick the dive shop: you step inside its map. Tap the **Plan dives** pin at the dive board (choose your card, add a block) or the **Stay** pin at the front desk (book rooms, extend nights).
3. Tap an island, then Josie's: you step inside her real, live site (her map, scenes and menu board). **+ Plan** adds her to your day; **←** goes back to the island.
4. Back home, tap the seaplane for **Getting there** (fly, bus, ferry) and add legs to your plan.
5. **Plan** (top right) shows your week.

## Files
`index.html` (page and controls) · `data.js` (regions, islands, places, routes) · `globe.js` · `scenes.js` (home, region, island drawings) · `app.js` (routes and plan) · `art/` (shared drawing kit, copied from the art hub) · `docs/` (vision, flow, brand, diver layer).
