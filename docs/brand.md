# Tripwrights — look and voice (v0)

**An expedition outfitter's front room.** Blue and trustworthy. The kind of place you'd walk into before the
Arctic or the reef: a tall ship at the dock, an old bubble helicopter out back, a bronze diving helmet on the
shelf, skis by the door, dive gear on pegs. The same people also know the best spa, where to sleep, and where
to eat, and will pack your spear gun without comment. Adventure, and the comfortable end of it.

Not pink, not neon, not "startup". Calm and capable. It sits in the Utilitarian family (calm, map-first,
no photo walls), and each shop on the map keeps its own colors on top of this.

## Color (tokens; light first, dark variant follows the same names)

| token | value | use |
|---|---|---|
| `ink` | `#0F2A43` deep navy | text, headings, the helmet-shadow |
| `sea` | `#1F5F8B` | primary blue: buttons, active tab, links |
| `tide` | `#4A90B8` | secondary blue: map water accents, chips |
| `ice` | `#E8F1F6` | page background, calm panels |
| `paper` | `#F6F1E7` | cards, plan rows (warm, like a chart or logbook) |
| `brass` | `#B8873B` | the accent: rules, stars, highlights. Never small text on paper (low contrast) |
| `brass-ink` | `#2A1D07` | text on brass |
| `kelp` | `#3E7C6B` | open / ready |
| `rust` | `#C8553D` | closed / needs attention (a signal color, used sparingly) |
| dark mode | ink background `#0B1E31`, text `#EAF2F7`, same accents lightened | |

Rule: one blue does the work (`sea`); brass is jewelry; green and rust only mean open/closed or ready/needs.
Shops are tinted in their *own* palette on their pins and sheets, never recolored to ours.

## Type
- Headings: a sturdy serif with expedition-poster character (suggest *Fraunces* or *Bitter*), used big and
  sparing. Fallback: Georgia.
- Body and numbers: plain sans (system stack: `-apple-system, Segoe UI, Roboto, sans-serif`), so it works
  offline on old phones. Hours use tabular numerals.
- Sentence case. No all-caps shouting; small-caps for "MORNING / AFTERNOON / EVENING" only.

## Illustration (the vibe lives here, not in photos)
Flat, hand-drawn, two or three tones from the palette, thick friendly outline, no gradients.
- **Block icons:** Morning = sun over water, Afternoon = sail, Evening = ship's lantern.
- **Kinds:** Do = compass, Eat = pot/pan, Stay = lantern + bunk, Rest/spa = shell, Shop/gear = helmet,
  Transport = tall ship / old bubble helicopter.
- **Empty states:** the bubble helicopter parked out back, the tall ship at the dock with a "back soon" flag.
- **Map:** muted real map (chart paper feel: pale water, thin coast line, a few compass marks), participating
  places drawn big in their own palette. Where nobody participates it stays a quiet chart.
- **Corners and dividers:** rope or brass rule, used lightly. No skeuomorphic textures.

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
