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

**The unit is Type Ba, the left-right mirror image of the published Type B plan.** All numbers, notes and layout data below (and in `src/data`, `src/furniture/layout.ts`) are in the coordinates of the published plan, so "left/right" in these notes means left/right *on the plan*. The model is mirrored as a whole when rendered (`src/data/mirror.ts`, `MIRRORED = true`), so on screen everything appears swapped left-right, matching the real unit.

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
| Yard | Half wall (parapet, ~1.0 m assumed) to the AC ledge, open above. Front-load washer with a dryer stacked on top (stacking kit), in the corner away from the yard door's swing; laundry basket. |
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

# Phase 2 — Interior design (v5: warm minimal, between mid-century and wabi-sabi / zen)

Style: a restrained palette of warm walnut-teak wood, cream boucle, sand and taupe linen, soft stone tops, a jute rug, and black only as an accent (stoneware, the island dome pendants). Paper globe lanterns, olive trees, warm LED strips under the open dining shelves. Mid-century touches stay in the forms (tapered legs on the side table, shoe cabinet and bed; dome pendants), not in the colours.
Living: low cream boucle sofa on a recessed walnut plinth, chunky solid-wood coffee table. Entry: round mirror in a thin walnut frame. Master: taupe linen channel-tufted headboard.
Floors: the **Floor** button cycles the dry areas between the existing porcelain tiles, medium oak boards and grey microcement (bath and yard keep their tiles).
All positions live in `src/furniture/layout.ts`. Panel buttons: **Design** (empty shell vs furnished), **Evening**, **Floor**.

Rendering approach (after studying sael.net/interior, which is also three.js): ACES filmic tone mapping with a little extra saturation, ambient occlusion, SMAA, a low warm sun through the windows by day, and "fake" lamp light computed inside every material (src/scene/fakeLamps.ts) instead of real point lights, so all lamps can be lit in the evening cheaply, as pools of warm light. Walkthrough lens narrowed from 70° to 55°. Depth of field was tried and dropped (it blurred the whole frame in this effect chain).

Loose furniture and decor (v7) are all Poly Haven CC0 models — no hand-modelled sofa, tables, stools or ornaments any more: two mid-century armchairs (walnut frame, black leather) in place of the 2-seater, a low Chinese tea table as the coffee table, Chinese stools at the island, a small dark-wood stand by the window, a round East Asian landscape painting above the chairs and above the bed, a money tree in a terracotta pot, aloes, the tea set, stoneware vases (some refinished black), wooden bowls, and a dry branch as ikebana.
Still hand-built because Poly Haven has nothing equivalent: built-in joinery (kitchen, dining wall, wardrobe, window seat, headboard wall, vanity), the queen bed, the studio sofa bed / workbench / ergonomic chair / cart / robot arms, appliances, paper lanterns, curtains and blinds.
Textures: scanned walnut / teak veneers, plaster, linen, leather, oak floor, microcement and jute (public/assets/ph, ~12 MB).

Style references (from the owner): dark walnut built-ins, grey microcement floor, paper lanterns, black stoneware, dim warm evening light; cream boucle / sand linen in the softer references.

