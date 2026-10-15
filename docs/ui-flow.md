# Tripwrights — UI flow (v0)

A calm planner on top of the Utilitarian hub. Mobile first, one thumb, no login.
Goal: from opening the link to a plan you can share, in under two minutes, without reading anything.

What the old prototype taught us (kept as a lesson, not a spec): a big map-first app with groups,
certifications, four time blocks and admin lived in one 3,000-line screen. We keep the idea that the day is
split into blocks and that the map is the way in. We drop everything that isn't needed to plan a day.

## Principles
1. **One screen is home: the plan.** Everything else is a sheet that slides over it and goes away.
2. **The plan is three rows a day.** Morning, Afternoon, Evening. Nothing else to learn.
3. **Only show what is real.** A place appears in a block only if the hub says it is open then. No
   "might be open".
4. **Few words, no photos.** Names, hours, one plain sentence, links. Color does the decorating.
5. **Never a dead end.** Every empty block has one obvious next tap.

## Screens

### 1. Dates (first and only setup)
"When are you here?" Two taps: arrival day and departure day, each with Morning / Afternoon / Evening
("I land in the afternoon"). That sets which blocks exist: your first and last days are partly shaded out.
Skip is allowed (plan without dates: "Day 1, Day 2 …").

### 2. Plan (home)
```
 ┌───────────────────────────┐
 │  Utila · 4 days    [Share]│
 │  Fri  Sat  Sun  Mon  +    │  ← day strip, swipe
 ├───────────────────────────┤
 │ MORNING                   │
 │ ┌───────────────────────┐ │
 │ │ Josie's Cafe   7–3    │ │  ← filled block: place, its hours
 │ └───────────────────────┘ │
 │ AFTERNOON                 │
 │ ┌───────────────────────┐ │
 │ │  + Add something      │ │  ← empty block
 │ └───────────────────────┘ │
 │ EVENING                   │
 │ │  + Add something      │ │
 ├───────────────────────────┤
 │  [ Plan ]  [ Map ]        │  ← the only two tabs
 └───────────────────────────┘
```
- A block can hold more than one place (a stop, then another). They are shown in the order you add them,
  drag to reorder. No clock times unless the power-user mode is on (later).
- A place that closes because of a change (closed-until, holiday) is flagged right in the plan: "Closed
  Sat — move it?" with the open blocks offered. This is the hub's value showing up.

### 3. Pick for a block (the main flow)
Tap **+ Add something** on Saturday Afternoon →
the **Map** opens already filtered: "Open Saturday afternoon". Participating places are drawn big in their
own palettes, nothing else is clutter. Tap a place → place sheet (below) → **Put it here**.
Filter chips across the top: Eat · Stay · Do · Shops (from the card's `kind`). Nothing else to filter.

### 4. Map (browse flow)
Same map without a block selected. Tap a place → place sheet → **Add to…** → a small picker showing only the
day/blocks where that place is open (the others are greyed with the reason: "closed Sundays").
So both directions work: *block → place* and *place → block*.

### 5. Place sheet (bottom sheet, 60% height)
- Name, one-line blurb, in the place's palette.
- "Open now" / "Opens 7:00" and the week's hours, one line each. Closure note if any.
- Open-in-block chips for the days of your trip.
- Links: the place's site, WhatsApp, directions, creators / social (labelled links, never embedded).
- **Put it here** / **Add to…**

### 6. Share
One button. Makes a link (`/t/<trip-id>`). Whoever opens it sees the same plan; if they change it, they get
their own copy. No account. A trip is stored on the device and under that id on the hub, so a WhatsApp
Business account can claim it later without changing the link.

### 7. Day-of view (same screen, just today)
Opening the link on the day jumps to today and highlights the current block. Each stop has one-tap
directions and WhatsApp. Check-in later if shops ask for it.

## Not in v0
Groups and members, certifications, payments, reviews, photo galleries, admin, multiple islands (the
hub is one island, so no island picker yet), clock times, WhatsApp accounts.

## Island scaling
Because the map is real and participating places are the only styled things, a nearly-empty island is just
a calm map with a few big friendly buildings, and it fills in as shops join.

## Open questions
1. Is a "stop" count limit per block useful (to stop plans getting crowded), or free?
2. Do we want an "anywhere / flexible" shelf for things you want to do but haven't placed (e.g. a beach)?
3. Which kinds of places do we launch with, so the chips are right?
