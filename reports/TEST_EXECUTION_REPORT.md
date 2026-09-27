# Test Execution Report

## Cycle status

**Status:** API and selected browser cycles executed; remaining manual cases identified.  
**Application baseline:** `e23e3a897e5387f39da6c59fd72cdd12e46d0815`  
**Environment:** Local Windows / MongoDB 7.0.9  
**Execution date:** 2026-09-26  

## Results

| Type | Designed | Passed | Failed | Blocked | Not run |
| --- | ---: | ---: | ---: | ---: | ---: |
| Traceable cases | 45 | 29 | 3 | 0 | 13 |
| API collection | 25 requests | 23 | 2 | 0 | 0 |

The 25 requests executed 94 assertions: 90 passed and 4 failed. Both failed
requests reached the endpoint successfully and exposed confirmed product defects.

## Entry checks

- [x] Dependencies installed
- [x] Dedicated QA database configured
- [x] Fixtures seeded
- [x] API health smoke passed
- [x] Frontend production build compiled
- [x] Frontend browser smoke completed

## Defect summary

| ID | Summary | Severity / priority | State |
| --- | --- | --- | --- |
| BUG-001 | Admin user-list API exposes password hashes | High / P1 | Open |
| BUG-002 | Customer can view another customer's complete order | Critical / P0 | Open |
| BUG-003 | Order detail displays floating-point artifact | Medium / P2 | Open |
| BUG-004 | Storefront page-2 control does not navigate | Medium / P1 | Open |
| BUG-005 | Interactive catalog and quantity controls lack accessible names | Medium / P1 | Open |
| BUG-006 | Text and controls fail minimum color contrast | Medium / P2 | Open |

## Execution log

| Date/time | Build | Suite/cases | Environment | Result | Evidence/report | Defects |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-26 | `e23e3a8` | Postman API regression: 25 requests / 94 assertions | Local API + MongoDB | 23 request checks passed; 2 failed | `reports/newman-results.json` | BUG-001, BUG-002 |
| 2026-09-26 | `e23e3a8` | Frontend production build | Local Node.js | Passed | Build console output | None |
| 2026-09-26 | `e23e3a8` | Chrome browser validation: 12 workflow groups | Desktop 1440×900 + mobile 375×812 | 12/12 runner checks passed; visual review found one defect | `evidence/browser/2026-09-26/` | BUG-003 |
| 2026-09-26 | `e23e3a8` | Extended Chrome validation: 14 workflow groups | Desktop 1440×900 | 13 passed; pagination failed | `evidence/browser/2026-09-26/browser-extended-results.json` | BUG-004 |
| 2026-09-27 | `e23e3a8` | axe WCAG 2.0/2.1 A/AA scan: 5 pages | Chrome desktop | 8 page/rule occurrences; 74 affected nodes | `evidence/accessibility/2026-09-27/axe-results.json` | BUG-005, BUG-006 |
| 2026-09-27 | `e23e3a8` | Local API performance smoke: 300 requests | Concurrency 10 | Passed; 0 errors; worst P95 120.03 ms | `evidence/performance/2026-09-27/performance-results.json` | None |
| 2026-09-27 | `e23e3a8` | Automated portfolio walkthrough | Chrome 1280×720 | WebM generated | `evidence/demo/proshop-qa-walkthrough.webm` | None |

The raw Newman JSON can contain session cookies and response data. It is retained
locally for audit but excluded from version control; share only sanitized evidence.

## Exit assessment and residual risks

API request pass rate is 92%; assertion pass rate is 95.7%. The application is
not suitable for release while BUG-002 remains open because customer order data
is exposed across accounts. BUG-001 also exposes password hashes to admin users.

Thirteen cases, Firefox comparison, extended exploratory inputs, and
PayPal sandbox payment confirmation remain unexecuted. The current recommendation is
**No-Go** until the Critical authorization defect is fixed and regression-tested.
