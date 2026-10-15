# Tripwrights — the diver layer (v0 design)

Tripwrights stays a calm day planner. For divers it adds one idea: **every activity can ask "who is this
for?", and the planner answers it for each person in the group before anyone gets to the dock.**
Finding out at the dive shop that you need a doctor's signature, or a refresher, is the problem we remove.

Sources for the agency facts below are listed at the end. Shops and agencies have the last word; the
planner *flags* and never promises.

## How certification actually works (what we have to model)

- **Learn to dive (e.g. PADI Open Water, SSI, SDI…).** Three parts: *knowledge* (usually eLearning, can be
  done at home before the trip), *confined water* (pool or pool-like), and *open water* (four dives, usually
  over two days). About 3–4 days on location when the eLearning is done in advance. Minimum age is 10
  (junior certification until 15). Swim test: 200 m and a 10 minute float.
- **Medical.** Everyone fills in the diver medical questionnaire (the RSTC form, revised 2020). If any
  answer flags a condition, a physician has to sign before in-water training. Some places require a doctor
  regardless. This must be done *before* arriving, not at the dock.
- **Try-a-dive (Discover Scuba).** No certificate, instructor-led, shallow, shorter medical on the day.
- **Already certified.** The diver brings a card (agency, level, often a number), the shop checks it.
  Shops commonly want to see recent dives and may require a check-out/refresher dive after a long gap
  (the length of the gap is the shop's policy, not an industry rule).
- **Referral.** Start knowledge and pool at home with one shop, finish open water dives on the island with
  another; the second shop needs the referral paperwork and the medical clearance.
- **Levels ladder (any agency):** try-a-dive → supervised → **autonomous (Open Water)** → Advanced → Rescue
  → Divemaster / dive leader → Instructor. ISO 24801 gives the shared tiers (1 supervised, 2 autonomous,
  3 dive leader); agencies' names for them differ, and not every agency maps cleanly, so we store the
  agency's own name *and* a normalised tier that a human (the shop) can correct.
- **No-fly.** After diving, wait before flying: common guidance is 12 h after one no-decompression dive, 18 h
  after repeated dives or several days of diving, and many people use 24 h. The planner treats the last
  dive block as "no flying within X h" and warns when the departure block is too close.
- **Specialties** that gate activities: Nitrox, Deep, Night, Wreck, Drift… (each with an agency name).

## The traveler profile (the only thing we ask about a person)

```
name · age
diver?   never · try-a-dive only · certified
if certified:
  agency + level (pick lists)  →  tier (auto, editable)
  card number or photo (optional, stays on the device until a shop asks)
  specialties (checkboxes)
  last dive (month) · rough number of dives
medical: not started · questionnaire done, all no · needs doctor sign-off · signed
```

No logins. A profile is kept on the device and travels with the trip link. A WhatsApp account later makes it
portable across devices.

## Requirements on the activity (what shops publish in their place card)

Each activity or offering a shop lists carries requirements the planner can check:

| requirement | example |
|---|---|
| `min_tier` | 2 (autonomous) — "Advanced reef dive" |
| `min_age` | 10 |
| `needs_medical` | true for anything in the water |
| `max_depth_m` / `specialty` | "Deep wall, needs Deep" |
| `checkout_after_months` | shop policy, e.g. 12 → flags "needs a refresher dive first" |
| `blocks` | which blocks it runs in (dives are mornings; night dive is evening) |
| `prep` | "arrive 45 min earlier", "no flying afterward" |

These live in the place card (`offerings`), so a shop can change a rule once and every trip updates.

## UI flow additions

1. **Who's coming? (once, quick).** Add people with a first name and age. Each gets a coloured dot. For
   each: *Not a diver / Try a dive / Certified…* — the profile above is only asked in full for certified.
   For a solo traveler this is one screen.
2. **Plan screen unchanged,** except activity rows show a small row of dots: one per person, green (ready),
   amber (needs something, tap to see), grey (not for them).
3. **Place sheet / offering sheet** says it in plain words per person:
   "Sam ✓ · Alex needs Open Water · Mia is 9, minimum age 10".
   Each amber item has **a way forward**, not just a warning (see 4).
4. **Fix it here:**
   - *Needs a certification* → **Learn to dive** template (below) or **Try a dive** instead.
   - *Needs medical sign-off* → a short "do this at home" card with the form link and a reminder date.
   - *Refresher* → the planner proposes a check-out dive as the first dive block of the trip.
   - *Wrong block* → suggests the blocks the offering runs in.
5. **Learn to dive template.** One tap drops a ready-made sequence into the plan, e.g.
   Day 0: eLearning at home (a checklist card) → Day 1 morning confined water, afternoon rest → Day 2
   two open water dives → Day 3 two more dives. The shop's real schedule replaces the template once they
   publish it.
6. **Rest and safety rules, applied quietly** (shop-configurable, sensible defaults):
   - a rest block after the last dive of the day (no stacking another activity),
   - the planner never puts a dive in the last N hours before the departure block,
   - an alert, not a block, if someone is flying soon after a dive.
7. **Verification at the shop.** The traveler shows the card; the shop marks the profile **verified** in
   their POS (this is where Utilitarian's POS pays off). The traveler sees "Verified by <shop>" and the next
   shop can trust it for that trip. Verification expires with the trip, not forever.

## Rules we hold ourselves to
- **Self-declared until a shop verifies.** Never block someone's plan, flag it.
- **The planner is not medical advice.** It reminds you to complete the official form and to follow your
  agency and shop. Wording stays plain and short.
- **Children:** age gates are shown as facts ("min age 10"), never judged.
- **Data minimal:** cert card images and medical answers don't leave the device; only the result
  (done / needs sign-off / signed) is shared with a shop when the traveler chooses.

## Open questions
1. Which agencies at launch? (Suggest PADI, SSI, SDI, NAUI, CMAS, BSAC as pick lists; "other" is free text.)
2. Should "Learn to dive" be sold through Tripwrights (taking bookings for shops) or only planned?
3. Does Utila's shop community want a shared eLearning / referral process, or is each shop its own?

## Sources
- [PADI — Become a certified scuba diver FAQ](https://www.padi.com/help/scuba-certification-faq)
- [PADI Pros — referral with an eLearner](https://pros-blog.padi.com/how-to-do-a-referral-with-an-elearner/)
- [PADI Pros — new medical screening system (2020)](https://pros-blog.padi.com/2020/07/14/new-medical-screening-system-for-divers/)
- [Suunto — surface and no-fly time (DAN guidance)](https://www.suunto.com/en-ca/Support/Product-support/suunto_dx/suunto_dx/features/surface-and-no-fly-time/)
- [No Fly Guidelines (ScubaBoard discussion, community opinion)](https://www.scubaboard.com/community/threads/no-fly-guidelines.139352/)
