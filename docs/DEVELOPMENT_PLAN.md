# Development and QA Roadmap

## Objective

Create a recruiter-ready QA portfolio that shows the complete testing lifecycle
against ProShop v2 while keeping the upstream application separate from the QA
assets and clearly distinguishing designed tests from executed results.

## Delivery phases

| Phase | Work | Exit criteria |
| --- | --- | --- |
| 1. Baseline | Inspect architecture, configure isolated local database, install dependencies, seed fixtures, smoke-test services | UI and API respond; repeatable setup documented |
| 2. Test design | Define requirements, risks, test data, manual cases, traceability, exploratory charters, and regression set | Each in-scope requirement maps to one or more tests |
| 3. API testing | Build Postman collection with positive, negative, schema, authentication, authorization, and workflow assertions | Collection runs from the command line with an exported report |
| 4. Manual execution | Execute supported browsers and viewport checks; capture evidence; file confirmed defects | Each executed case has status, date, build, tester, and evidence |
| 5. Portfolio polish | Add metrics, defect summaries, screenshots, lessons learned, and concise recruiter walkthrough | README supports a five-minute review and all claims are evidenced |

## Core scope

- Authentication: register, login, logout, profile, session enforcement
- Catalog: listing, pagination, search, product detail, stock, reviews
- Cart: add/update/remove, totals, persistence, stock boundaries
- Checkout: authentication redirect, shipping, payment selection, order placement
- Orders: customer history/detail, pricing integrity, admin list and delivery
- Administration: user/product/order access control and management
- Quality attributes: responsive behavior, basic accessibility, error handling, and data integrity

## Deferred enhancements

These are evaluated only after core testing is complete: browser automation,
CI execution, accessibility scanning, performance testing, security-focused API
checks, a server-side cart API, and Jira synchronization.

## Quality rules

- Never mark a case Passed without executing it against a named build.
- Never report a defect without reproducible steps and evidence.
- Use only the dedicated `proshop_qa_portfolio` database for seed/reset actions.
- Keep passwords, tokens, and third-party credentials outside version control.
- Preserve upstream attribution and clearly label portfolio-authored work.
