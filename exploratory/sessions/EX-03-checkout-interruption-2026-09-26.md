# EX-03 Checkout interruption — 2026-09-26

**Build:** `e23e3a8`  
**Environment:** Chrome desktop and 375 × 812 mobile viewport  
**Duration:** 20 minutes  
**Status:** Partially completed  

## Mission

Explore checkout state across authentication, refresh, step transitions, and
order creation while watching totals and responsive layout.

## Actions and observations

- Guest checkout redirected to Login and continued at Shipping after login.
- Valid shipping fields persisted to Payment and Place Order.
- PayPal remained selected and review totals matched cart calculations.
- Checkout review had no horizontal overflow at 375px.
- Order creation succeeded and displayed the resulting order.
- Visual review found an unrounded item-line total on order detail.

## Result

Core interruption and state transition paths passed. BUG-003 was opened for the
order-detail currency artifact. Multi-tab cart mutation and rapid double-submit
remain unexecuted.

## Evidence

- `evidence/browser/2026-09-26/TC-CHK-004-order-review.png`
- `evidence/browser/2026-09-26/TC-UX-002-mobile-checkout.png`
- `evidence/browser/2026-09-26/TC-ORD-001-order-created.png`
