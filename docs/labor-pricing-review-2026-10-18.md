# Labor pricing review — October 18, 2026

## October 18 recovery of October 17 owner-approved walkthrough (current)

The earlier snapshot below was NOT a complete record of the October 17 conversation. The user and assistant reviewed around one hundred tasks covering priced labor and jobs deliberately marked **priced upon viewing**. Do not ask to reapprove approved rates. In particular, a previous assistant's snapshot omitted the kitchen labor category and additional cabinet prices and incorrectly showed $525 for exterior prehung door installation. These were corrected on the production main branch, and the live site was checked October 18.

**Cabinet tasks recovered and published:**
- Cabinet-box installation $150/box; removal and haul-off $125/box (subject to $150 visit minimum).
- Paint cabinet door and frame $125/door.
- Paint drawer fronts $125/drawer front.
- Paint cabinet interiors **$126/cabinet box** (unusual amount expressly confirmed; DO NOT change to $125).
- Install hardware $15/piece.
- Prep/repair old hardware holes $75/hour.
- Install cabinet crown molding $2.75/linear foot (not the separate general room crown molding at $3.75/linear foot).
- Install cabinet toe-kick $1.25/linear foot.
- Install filler strip $10/strip; install cabinet end panel $75/panel.
- Cabinet lighting priced upon viewing; unspecific finishing, adjustment/repair can remain quote-required.

**Kitchen tasks recovered and published:**
- Sink installation $225/each; faucet replacement $175/each; garbage disposal installation $275/each.
- Sink removal and haul-off $75/each, subject to $150 service minimum.
- Disposal removal without replacement $175/each.
- Countertop removal and haul-off $75/hour; backsplash removal $75/hour, both subject to $150 minimum.
- Install backsplash, laminate/butcher-block/granite/quartz countertops: priced upon viewing.
- Dishwasher installation $225 and removal/haul-off $150 already in Appliances; no change needed.

**Additional corrections/limits:**
- Exterior prehung door installation **$475/each**, corrected from mistaken $525. Other door, drywall, electrical, appliance and trim rates from the October 17 review remain in the labor catalog unless separately superseded.
- Original bathroom owner-approved *labor* rates and the fixture-plus-supplies installed estimates are different numbers; the live labor page now labels both. Bathroom removal/haul-off $150 and tub-related drywall repair $225 include ordinary job supplies and should not acquire extra hidden supply charges.
- Bathroom vanity lighting installed on existing suitable wiring is a separate service from vanity cabinetry; $150 labor and $300 installed estimate with standard fixture and supplies.
- Haul-away project debris **per load** was never assigned a final fixed price; keep as in-person quote.
- Product sales checkout is *not* implemented; the cart requests a quote rather than taking payment.
- October 18 live-site browser validation confirmed all eight recovered cabinet options; 2 painted drawer fronts ($125 each) plus 1 cabinet interior ($126) produced $376. This is a sample calculator test, not evidence of completed checkout.

**Where rates live:** `installation.html` is the labor catalog, `app.js` contains cabinet estimator rates and bathroom package components, and `scripts/service-pricing-check.cjs` includes regression assertions. Future edits must keep matching prices in labor and project calculator.

---

Source: production repository at 236a10af1fc839739a0f6c8d5ed3f5048c2ac3fc. This is a snapshot of current code, not a new approval of its prices.

74 directly priced tasks; 17 calculator-linked tasks; 165 tasks requiring an in-person quote.

## Verified work

- Existing tests passed: 102 calculator paths, 24 page scripts, 43 project pages, room expansion and service pricing checks. These are local DOM tests, not proof of live checkout.
- Kids’ Room and independent vanity-light choices are implemented and covered by regression tests.
- Cabinet installation is $150/box; removal and haul-off is $125/box; door/frame painting is $125/door.
- Added regression coverage for distinct cabinet task names in cart, duplicate-save prevention, $150 minimum for one $75 hour, and $75 additional hourly labor when other work exceeds the minimum.
- October 17 short numeric replies in conversation history lack their corresponding questions. Do not assign those numbers to tasks without recovering that mapping.

## Selling status

The cart requests quotes; it does not charge customers. Only supplier-search and configuration-status server routes exist. Square payment-link creation, verified payment confirmation, address-specific shipping pricing and supplier fulfillment are not implemented. See INTEGRATIONS.md. Secrets being present does not prove credentials or checkout work.

