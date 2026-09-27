# EX-01 Cart and identity transitions — 2026-09-26

**Build:** `e23e3a8`  
**Environment:** Chrome desktop; local production build; seeded MongoDB  
**Duration:** 25 minutes  
**Status:** Completed for refresh, logout, and account switching  

## Mission

Explore whether cart state and shipping data leak or drift across refresh,
checkout authentication, logout, and login as another customer.

## Actions and observations

- Added three Airpods at `$89.99`; cart showed three items and `$269.97`.
- Refreshed the cart; quantity and subtotal persisted from localStorage.
- Began checkout as a guest, authenticated as John, and returned to Shipping.
- Completed shipping/payment and created an order.
- Logged out John, logged in as Jane, and opened the cart.
- Jane's cart was empty; John's cart/shipping state was not inherited.

## Result

No identity-to-cart leakage reproduced. TC-CART-006, TC-CART-007,
TC-CART-008, TC-CHK-001, and TC-AUTH-007 passed. Multi-tab and forced cookie
expiration remain outside this session.

## Evidence

- `evidence/browser/2026-09-26/TC-CART-006-decimal-and-persistence.png`
- `evidence/browser/2026-09-26/TC-CART-008-account-cart-isolation.png`
