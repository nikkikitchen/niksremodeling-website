# Calculator audit — October 15, 2026

Removed duplicate framing location question; supply planning now uses the original location answer. Restored the location field for a new room and retained it for edits/additional work. Reject whitespace-only room names at the first step.

Your estimate now shows known prices even when other costs are pending, identifies pending cost categories, and avoids displaying an invented zero-dollar complete estimate when nothing is priced. Long price labels can wrap on narrow screens. Approved rates remain unchanged.

Validation: 24 HTML page script loads; 98 non-custom material paths calculated and saved to cart; location carry-through/reset; duplicate location question absent; complete, partial and entirely unpriced estimates; $150 service minimum; cart price persistence. Run npm ci then npm run test:calculator. Build passed.

Limits: jsdom interaction checks, not visual browser certification. Chromium is unavailable. Unknown rates still require confirmation; this audit does not certify supplier inventory, payments or all possible combinations of selections.