## Remaining pricing review, alphabetized

Tasks below currently require a visit. Decide whether each should stay quote-only or receive an approved standard rate.

### Appliances

- Built-in beverage tap / kegerator installation (each).
- Built-in coffee system installation (each).
- Double wall oven installation (each).
- Electric fireplace insert installation (each).
- Electric range installation (each).
- Gas fireplace insert installation (each).
- Microwave/oven combination installation (each).

### Bathroom

- Adjust door alignment (each).
- Clean grout (sq. ft.).
- Diagnose failed / noisy fan (each).
- Hang and finish drywall (sq. ft.).
- Install floor / wall tile (sq. ft.).
- Install framed shower door (each).
- Install frameless shower door (each).
- Install mirrors & accessories (each).
- Install sinks (each).
- Match existing texture (each).
- New exhaust fan with new ducting (each).
- Paint ceiling (sq. ft.).
- Paint walls (sq. ft.).
- Patch holes / cracks (each).
- Recaulk shower (each).
- Remove and replace caulk (each).
- Remove and replace grout (each).
- Remove ceiling texture (each).
- Remove existing and install new mirrors & accessories (each).
- Remove existing and install new showers (each).
- Remove existing and install new sinks (each).
- Remove mirrors & accessories only (each).
- Remove shower doors only (each).
- Remove showers only (each).
- Remove sinks only (each).
- Remove tile (sq. ft.).
- Remove vent fans only (each).
- Remove wallpaper (each).
- Repair drain leak (each).
- Repair drain leak (each).
- Repair duct connection (each).
- Repair grab bar mounting (each).
- Repair grout (each).
- Repair shelf mounting (each).
- Repair shower pan / waterproofing (each).
- Repair toilet flange (each).
- Repair towel bar mounting (each).
- Repair valve / cartridge (each).
- Replace damaged drywall (each).
- Replace damaged tile (each).
- Replace drain / pop-up stopper (each).
- Replace grille (each).
- Replace hinges (each).
- Replace motor (each).
- Replace P-trap (each).
- Replace rollers (each).
- Replace seals / sweep (each).
- Replace shower arm (each).
- Replace shower door (each).
- Replace showerhead / hose (each).
- Reseal frame (each).
- Reseal sink (each).
- Seal grout (each).
- Secure loose sink (each).
- Secure mirror (each).
- Texture ceiling (sq. ft.).
- Texture walls (sq. ft.).
- Treat stains and repaint (each).

### Cabinets & vanities

- Adjust hinges (each).
- Fill / repair hardware or hinge screw holes (each).
- Finish cabinet interiors (each).
- Install hardware (each).
- Paint drawer fronts (each).
- Prep / strip existing finish (each).
- Remove existing and install new cabinets (each).
- Remove existing and install new hardware (each).
- Remove hardware only (each).
- Repair cabinet frame (each).
- Repair door / drawer (each).
- Repair hardware (each).
- Repair screw holes (each).
- Stain doors, drawers and frames (each).

### Carpentry & trim

- Accessible ramp installation (each).
- Custom closet organizer installation (each).
- Custom shelving installation (each).
- Door trim / casing installation (each).
- Framing repair (each).
- Garage door insulation kit installation (each).
- Garage storage rack installation (each).
- Install custom carpentry (each).
- Install stairs & railings (each).
- Remove custom carpentry only (each).
- Remove existing and install new custom carpentry (each).
- Remove existing and install new stairs & railings (each).
- Remove stairs & railings only (each).
- Repair built-ins / shelving (each).
- Repair treads / risers (each).
- Secure handrail (each).

### Doors & windows

- Bifold door installation (each).
- Door trim repair (each).
- French door installation (each).
- Pocket door installation (each).
- Threshold adjustment (each).
- Window trim repair (each).

### Drywall & texture

- Drywall ceiling patch (each).
- Drywall texture matching (each).
- Popcorn ceiling removal (each).
- Water-damaged drywall repair (each).

### Electrical & smart home

- Built-in electric heater panel installation (each).
- Ceiling fan installation with new wiring (each).
- Ethernet / data port installation (each).
- Heated towel rack installation (each).
- In-ceiling speaker installation (each).
- New outlet with new wiring (each).
- Smart doorbell installation (each).
- Smart light switch installation (each).
- Smart thermostat installation (each).
- TV wall mounting with hidden cables (each).
- Under-cabinet lighting installation (each).
- Wall-mounted infrared panel installation (each).
- Wall-mounted speaker installation (each).

