# Performance Evidence

The local smoke profile issued 300 requests at concurrency 10 across catalog,
search, and product-detail endpoints.

Thresholds:

- P95 response time below 500 ms
- Error rate below 1%

All three scenarios passed with zero errors. The slowest P95 was approximately
120 ms for product detail. Results reflect a local machine and seeded test data;
they demonstrate repeatable performance checks, not production capacity.

See `2026-09-27/performance-results.json` for response-time distributions,
throughput, status counts, thresholds, and checks.
