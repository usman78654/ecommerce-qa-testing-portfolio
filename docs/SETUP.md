# Local QA Environment Setup

## Prerequisites

- Node.js 18 or later and npm
- MongoDB available at `127.0.0.1:27017`
- PowerShell or another terminal
- Optional: Postman desktop; Newman can be run through `npx`

## Configure

From `proshop/`, copy `.env.qa.example` to `.env`. Keep the database name
`proshop_qa_portfolio`; the seed command deletes data in its configured database.
Replace the local JWT secret before sharing or deploying the application.

## Install and seed

```powershell
cd proshop
npm install
cd frontend
npm ci
cd ..
npm run data:import
```

The upstream root lockfile was stale at the selected baseline, so the first root
install updates it. The frontend lockfile supports `npm ci`.

## Run

In one terminal:

```powershell
cd proshop
npm start
```

In a second terminal:

```powershell
cd proshop/frontend
npm start
```

Expected endpoints are the storefront at `http://localhost:3000` and API at
`http://localhost:5000`. The root API route returns `API is running....` in
development mode.

## Execute API regression

From the portfolio root:

```powershell
npx --yes newman run postman/ProShop-QA.postman_collection.json `
  -e postman/Local-QA.postman_environment.json `
  --reporters cli,json `
  --reporter-json-export reports/newman-results.json
```

Reseed before a repeatable clean run. A nonzero Newman exit is expected while
confirmed defects BUG-001 and BUG-002 remain unresolved.

## Test accounts

The upstream seed provides `admin@email.com`, `john@email.com`, and
`jane@email.com`, all with password `123456`. These are local fixtures only.

## Current dependency risk

On 2026-09-26, npm reported 24 vulnerabilities for the root tree including
development tools and 74 for the frontend tree, including critical findings. These inherited packages
require a separately reviewed upgrade; `npm audit fix --force` was not applied
because it can introduce breaking changes and would alter the application under
test.
