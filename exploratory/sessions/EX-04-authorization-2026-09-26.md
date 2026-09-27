# EX-04 Authorization and object ownership — 2026-09-26

**Build:** `e23e3a8`  
**Environment:** Chrome and Newman; local API; seeded MongoDB  
**Duration:** 30 minutes  
**Status:** Completed for selected high-risk paths  

## Mission

Compare guest, customer, second-customer, and administrator access to profiles,
users, orders, and direct admin routes.

## Actions and observations

- Guest profile request returned 401.
- Customer request to the admin users API returned 401 without a list.
- Customer direct navigation to `/admin/userlist` left the protected route and
  did not show a user table.
- Second customer requested the first customer's order ID and received the full
  order with HTTP 200.
- Administrator user-list response contained bcrypt password hashes.

## Result

Two security defects confirmed: BUG-001 and BUG-002. Release recommendation is
No-Go until the cross-customer disclosure is fixed and retested.

## Evidence

- `reports/newman-results.json` (local raw evidence; sanitize before sharing)
- `defects/BUG-001-password-hashes-exposed.md`
- `defects/BUG-002-cross-customer-order-disclosure.md`
