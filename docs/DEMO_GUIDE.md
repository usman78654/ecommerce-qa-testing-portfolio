# Portfolio Demonstration Guide

## Five-minute recording plan

Use this sequence for a concise recruiter walkthrough. Keep the browser at
1440 × 900, zoom at 100%, and hide personal notifications.

| Time | Screen | Narration goal |
| --- | --- | --- |
| 0:00–0:30 | Root README and results snapshot | Explain the application, test scope, and evidence-first approach |
| 0:30–1:10 | Test plan and traceability matrix | Show risk-based priorities and requirement-to-test mapping |
| 1:10–1:50 | Manual test CSV and Postman collection | Point out positive, negative, boundary, authorization, and chained API coverage |
| 1:50–2:35 | HTML dashboard | Present execution totals, pass rate, coverage, defects, accessibility, and performance |
| 2:35–3:20 | Screenshots: cart, mobile checkout, created order | Demonstrate desktop/mobile execution and the floating-point defect evidence |
| 3:20–4:15 | BUG-002 and Newman result | Explain cross-customer order access, severity reasoning, reproduction, and No-Go decision |
| 4:15–4:45 | Accessibility and performance reports | Explain the limits of automated accessibility and local load testing |
| 4:45–5:00 | GitHub Actions workflow | Close with repeatable CI and artifact publishing |

## Suggested narration

“This portfolio tests a MERN e-commerce application across authentication,
catalog, cart, checkout, orders, and administration. I designed 45 traceable
cases using boundary, negative, state-transition, exploratory, and security
techniques. The evidence includes Postman assertions, real Chrome workflows,
mobile screenshots, accessibility checks, and a local performance smoke test.

The most important finding is a broken object-level authorization issue: a
second customer can retrieve another customer's complete order. I rated it
Critical/P0 and issued a No-Go recommendation. Every reported result links to
reproducible evidence, and cases that were not fully executed remain Not Run.”

## Recording checklist

- Reseed and execute the suites before recording.
- Open `reports/html/index.html` and verify current metrics.
- Redact cookies, tokens, password hashes, and raw API response bodies.
- Show fixture data only; no real account or address information.
- Record at 1080p and use a readable cursor size.
- Export an MP4 under five minutes and add its public link to the README.

## Automated walkthrough assets

The browser scripts reproduce the pages used in the video:

```powershell
npm run test:browser
npm run test:browser:extended
npm run test:accessibility
npm run test:performance
npm run report:html
```

An automated silent WebM walkthrough is available at
`evidence/demo/proshop-qa-walkthrough.webm`. A narrated MP4 still requires your
voice and preferred screen recorder/editor.
