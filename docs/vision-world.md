# Tripwrights world: home port, the globe, the yachts, the islands

**Plan a vacation as easily as you play Diner Dash.** (And on the shop side, the Utilitarian POS: do your job as easily as
Diner Dash.) Everything is a place you tap, drawn from above in Josie's hand with the shared universe kit
(`utilatarian/art/README.md`). No rig, no fixed country: home port is anywhere your heart is.

## Levels

1. **Home port** (`#`). A lodge on a grassy bluff you could live in: the hearth, books, wetsuits drying, a surfboard, two
   armchairs on a rug, a ginger cat, and **the globe** by the fire. The terrace has an umbrella, loungers and a brass telescope;
   a sandy path runs down to the pier.
   - **Globe**: opens the full-screen globe.
   - **Medevac helicopter** on its pad (old field-hospital style: glass bubble, lattice tail, a stretcher pod on each skid): **Cover**. Travel, health and dive insurance and evacuation, arranged for the days you plan (later; not sold yet).
   - The lawn and beach: a fire pit with log seats, a hammock, flower beds, a flagpole, a bench, the boathouse, kayaks, an outdoor shower, lamp posts down the path and the pier.
   - **Seaplane** at the float dock: **Getting there**. For the Caribbean: fly into San Pedro Sula, the bus to La Ceiba, the ferry to Utila (or a small plane), and Josie's ready when you land. Each leg links to who sells it and can go in the plan like a place. The seaplane also sits on every region map ("Getting here").
   - **One 100 m expedition vessel per region** at the pier, each custom to its region: board it to go there.
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
| Caribbean (live) | Utila, Roatán, Guanaja | orange-and-white passenger catamaran, after the Utila ferry (no logos): sundeck bow, saloon with seats and a snack bar, dive gear, dinghy and rods on the stern deck | coral `#E9735C` |
| Southeast Asia (soon) | Koh Tao, Koh Phangan, Koh Samui | yacht-support ship: plumb bow, superstructure forward, working deck aft with a crane, dive tender, hobie cat and a little yellow sub | violet `#8A6BB8` |

A new region is a `TW.REGIONS` entry in `data.js` (name, lon/lat, colors, islands with map positions). Its yacht is
`J.yacht(p, colors, kind)` from the kit (`'cat'` or `'shadow'`); the superstructure's aft end is cut away to show the cabins and dining room.

## Files
`index.html` (HUD, sheets), `data.js` (regions, islands, places), `globe.js`, `scenes.js` (home, region, island),
`app.js` (routes, plan), `art/` (synced kit, `land.js` generated from world-atlas).

## Not now
Utilatab (payments, FX) and Cover are named, not built. Hours are embedded samples until the hub's place cards are read live.

## The arc (why it is one app)
Plan a week here, stay a month as a divemaster trainee, become a divemaster: the plan becomes your "what's on", Josie's ordering
and your dive schedule, then the dive shop's crew app, all one ecosystem and one account. See `utilatarian/VISION.md`,
"One ecosystem, one person's whole arc".
