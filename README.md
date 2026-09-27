# E-commerce QA Testing Portfolio

Manual and API testing portfolio for a full-stack e-commerce application. The
project demonstrates test planning, risk-based test design, requirements
traceability, exploratory testing, regression coverage, API automation, defect
reporting, and evidence-based test reporting.

## Results snapshot

- 45 traceable test cases: 29 passed, 3 failed, 13 not run
- 25 API requests and 94 assertions: 90 passed, 4 failed
- 26 browser workflow groups across desktop and 375px mobile validation
- 10 screenshot artifacts and two structured browser reports
- Six confirmed defects: one Critical, one High, and four Medium
- 5-page axe accessibility scan with 74 affected-node occurrences
- 300-request local performance smoke with zero errors and 120.03 ms worst P95
- Automated silent WebM walkthrough plus a five-minute narration script
- Current release recommendation: **No-Go** because of cross-customer order disclosure

## Portfolio navigation

| Deliverable | Location |
| --- | --- |
| Development roadmap | [`docs/DEVELOPMENT_PLAN.md`](docs/DEVELOPMENT_PLAN.md) |
| Local setup guide | [`docs/SETUP.md`](docs/SETUP.md) |
| Test plan | [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) |
| Requirements and risks | [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) |
| Traceability matrix | [`docs/TRACEABILITY_MATRIX.md`](docs/TRACEABILITY_MATRIX.md) |
| Manual test cases | [`test-cases/manual-test-cases.csv`](test-cases/manual-test-cases.csv) |
| Regression suite | [`test-cases/REGRESSION_SUITE.md`](test-cases/REGRESSION_SUITE.md) |
| Exploratory charters | [`exploratory/CHARTERS.md`](exploratory/CHARTERS.md) |
| Postman collection | [`postman/ProShop-QA.postman_collection.json`](postman/ProShop-QA.postman_collection.json) |
| Local Postman environment | [`postman/Local-QA.postman_environment.json`](postman/Local-QA.postman_environment.json) |
| Defect template | [`defects/DEFECT_TEMPLATE.md`](defects/DEFECT_TEMPLATE.md) |
| Execution report | [`reports/TEST_EXECUTION_REPORT.md`](reports/TEST_EXECUTION_REPORT.md) |
| Screenshot evidence | [`evidence/README.md`](evidence/README.md) |
| Jira import CSV | [`defects/jira-import.csv`](defects/jira-import.csv) |
| HTML results dashboard | [`reports/html/index.html`](reports/html/index.html) |
| CI workflow | [`.github/workflows/qa.yml`](.github/workflows/qa.yml) |
| Demo recording guide | [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md) |
| Automated demo video | [`evidence/demo/proshop-qa-walkthrough.webm`](evidence/demo/proshop-qa-walkthrough.webm) |
| Attribution | [`ATTRIBUTION.md`](ATTRIBUTION.md) |
| Accessibility evidence | [`evidence/accessibility/README.md`](evidence/accessibility/README.md) |
| Performance evidence | [`evidence/performance/README.md`](evidence/performance/README.md) |
| GitHub publishing guide | [`docs/GITHUB_PUBLISHING.md`](docs/GITHUB_PUBLISHING.md) |

## Application under test

- Application: ProShop v2 by Brad Traversy / Traversy Media.
- Source: https://github.com/bradtraversy/proshop-v2
- Local checkout: `proshop/`
- Baseline commit: `e23e3a897e5387f39da6c59fd72cdd12e46d0815`
- License: MIT; retain the upstream copyright and license in `proshop/readme.md`.
- Stack: React, Redux Toolkit, Express, Node.js, MongoDB.

The application is third-party software. This portfolio will document our own QA work against it.

## Planned testing scope

| Area | Manual testing | Postman coverage available |
| --- | --- | --- |
| Authentication | Registration, login, logout, profile | `/api/users`, `/api/users/auth`, `/api/users/logout`, `/api/users/profile` |
| Products | Search, pagination, details, reviews | `/api/products`, `/api/products/:id`, `/api/products/:id/reviews` |
| Cart | Add, change quantity, remove, persistence, totals | No cart API in the baseline; cart uses Redux and browser localStorage |
| Checkout | Shipping, payment method, order placement | `POST /api/orders`; PayPal sandbox configuration needed for payment testing |
| Orders | Order history, order details, admin delivery updates | `/api/orders/mine`, `/api/orders/:id`, `/api/orders/:id/deliver` |

Runtime behavior has been exercised through API, Chrome desktop/mobile,
accessibility, and local performance suites.

## Local setup

Use the dedicated MongoDB database and local `.env` described in
[`docs/SETUP.md`](docs/SETUP.md). PayPal sandbox credentials are required only
for the deferred payment-confirmation workflow. The data importer replaces
existing data, so run it only against `proshop_qa_portfolio`.

## Portfolio deliverables

- Test plan and requirements-to-test traceability matrix
- Functional, negative, boundary-value, access-control, responsive, and regression tests
- Exploratory testing charters and session notes
- Postman collection with assertions and chained variables
- Reproducible defect reports suitable for Jira, with evidence
- Execution results and test summary report

## Current status

Repository cloned, isolated test database seeded, frontend production build
verified, and API, Chrome, accessibility, and performance cycles executed. Six defects were confirmed.
Execution status and evidence are maintained in `reports/TEST_EXECUTION_REPORT.md`;
13 cases remain `Not Run` because their complete expected behavior has not been verified.
