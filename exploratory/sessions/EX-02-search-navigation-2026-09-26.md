# EX-02 Search and navigation resilience — 2026-09-26

**Build:** `e23e3a8`  
**Environment:** Chrome desktop and 375 × 812 mobile viewport  
**Duration:** 20 minutes  
**Status:** Partially completed  

## Mission

Explore catalog search, empty results, direct product navigation, stock state,
and responsive navigation.

## Actions and observations

- Mixed-case `aIrPoDs` returned the expected product.
- `zz-no-product` returned a stable empty page with no error.
- Direct product navigation loaded the correct details.
- Amazon Echo showed `Out Of Stock`; Add To Cart was disabled.
- Mobile navigation expanded and supported search-to-cart without horizontal overflow.

## Result

Covered case-insensitive, no-result, direct navigation, zero-stock, and mobile
paths without a defect. Whitespace-only, Unicode, encoded punctuation, and very
long terms remain for a future session.

## Evidence

- `evidence/browser/2026-09-26/TC-CAT-003-search-mixed-case.png`
- `evidence/browser/2026-09-26/TC-CAT-005-no-results.png`
- `evidence/browser/2026-09-26/TC-CAT-007-out-of-stock.png`
- `evidence/browser/2026-09-26/TC-UX-001-mobile-cart.png`