### Exterior & outdoor

- Install concrete (each).
- Install decks & steps (each).
- Install insulation (each).
- Install siding (each).
- Remove concrete only (each).
- Remove decks & steps only (each).
- Remove existing and install new concrete (each).
- Remove existing and install new decks & steps (each).
- Remove existing and install new insulation (each).
- Remove existing and install new siding (each).
- Remove insulation only (each).
- Remove siding only (each).
- Repair cracks (each).
- Repair damaged siding (each).
- Repair railing (each).
- Repair steps (each).
- Replace damaged deck boards (each).
- Replace damaged insulation (each).

### Flooring & tile

- Clean grout (each).
- Install flooring repairs (each).
- Install grout & caulk (each).
- Level subfloor (each).
- Remove existing and install new flooring repairs (each).
- Remove existing and install new grout & caulk (each).
- Remove flooring repairs only (each).
- Remove grout & caulk only (each).
- Repair / replace grout (each).
- Repair subfloor (each).
- Repair transition strip (each).
- Replace caulk (each).
- Replace damaged plank / tile (each).
- Seal grout (each).

### Other labor & delivery

- Haul away project debris (each).
- Install furniture assembly (each).
- Remove existing and install new furniture assembly (each).
- Remove furniture assembly only (each).
- Repair / tighten furniture (each).
- Store pickup & delivery (each).

### Painting & wallpaper

- Install wallpaper (each).
- Paint ceilings (each).
- Paint trim / doors (each).
- Paint walls (each).
- Patch / sand surfaces (each).
- Prime / stain-block surfaces (each).
- Remove existing and install new wallpaper (each).
- Remove wallpaper only (each).
- Repair seam / loose wallpaper (each).

## Current priced tasks

