# Postman API Suite

## Coverage

The collection contains 25 sequential requests covering API health, product
listing/search/detail, invalid identifiers, authentication lifecycle, customer
versus admin authorization, empty-order validation, server-authoritative pricing,
customer order retrieval, cross-customer order privacy, admin listing, and delivery state changes.

The cart has no API in the upstream application; it is covered through manual
UI/localStorage tests. Payment confirmation requires PayPal sandbox credentials
and is deferred from the local core run.

## Run

1. Start from the dedicated, freshly seeded QA database.
2. Start the API at `http://localhost:5000`.
3. Import the collection and environment into Postman, or run with Newman:

```powershell
newman run postman/ProShop-QA.postman_collection.json `
  -e postman/Local-QA.postman_environment.json `
  --reporters cli,json `
  --reporter-json-export reports/newman-results.json
```

Run in collection order because product and order IDs are captured dynamically.
The environment contains only public local fixture credentials; do not add real
secrets to the exported file.
