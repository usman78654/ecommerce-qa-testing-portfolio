# Evidence Index

Evidence was captured from installed Google Chrome against the local production
build on 2026-09-26. The runner used a clean, seeded `proshop_qa_portfolio`
database. Raw API output is excluded from version control because it can contain
session cookies and response data.

| Evidence | Demonstrates |
| --- | --- |
| `TC-CAT-001-home-desktop.png` | Desktop catalog and first-page products |
| `TC-CAT-003-search-mixed-case.png` | Case-insensitive product search |
| `TC-CAT-005-no-results.png` | Empty search-result state |
| `TC-CAT-007-out-of-stock.png` | Disabled purchase control for zero stock |
| `TC-CART-006-decimal-and-persistence.png` | Quantity 3, `$269.97` subtotal, refreshed cart |
| `TC-CART-008-account-cart-isolation.png` | Empty cart after switching customer accounts |
| `TC-CHK-004-order-review.png` | Shipping, payment method, items, and totals before order |
| `TC-ORD-001-order-created.png` | Created order and BUG-003 currency artifact |
| `TC-UX-001-mobile-cart.png` | 375px catalog-to-cart journey |
| `TC-UX-002-mobile-checkout.png` | 375px checkout review |
| `browser-results.json` | Timestamped structured results for 12 browser workflow groups |
| `browser-extended-results.json` | Registration, profile, reviews, cart mutation, validation, history, and access checks |
| `TC-CAT-002-failure.png` | BUG-004: page 2 click leaves page-1 catalog unchanged |

The automation source is `qa-automation/browser-validation.mjs`. Screenshots
may include local fixture names, emails, addresses, and order IDs; no real user
data is used.
