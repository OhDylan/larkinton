# Larkinton 2R1B — Model Notes (Phase 1)

Run: `npm install && npm run dev` → http://localhost:5173

All numbers live in `src/data/dimensions.ts` (metres). Layout topology is in `src/data/floorplan.ts`.

## Reference mapping

| File | What it shows |
|---|---|
| `Screenshot … 12.19.23 AM.png` | Official floor plan (primary source) |
| `IMG_5220.PNG` | Living room, looking toward the 4-panel window; hallway opening on the right |
| `IMG_5222.PNG` | Master bedroom (Bedroom 1) window, 2 panels + transom |
| `IMG_5221.PNG` | Bedroom 2 window, 1 panel + transom |
| `IMG_5218.PNG` | Kitchen: wall-hung sink, tiled wall, narrow window into the yard |
| `IMG_5219.PNG` | Dining → kitchen, looking toward the main door |
| `IMG_5223.PNG` | Bathroom, seen from the hallway |

## Orientation

- Coordinates: the origin is the top-left outer corner of the plan, +x goes right on the plan, +z goes down the plan.
- The plan has **no north arrow**. "North" in the code just means the top of the plan.
- **Entrance**: the main door is in the bottom-left corner of the plan, in the bottom wall. You walk in heading up the plan, straight into the kitchen/dining zone. The door swings inward and folds back against the left wall. It sits about 0.5 m inside the outer wall line; the outer recess belongs to the common corridor and is drawn as a grey patch.
- Circulation: entrance → kitchen → dining → living (window at top). A hallway opening in the right-hand wall of the dining room, about 3.1–4.2 m from the top, leads to Bedroom 1 (door on the hallway's top side), the bath (door on its right side) and Bedroom 2 (door on its bottom side).

## Measurements taken from the floor plan

**Dimensioned on the plan:**
- Overall width: **6800 mm**
- Overall depth: **8900 mm**
- 6.8 × 8.9 = 60.5 m² ≈ **651 sqft**. That matches the stated size, so the 651 sqft includes the yard and the AC ledge.

**Measured off the plan's scale** (about 10.8 mm per image pixel, taken from the two dimension lines; roughly ±50 mm):

| Space | Clear size (approx.) |
|---|---|
| Living + dining (one long room) | 2.87 m wide × 7.06 m (top wall to the bedroom-2/kitchen wall line) |
| Kitchen zone | 4.49 m wide (left wall to yard wall) × 1.54 m, beyond the dining room |
| Master bedroom (Bedroom 1) | 3.49 × 2.80 m ≈ 9.8 m² |
| Bedroom 2 | 3.49 × 2.46 m, plus a 0.89 × 0.40 m door recess ≈ 8.9 m² |
| Bathroom | L-shaped: main area 1.62 × 1.34 m, plus shower zone 0.82 × 0.96 m |
| Hallway | about 1.03 × 1.10 m |
| Yard | 1.08 × 1.54 m |
| AC ledge | 0.87 × 1.69 m |

| Opening | Width |
|---|---|
| Living window (4 panels) | 2.67 m, nearly the full wall |
| Master window (2 panels) | 1.56 m, centred on the wall |
| Bedroom 2 window (1 panel, right wall) | 0.70 m |
| Bath window (right wall, inside the shower zone) | 0.54 m |
| Kitchen → yard window | ~0.40 m |
| Main door | ~1.0 m |
| Bedroom doors | ~0.85 m |
| Bath door | ~0.73 m |
| Yard door | ~0.76 m |

- Exterior walls: about 150 mm. Partitions: about 140–160 mm.

## Estimated from photos

- **Ceiling height 2.75 m.** The hallway opening in IMG_5220 is about 2.1 m tall, and the ceiling is roughly 1.3× that. This is the least certain value.
- **Living window:** sill 0.45 m, head 2.15 m. It has a transom row (top ~20%) and a fixed bottom row (~15%).
- **Bedroom windows:** sill ~0.8 m, head 2.1 m, with a transom.
- **Bath window:** a small high window, sill ~1.5 m.
- **Kitchen window:** sill ~1.0 m, head 2.1 m, with a transom.
- **Floor:** large ~600 × 600 mm light grey-white polished porcelain.
- **Bath and yard floor:** darker grey tiles, assumed 300 × 300 mm.
- **Kitchen wall tiles:** white, about 600 × 300 mm landscape, up to about 1.5 m high.
- **Kitchen fixtures:** there are **no cabinets**, only a wall-hung sink slab on brackets. It is at the yard-window end of the bottom kitchen wall, about 1.0 m long and 0.85 m high.
- **Bulkheads:**
  - A dropped ceiling over the hallway (IMG_5219/5220), modelled at 2.45 m.
  - A beam across the dining → kitchen transition (IMG_5219), assumed to line up with the Bedroom 2 bottom wall.
  - Both depths are guesses.
- **Doors:** the main door is mid-grey (IMG_5219). Interior doors are light grey. All start open, as drawn on the plan.
  - Click a door (any view) to swing it open/closed; the panel's **Close Doors / Open Doors** button toggles all of them.
  - Closed doors block movement in Walkthrough.
  - Each door opening has a light grey jamb + head lining, and each leaf has lever handles on both sides (main door also has a peephole). Frame and handle sizes are [ASSUMED].

## Assumptions (not determinable from the references)

- Door height 2.1 m.
- The block to the right of the main door is modelled as solid. The plan shows a hollow box, probably a column or riser.
- The box beside the shower is modelled as a solid pipe shaft.
- Bath fixtures:
  - The plan shows none.
  - The **toilet** is visible in IMG_5223, against the bath/Bedroom 2 wall. Its exact position is estimated.
  - The **basin is a placeholder**. No photo shows it.
- The AC ledge sits 0.1 m lower. Its right-hand edge is drawn as a louvre/railing screen. It is outside the unit, with no ceiling.
- The yard is treated as indoor (with a ceiling). Its outer wall has no window marked on the plan.
- Sun direction is arbitrary, from the top-right of the plan, so light comes through the actual windows.

## Conflicts between plan and photos

1. **Shower screen direction.** The plan shows the screen as a line parallel to the bath's back wall. In IMG_5223 the glass looks like it runs away from the viewer on the left side. I followed the plan, but that reading of the photo is uncertain.
2. **Kitchen window width.** The plan implies about 0.40 m, but in IMG_5218 it looks a bit wider (~0.5 m). I followed the plan.
3. No hard conflicts otherwise. The window panel counts (4 / 2 / 1), the hallway opening, the main door position and the tiled kitchen wall all match.

## Needs confirmation from you

- [ ] Ceiling height (tape measure floor → ceiling in the living room)
- [ ] Hallway bulkhead and dining/kitchen beam: do they exist, how deep are they, and where exactly is the beam?
- [ ] Window sill and head heights, especially the living window
- [ ] Where is the bathroom basin? Which way does the shower glass run?
- [ ] Sink length and position along the kitchen wall. Is the DB box (visible in IMG_5219) on the block beside the main door?
- [ ] Is the yard open to the outside (grille or louvres), or enclosed?
- [ ] Which way is real north? This only matters for sunlight.
- [ ] Door swing directions. They are taken from the plan arcs; please check against the real unit.

---

# Phase 2 — Interior design

Style: cozy · Nordic · natural oak · a touch of wabi-sabi · "designer studio". Floors keep the existing porcelain tiles; walls turn a warm limewash off-white.
All positions live in `src/furniture/layout.ts` (metres, same coordinates as above). The **Design** button in the panel switches between the empty shell and the furnished design.

| Space | What's there |
|---|---|
| Entrance | Floating oak shoe cabinet (0.88 × 0.35 × 0.9 m, 15 cm off the floor) on the face of the block right of the main door, round oak-rim mirror above. No screen/divider. |
| Kitchen | Lower run along the bottom wall (oak fronts, warm stone top, sink kept at the existing plumbing position, induction hob). Upper run in warm white, stopping at x = 4.2 m so the small kitchen window stays clear. Slim hood + under-cabinet light strip. |
| Island | Peninsula off the right-hand wall as you walk out of the kitchen: 1.30 × 0.75 m, 0.92 m high, stone top, fluted oak body. 2 counter stools on the living-room side. Leaves ~1.57 m clear walkway along the left. |
| Living | Window seat (飘窗) along the full 4-panel window, seat height = sill (0.45 m), with drawers. 1.5 m 2-seater facing the window seat, round oak coffee table, jute rug, low oak sideboard + art on the partition wall (no TV wall), paper floor lamp, paper lantern pendant, tall plant. Open oak shelving on the left wall of the dining zone. |
| Master | Full-height oak wardrobe (0.9 m wide) straight ahead as you walk in, left of the window. Queen bed right beside it (Malaysian queen mattress 152 × 190 cm; frame 162 × 205 cm) with a low headboard under the sill. Nightstand + lamp on the right. |
| Bathroom | Toilet kept. Basin kept as a floating oak vanity with a ceramic vessel basin. One long horizontal mirror (1.48 × 0.72 m) across the basin/toilet wall. Existing shower glass door kept (pull handle shown). |
| Studio (Bedroom 2) | 1.8 m oak-top workbench on the far wall, right-hand side as you walk in; pegboard behind it with shelves, bins and tools; 2 desktop robot arms; task lamp; chair. Rolling cart beside the bench. Small sofa bed (1.6 m) opposite the bench against the bath wall. Window stays clear in the middle. |

Open design questions:
- [ ] Fridge and washing machine are not placed yet (the yard is the usual spot for the washer).
- [ ] The master wardrobe is only 0.9 m wide because of the window position. Is that enough?
- [ ] Sofa bed opened out needs ~2 m depth; the desk chair must move when it's unfolded.
