# BUG-005 Interactive catalog and quantity controls lack accessible names

**Jira issue type:** Bug  
**Module:** Catalog and product accessibility  
**Environment/build:** Chrome + axe-core; baseline `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Severity / priority:** Medium / P1  
**Standard:** WCAG 1.1.1 Non-text Content; WCAG 4.1.2 Name, Role, Value  

## Preconditions

The seeded catalog is available and the automated axe scan runs at desktop size.

## Steps to reproduce

1. Open the home page and run axe WCAG 2.0/2.1 A/AA rules.
2. Inspect `image-alt` and `link-name` results.
3. Open an in-stock product detail page and inspect `select-name` results.

## Expected result

Product image links expose the product name to assistive technology, and the
quantity selector has an accessible name associated with its visible label.

## Actual result

- Four catalog product images have no `alt` attribute.
- Their wrapping links therefore have no discernible accessible name.
- The product quantity `<select>` has no associated accessible name.

axe classifies the affected rules as Critical impact. Portfolio severity is
Medium because keyboard purchase remains possible, but screen-reader navigation
is materially impaired.

## Reproducibility

5 affected nodes for accessible-name rules across the scanned home and product pages.

## Evidence

- `evidence/accessibility/2026-09-27/axe-results.json`
- `evidence/accessibility/2026-09-27/home.png`
- `evidence/accessibility/2026-09-27/product-detail.png`

## Suggested correction

Pass the product name as `alt` for every card image so its link gains a name.
Associate the visible Qty label with the select using a unique `id` and
`htmlFor`, or add an accurate `aria-label`.
