# BUG-003 Order detail displays a floating-point artifact

**Jira issue type:** Bug  
**Module:** Order detail UI / monetary formatting  
**Environment/build:** Chrome desktop; baseline `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Severity / priority:** Medium / P2  
**Related requirement and test:** CART-03; TC-ORD-006  

## Preconditions

An authenticated customer has an order containing three Airpods priced at
`$89.99` each.

## Steps to reproduce

1. Add the Airpods product to the cart with quantity 3.
2. Complete shipping and payment-method steps.
3. Place the unpaid order.
4. Inspect the item calculation on the order detail page.

## Expected result

The line displays `3 x $89.99 = $269.97` using two decimal places.

## Actual result

The line displays `3 x $89.99 = $269.96999999999997`. The order summary displays
the correctly rounded `$269.97`.

## Reproducibility

1/1 visually inspected clean browser run using the seeded product and quantity.

## Impact

The customer sees inconsistent monetary values on a completed order, reducing
trust and potentially causing billing questions. Stored summary totals remain
correct in the tested scenario.

## Evidence

- `evidence/browser/2026-09-26/TC-ORD-001-order-created.png`
- `evidence/browser/2026-09-26/browser-results.json`

## Suggested correction

Format the item line calculation as currency using the same decimal helper or
integer-cent calculation used for the order summary.