| Category | Task | Current rate |
|---|---|---|
| Appliances | Beverage tap / kegerator removal and haul-off | $150 / each |
| Appliances | Built-in ice maker installation | $175 / each |
| Appliances | Built-in wine cooler / beverage fridge installation | $195 / each |
| Appliances | Coffee system removal and haul-off | $150 / each |
| Appliances | Cooktop removal and haul-off | $150 / each |
| Appliances | Dishwasher installation | $225 / each |
| Appliances | Dishwasher removal and haul-off | $150 / each |
| Appliances | Dryer removal and haul-off | $150 / each |
| Appliances | Dryer vent cleaning | $150 / each |
| Appliances | Electric cooktop installation | $325 / each |
| Appliances | Electric dryer installation with existing hookups | $175 / each |
| Appliances | Electric range removal and haul-off | $150 / each |
| Appliances | Garbage disposal removal and haul-off | $150 / each |
| Appliances | Gas cooktop installation | $525 / each |
| Appliances | Gas dryer installation with existing hookups | $275 / each |
| Appliances | Gas range installation | $350 / each |
| Appliances | Gas range removal and haul-off | $150 / each |
| Appliances | Ice maker removal and haul-off | $150 / each |
| Appliances | New dryer vent installation | $175 / each |
| Appliances | New refrigerator water-line installation | $225 / each |
| Appliances | Over-the-range microwave installation | $275 / each |
| Appliances | Over-the-range microwave removal and haul-off | $150 / each |
| Appliances | Range hood installation | $125 / each |
| Appliances | Range hood removal and haul-off | $150 / each |
| Appliances | Refrigerator installation with existing water hookup | $125 / each |
| Appliances | Refrigerator removal and haul-off | $150 / each |
| Appliances | Single wall oven installation | $275 / each |
| Appliances | Stacked washer/dryer installation with existing hookups | $450 / set |
| Appliances | Stacked washer/dryer removal and haul-off | $150 / appliance |
| Appliances | Trash compactor installation with ready opening and outlet | $335 / each |
| Appliances | Trash compactor removal and haul-off | $150 / each |
| Appliances | Wall oven removal and haul-off | $150 / each |
| Appliances | Warming drawer installation with ready opening and power | $275 / each |
| Appliances | Warming drawer removal and haul-off | $150 / each |
| Appliances | Washing machine installation with existing hookups | $175 / each |
| Appliances | Washing machine removal and haul-off | $150 / each |
| Appliances | Wine cooler / beverage fridge removal and haul-off | $150 / each |
| Bathroom | Bathroom exhaust fan replacement | $125 / each |
| Cabinets & vanities | Install cabinet box | $150 / box |
| Cabinets & vanities | Paint cabinet door and its frame | $125 / door |
| Cabinets & vanities | Remove cabinet box and haul off | $125 / box |
| Carpentry & trim | Accessible grab bar installation | $350 / each |
| Carpentry & trim | Attic access ladder installation | $375 / each |
| Carpentry & trim | Baseboard finishing and painting | $1.25 / linear foot |
| Carpentry & trim | Baseboard installation | $2.25 / linear foot |
| Carpentry & trim | Chair rail installation | $3 / linear foot |
| Carpentry & trim | Crown molding finishing and painting | $1.25 / linear foot |
| Carpentry & trim | Crown molding installation | $3.75 / linear foot |
| Carpentry & trim | Shoe molding finishing and painting | $1.25 / linear foot |
| Carpentry & trim | Shoe molding installation | $2.25 / linear foot |
| Carpentry & trim | Window casing installation | $3 / linear foot |
| Doors & windows | Exterior door removal and haul-off | $150 / each |
| Doors & windows | Exterior prehung door installation | $525 / each |
| Doors & windows | Extra hinge mortising / trimming — add-on | $50 / each |
| Doors & windows | Interior door removal and haul-off | $150 / each |
| Doors & windows | Interior prehung door installation (including closet doors) | $150 / each |
| Doors & windows | Interior slab door installation | $175 / each |
| Doors & windows | Sliding barn door installation — starting at | $350 / each |
| Doors & windows | Storm door installation | $275 / each |
| Doors & windows | Storm door removal and haul-off | $150 / each |
| Doors & windows | Window removal and haul-off | $150 / each |
| Doors & windows | Window replacement — starting at | $300 / each |
| Drywall & texture | Drywall tape and mud seams | $5 / linear foot |
| Drywall & texture | Large drywall patch | $825 / each |
| Drywall & texture | Medium drywall patch | $575 / each |
| Drywall & texture | Small drywall patch | $325 / each |
| Electrical & smart home | Ceiling fan replacement using existing wiring | $225 / each |
| Electrical & smart home | Dimmer switch installation | $175 / each |
| Electrical & smart home | GFCI outlet installation | $150 / each |
| Electrical & smart home | Outlet replacement | $150 / each |
| Other labor & delivery | Delivery and placement — starting at | $150 / delivery |
| Other labor & delivery | Demolition labor | $75 / hours |
| Other labor & delivery | Furniture / appliance delivery and placement — starting at | $150 / each |
| Other labor & delivery | Miscellaneous labor | $75 / hours |

## Calculator-linked tasks

- Bathroom — Assemble and install smart toilet: $2550.
- Bathroom — Assemble and install standard toilet: $550.
- Bathroom — Diagnose and replace toilet tank parts: $150 service charge.
- Bathroom — Install shower faucet / mixing valve: $625.
- Bathroom — Install vanity, sink and faucet: $1475.
- Bathroom — Remove and replace bathtub and surround: $3500.
- Bathroom — Remove and replace sink faucet: $400.
- Bathroom — Remove toilet and haul off: $175.
- Bathroom — Remove vanity and sink and haul off: $190.
- Bathroom — Replace wax ring and reset toilet: $150 service charge.
- Bathroom — Resurface bathtub: $675.
- Bathroom — Tub-related drywall repair and touch-up: $350.
- Flooring & tile — Install Glue-down: Up to 40 sq. ft.: $400; 41–144 sq. ft.: $650; 145–250 sq. ft.: $900.
- Flooring & tile — Install Hardwood: Up to 40 sq. ft.: $500; 41–144 sq. ft.: $900; 145–250 sq. ft.: $1,300.
- Flooring & tile — Install Laminate: Up to 40 sq. ft.: $300; 41–144 sq. ft.: $500; 145–250 sq. ft.: $700.
- Flooring & tile — Install LVP: Up to 40 sq. ft.: $350; 41–144 sq. ft.: $575; 145–250 sq. ft.: $800.
- Flooring & tile — Install Tile: Up to 40 sq. ft.: $650; 41–144 sq. ft.: $1,000; 145–250 sq. ft.: $1,500.