| Space | What's there |
|---|---|
| Entrance | Floating wood shoe cabinet with travertine top and under-glow, on the face of the block right of the main door; round bronze-rim mirror (real reflection). No screen. |
| Kitchen | Fridge (matt charcoal, bottom freezer) in a full-height wood housing at the entrance end of the run; the cabinet above it conceals the DB box. Lower run: wood fronts, travertine top, sink kept at the existing plumbing position, single-zone narrow (domino) induction hob. Upper run in the same wood up to the beam line, stopping at x = 4.2 m so the small window stays clear. Narrow hood, under-cabinet light strip. |
| Island | Peninsula off the right-hand wall as you walk out of the kitchen: 1.30 × 0.75 m, 0.92 m high, thick travertine top, fluted wood body, 2 Japandi counter stools (Sketchfab, oak stained charcoal, 0.65 m seat), wooden bowl + black-vase ikebana on top, large Akari-style oval paper lantern. ~1.17 m clear between island and the dining joinery. |
| Dining wall | Full-height joinery on the left wall (3.5 m): open asymmetric shelving over closed base, a lit tea/coffee niche with stone top, tall pantry. |
| Living | black velvet sofa (Khronos "Glam Velvet Sofa", Black variant) **against the right-hand wall**, facing the left wall, which is **kept blank for a projector screen or a future TV**. No sideboard. Full-width window seat with thick linen pad (a small aloe on it), sheer linen curtains. Low round dark-stone coffee table (Sketchfab, ~0.86 m across, 0.29 m high). Wool rug, money tree (pachira) in a clay pot, ceiling fan, split air-con at the existing point on the header above the hallway opening (see IMG_5220), downlights. |
| Master | Full-height wardrobe **along the left wall** (0.6 × 1.9 m, 3 doors) — its end panel is what you see walking in. Queen bed: low dark-grey upholstered bed with grey linen (Sketchfab model, fitted to ~1.75 × 2.02 m) with its **headboard against the right-hand (east) wall**, centred, in front of a wood-panelled headboard wall with a display ledge. Floating nightstands both sides with hanging paper lanterns. Air-con on the wall shared with the bath/hallway, near the east corner (as marked). Linen roman blind, wool rug. |
| Yard | Half wall (parapet, ~1.0 m assumed) to the AC ledge, open above. Front-load washer with a dryer stacked on top (stacking kit), in the corner away from the yard door's swing; laundry basket. |
| Bathroom | Toilet kept (real model in design mode) with a wooden brush holder. Floating wood vanity with travertine top and stoneware vessel basin, black pump bottle, folded towel. Black towel rail with towel by the door. Hinoki bath stool and bucket in the shower. One long horizontal mirror (1.48 × 0.70 m) floating off the wall with a warm back-glow. Existing shower glass door kept (pull handle). |
| Studio (Bedroom 2) | 1.8 m wood-top workbench on a black steel frame (far wall, right-hand side as you walk in), birch pegboard in a wood frame with shelves/bins/tools, 2 desktop 6-axis robot arms, laptop, black architect lamp, black mesh ergonomic chair with headrest, black 3-tier utility trolley (all real models). **Sofa bed** (daybed: single mattress, back cushions, bolsters, pull-out trundle) opposite the bench — still hand-built: no suitable free daybed model found. Roman blind, air-con above the window. |

Finishes: slim painted skirting, travertine window sills, light switches and sockets.

Rendering: procedural environment lighting, full-resolution ambient occlusion (N8AO), 4K sun shadows, bloom for lamps, neutral tone mapping, vignette, planar mirrors, sky + illustrative distant skyline outside the windows in Walkthrough (assumes a mid-level floor; not the real view).

Performance: static furniture and the shell are merged into one mesh per material after mounting (~900 → ~110 meshes; draw calls per frame cut by ~70%); the sun's shadow map only re-renders when something changes; lamps are off by day and small accent lamps are skipped (their glowing shades remain); AO at half resolution; bloom only in the evening; pixel ratio capped at 1.5.

Walkthrough look: drag left to turn right, drag up to look down ("grab the view", like 360° tours). On phones/tablets: on-screen joystick (bottom-left) to walk, one-finger drag to look; both can be used at once.

Assets (v6): all loose furniture and decor are downloaded models, not hand-built: Poly Haven (CC0) vases, wooden bowls, plants and dry branches; the sofa is "Glam Velvet Sofa" by Eric Chadwick / Wayfair; the coffee table ("17 Stories Coffee Table" by bluejam99) and counter stools ("Japandi Bar Stool" by sketchstudio) are from Sketchfab. All CC BY 4.0, credited on screen. Chinese-style items (tea set, stools, tea table, scroll painting) were removed. Full credit list: the Credits button bottom-right, and public/assets/ph/README.md. Patterned porcelain is re-glazed matt black.

Loading: each model is one meshopt-compressed GLB with WebP textures at up to 512 px, and unused variants are pruned. Surface textures are WebP. public/assets/ph was cut from ~12 MB to ~3.7 MB, and is ~7 MB with the Sketchfab furniture added. All models preload at startup. vercel.json caches /assets/ph for 30 days.

Open design questions:
- [ ] Sofa bed trundle pulled out needs ~0.9 m more floor; the desk chair must move.
- [ ] Studio air-con position is assumed (above the window); living and master follow the points you marked.
