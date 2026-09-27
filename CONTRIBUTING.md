# Contributing

This repository is a QA portfolio and reproducible test baseline. Changes should:

- Preserve upstream attribution and keep application changes separate from test assets.
- Link each new case to a requirement ID and assign a risk-based priority.
- Never mark a result Passed without build, environment, date, and evidence.
- Add confirmed bugs with reproducible steps, expected/actual results, impact, and evidence.
- Avoid committing `.env`, session cookies, raw secrets, or unsanitized production data.
- Reseed only the dedicated `proshop_qa_portfolio` database.

Before proposing a change, build the frontend and run the relevant API, browser,
accessibility, or performance checks. Update the execution report when results
materially change.
