# BUG-004 Storefront page-2 control does not navigate

**Jira issue type:** Bug  
**Module:** Catalog pagination  
**Environment/build:** Chrome desktop; baseline `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Severity / priority:** Medium / P1  
**Related requirement and test:** CAT-01; TC-CAT-002  

## Preconditions

The seeded catalog contains six products and pagination limit is four, producing
two catalog pages.

## Steps to reproduce

1. Open the storefront home page.
2. Confirm four products and pagination controls `1` and `2` are visible.
3. Click the `2` pagination control.

## Expected result

The URL changes to `/page/2`, page 2 becomes active, and the final two products
are displayed.

## Actual result

The control accepts the click, but the URL remains `/`, page 1 stays active, and
the same four products remain displayed.

## Reproducibility

3/3 clean browser attempts.

## Impact

Customers cannot reach products beyond the first catalog page through the
storefront pagination control. Search or direct URLs are possible workarounds.

## Evidence

- `evidence/browser/2026-09-26/TC-CAT-002-failure.png`
- `evidence/browser/2026-09-26/browser-extended-results.json`

## Suggested correction

Render a valid React Router link inside each Bootstrap pagination item, then add
a browser regression that verifies URL, active page, and product set change.
