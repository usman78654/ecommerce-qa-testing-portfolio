# Regression Suite

Run this suite after any defect fix or release candidate. P0 cases form the
smoke gate; P1 cases form the core regression set.

## P0 smoke gate

- TC-AUTH-005: valid login
- TC-CAT-007: out-of-stock purchase prevention
- TC-CART-001: add to cart
- TC-CART-005 and TC-CART-006: subtotal and decimal accuracy
- TC-CART-008: account-switch isolation
- TC-CHK-001: authenticated checkout redirect
- TC-ORD-001 to TC-ORD-003: order creation and price integrity
- TC-ORD-005: order ownership authorization
- TC-ADM-001 to TC-ADM-003: admin access control
- TC-API-002: unauthenticated API denial

## P1 core regression

Run all P0 cases plus every case marked P1 in `manual-test-cases.csv`. Execute
the full Postman collection with a freshly seeded test database.

## Full regression

Run all designed manual cases, the complete Postman collection, both target
browser checks, responsive viewports, and relevant exploratory charters.

Record build, environment, runner/browser version, start/end time, pass/fail/
blocked totals, defect links, and evidence in the execution report.
