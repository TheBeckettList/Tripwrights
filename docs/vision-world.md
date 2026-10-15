# Tripwrights world: home port, the globe, the yachts, the islands

**Plan a vacation as easily as you play Diner Dash.** (And on the shop side, the Utilitarian POS: do your job as easily as
Diner Dash.) Everything is a place you tap, drawn from above in Josie's hand with the shared universe kit
(`utilatarian/art/README.md`). No rig, no fixed country: home port is anywhere your heart is.

## Levels

1. **Home port** (`#`). A lodge on a grassy bluff you could live in: the hearth, books, wetsuits drying, a surfboard, two
   armchairs on a rug, a ginger cat, and **the globe** by the fire. The terrace has an umbrella, loungers and a brass telescope;
   a sandy path runs down to the pier.
   - **Globe**: opens the full-screen globe.
   - **Helicopter** on the lawn: **Cover**. Travel and dive insurance, evacuation, arranged for the days you plan (later; not sold yet).
   - **Seaplane** at the float dock: hop straight to any island.
   - **One adventure yacht per region** at the pier: board it to go to that region.
2. **The globe** (`#globe`). A simplified real Earth (Natural Earth 110m coastlines) in the island style: green land with a
   sand edge, clouds, the ball's darker ledge. The regions we serve glow in their own colors. Spin it; tap a region and it
   turns to face you, then you are aboard that region's yacht.
3. **A region** (`#r/caribbean`, `#r/seasia`). Its islands across the top in our style (places running our POS show as pins
   in their own colors), and the region's yacht drawn huge below. **Every station on deck is an activity**: rest (bow net,
   loungers), sail, dive (tank racks, the flag), eat (the table under the umbrella), stay (the cabins), snorkel and paddle
   (the swim platform), fish (rods at the stern). Tap one: the places in the region that offer it.
4. **An island** (`#i/utila`). Its real places as their simplified selves, flags where the next shops go. Your yacht pulls
   up to a place; its sheet opens in the place's own colors: pick the day and Morning / Afternoon / Evening (only when it is
   really open).
5. **A place's own map** (Josie's, Paradise) lives with the place.

## Regions now
| region | islands | yacht | color |
|---|---|---|---|
| Caribbean (live) | Utila, Roatán, Guanaja | white sloop, coral stripe, dive deck | coral `#E9735C` |
| Southeast Asia (soon) | Koh Tao, Koh Phangan, Koh Samui | junk sail with battens, lanterns | violet `#8A6BB8` |

A new region is a `TW.REGIONS` entry in `data.js` (name, lon/lat, colors, islands with map positions). Its yacht is
`J.yacht(p, colors, kind)` from the kit; a new `kind` changes only the rig.

## Files
`index.html` (HUD, sheets), `data.js` (regions, islands, places), `globe.js`, `scenes.js` (home, region, island),
`app.js` (routes, plan), `art/` (synced kit, `land.js` generated from world-atlas).

## Not now
Utilatab (payments, FX) and Cover are named, not built. Hours are embedded samples until the hub's place cards are read live.
