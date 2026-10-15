# Tripwrights world: the rig, the areas, the stops

*Animal Crossing, but planning a vacation.* Everything is a place you walk (or sail) to, drawn from above in Josie's hand
(see `utilatarian/art/README.md`). Not a literal oil rig: think **Atlantis-style sea habitat**, a repurposed platform
off the coast of England that feels believable enough to be a real outfitter's base.

## Three levels

1. **The rig (home).** A platform on legs in a grey-green North Sea, chalk cliffs and a lighthouse on the horizon.
   - **Globe hall:** the giant globe (or map) is how you pick an area.
   - **Helipad + helicopter** and a **jetty with a float plane**: tours and hops (flights, later real bookings).
   - **A pier with one adventure boat per area.** Walk down it and tap a boat to go.
   - Container cabins in each area's color, a garden deck, a crane: scenery that makes it a place.
2. **An area (island overview).** The island from above in the area's own sea; participating shops drawn big in their *own*
   palettes (Josie's pink, Paradise's blue); open plots with a flag where the next shop will go. Real shape and
   coordinates underneath (see hub README); stylised only where somebody participates.
3. **A stop.** Tap a place: your boat pulls up to the island dock, then the place's sheet opens in the place's own colors:
   pick the day, add Morning / Afternoon / Evening (only blocks it is really open). The plan is kept on the device.

## Fleet (one unique boat per area, carrying that area's gear, in its own palette)
| area | boat | gear | accent |
|---|---|---|---|
| Utila | dive boat | tank racks, dive flag | tank yellow |
| Roatán | sailing catamaran | trampoline net, fins, mask | coral |
| Guanaja | panga | fishing rods, coolers | jade |
| Koh Tao | longtail | ribbons on the bow, backpack, parasol | violet |

New areas add a boat kind to `art/kit.js` (`P.boatKind`) and an entry under `areas` in `art/palettes.json`.

## Not now (planned, not designed here)
Utilatab, the whole-trip app: payments, FX hedging and the rest. Nothing in this prototype assumes it; plans and stops
are plain data so it can sit on top later.

## Prototype status
`index.html` + `rig.js` (scenes) + `app.js` (flow). Only Utila has places (Josie's and Paradise are real; Paradise's courses carry SSI/PADI and the card each needs, matched against the diver's card).
Hours are embedded samples until the hub's place cards are read live.
