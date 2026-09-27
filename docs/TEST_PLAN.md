# Test Plan

## Purpose

Validate the customer and administrator journeys of ProShop v2 and provide
auditable evidence of functional and API quality. The baseline under test is
upstream commit `e23e3a897e5387f39da6c59fd72cdd12e46d0815`.

## Approach

Testing uses risk-based prioritization. Checkout, authorization, server-side
price calculation, order ownership, and inventory boundaries receive the
highest attention because failures can expose data or affect money and orders.

Test design techniques include equivalence partitioning, boundary-value
analysis, decision tables, state transitions, error guessing, exploratory
testing, and end-to-end workflow coverage.

## In scope

- Customer and admin workflows listed in `REQUIREMENTS.md`
- REST endpoints under `/api/users`, `/api/products`, and `/api/orders`
- Chrome at desktop and mobile viewport; Firefox for the regression smoke set
- Authentication and role-based authorization
- Client and server validation, error messages, persistence, and price integrity

## Out of scope for the initial cycle

- Real financial transactions and production PayPal
- Email, refunds, shipment-provider integration, and tax jurisdiction accuracy
- Native mobile apps and browsers outside the stated matrix
- Load, penetration, and full WCAG conformance audits

## Environment

| Component | Target |
| --- | --- |
| Frontend | `http://localhost:3000` |
| API | `http://localhost:5000` |
| Database | Local MongoDB, database `proshop_qa_portfolio` |
| Seed users | Admin, John, and Jane fixtures from the upstream seeder |
| API runner | Postman-compatible collection; Newman CLI |

## Entry criteria

- Application builds and services start without blocking errors
- Dedicated test database is reachable and seeded
- Test accounts and product fixtures are available
- Baseline commit and environment are recorded

## Exit criteria

- 100% of P0 and P1 cases executed
- No unresolved Critical or High defect blocks checkout or access control
- At least 95% pass rate for the regression suite, with failures explained
- API run report and manual execution evidence are attached
- Residual risks and deferred items appear in the summary report

## Severity and priority

| Level | Severity guideline | Priority guideline |
| --- | --- | --- |
| Critical / P0 | Security breach, unrecoverable loss, or system unavailable | Fix immediately; release blocked |
| High / P1 | Core journey blocked or wrong financial/order result | Fix before release |
| Medium / P2 | Feature works with material limitation or workaround | Schedule in current/next iteration |
| Low / P3 | Cosmetic, copy, or minor usability issue | Fix when capacity permits |

Severity describes user/business impact; priority describes repair urgency.

## Evidence standard

Manual evidence should show case ID, URL, build, date/time, inputs, and visible
result. API evidence should retain the collection report and response details.
Sensitive tokens and passwords must be redacted.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Seed command replaces data | Use only the named local QA database |
| PayPal credentials unavailable | Test unpaid order creation; defer payment confirmation |
| Cart exists only in localStorage | Cover it through UI and storage/persistence checks |
| Shared fixture mutations affect repeatability | Reseed before a clean cycle and use unique registration emails |
| Browser differences | Run P0/P1 smoke in Chrome and Firefox |
