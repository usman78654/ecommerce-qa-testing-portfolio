# Accessibility Evidence

The automated axe run scanned Home, Login, Register, Cart, and Product Detail
against WCAG 2.0/2.1 A and AA rules.

- 5 pages scanned
- 8 page/rule violation occurrences
- 74 affected nodes reported in total across repeated page components
- Critical axe impact: missing alternative/accessibility names
- Serious axe impact: color contrast

See `2026-09-27/axe-results.json` for rule help, selectors, HTML snippets, and
failure summaries. Screenshots show the visual state scanned.

Automated rules cover only part of WCAG. Keyboard flow, focus visibility,
screen-reader announcements, zoom/reflow, motion, and cognitive usability still
require manual evaluation.
