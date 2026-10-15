# Tripwrights — look and voice (v0)

**An expedition outfitter's front room.** Blue and trustworthy. The kind of place you'd walk into before the
Arctic or the reef: a tall ship at the dock, an old bubble helicopter out back, a bronze diving helmet on the
shelf, skis by the door, dive gear on pegs. The same people also know the best spa, where to sleep, and where
to eat, and will pack your spear gun without comment. Adventure, and the comfortable end of it.

Not pink, not neon, not "startup". Calm and capable. It sits in the Utilitarian family (calm, map-first,
no photo walls), and each shop on the map keeps its own colors on top of this.

## Style: one island, one hand
Tripwrights is drawn in the shared island art kit (`utilatarian/art/`, copied here to `art/`), with **Josie's Cafe as the
reference**: seen from above, flat soft shapes, **no outlines and no gradients**, one soft ground shadow, round corners, white
cards with a soft ring, pill buttons with a darker ledge. Sand, sea, wood, plants and rocks are the *shared* island colors;
Tripwrights' own color, **sea blue**, appears only on what is Tripwrights (buttons, active chips, the hull, the name plate).
Shops on the map keep their own palette on their pins and sheets, never recolored to ours.

## Color
Tokens live in `art/palettes.json` (`tripwrights`), light and dark, and are generated into `art/tokens.css`. Do not hand-edit.

| token | light | use |
|---|---|---|
| `ink` | `#0F2A43` | text, headings |
| `paper` | `#E8F1F6` | page background (cool, to sit beside Josie's warm cream) |
| `card` | `#FFFFFF` | cards, sheets (with a `soft` ring) |
| `accent` | `#1F5F8B` | buttons, active chips, the hull; `accent-ink` is white on it |
| `soft` / `wash` | `#A9CFE3` / `#D8E9F2` | rings, chip and row backgrounds |
| `pop` | `#C9953F` brass | jewelry only: a rope, a star, a dial. Never small text |
| `edge` | `#12405F` | the ledge under a pressed button |

Green and rose mean open/closed only (shared `ok` / `closed` tokens) and always come with an icon or a word.
Dark mode: navy page `#0B1E31`, cards `#14314B`, the accent lightens to sea glass `#6FB0CF`.

## Type
Same as Josie's: **Baloo 2** for headings, numbers and labels; **Nunito** for text (with a system fallback so it works offline on old
phones). Sentence case; small-caps style only for MORNING / AFTERNOON / EVENING. Hours use tabular numerals. No serif.

## Illustration (the vibe lives here, not in photos)
Flat, hand-drawn, two or three tones per object, from above, soft shadow, no outlines (an edge is a darker shape underneath).
- **Home** is the sea-habitat "rig" with a globe hall, helipad, float plane and a pier of area boats (`index.html`, `rig.js`); see `docs/vision-rig.md`. The earlier ship cutaway is superseded.
- **Block icons:** Morning = sun over water, Afternoon = sail, Evening = ship's lantern.
- **Kinds:** Do = compass, Eat = pot/pan, Stay = lantern + bunk, Rest/spa = shell, Shop/gear = helmet, Transport = tall ship / bubble helicopter.
- **Empty states:** the bubble helicopter parked out back, the tall ship at the dock with a "back soon" flag.
- **Map:** the real map, quietly skinned; participating places drawn big in their own palette (see the hub README).
- **Corners and dividers:** a rope or a brass rule, used lightly. Fill a free corner with a pot or a rock, like Josie's.

## Voice
Warm, plain, a little dry. A capable old expedition outfitter, not a hype man.
- "Pick where Saturday afternoon goes." not "Craft your dream itinerary!"
- "Closed Sundays. Move it to Saturday?" not "Oops!"
- Packing and advice read like a note from someone who has done it: short, specific, honest.
- Never lecture about certification or safety; state the fact and the next step.

## Product ideas this suggests (not committed)
- **Pack list**, built from the plan (dive days → dive gear and logbook; spa → swimsuit; evening → layer).
- **Kinds** now include **Rest** (spa, massage, quiet) beside Do / Eat / Stay / Shop, so a day can be
  planned for rest as easily as for an adventure.
- A small **logbook** view after the trip: what you actually did, shareable. (A reason to come back.)

## Accessibility
Text on `paper` or `ice` uses `ink`. White text only on `sea` or darker. Open/closed is never color alone
(icon + word). Tap targets at least 44 px. Works at 320 px wide.
