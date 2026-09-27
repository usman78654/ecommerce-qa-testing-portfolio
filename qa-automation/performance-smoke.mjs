import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:5000';
const outputDir = path.resolve('evidence', 'performance', '2026-09-27');
await mkdir(outputDir, { recursive: true });

const catalog = await fetch(`${baseURL}/api/products?pageNumber=1`).then(r => r.json());
const productId = catalog.products[0]._id;
const scenarios = [
  { name: 'catalog', path: '/api/products?pageNumber=1', requests: 100, concurrency: 10 },
  { name: 'search', path: '/api/products?keyword=Airpods', requests: 100, concurrency: 10 },
  { name: 'product-detail', path: `/api/products/${productId}`, requests: 100, concurrency: 10 }
];

function percentile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

async function executeScenario(scenario) {
  const durations = [];
  const statuses = {};
  let errors = 0;
  let cursor = 0;
  const started = performance.now();

  async function worker() {
    while (cursor < scenario.requests) {
      cursor += 1;
      const requestStart = performance.now();
      try {
        const response = await fetch(baseURL + scenario.path, { headers: { Accept: 'application/json' } });
        await response.arrayBuffer();
        durations.push(performance.now() - requestStart);
        statuses[response.status] = (statuses[response.status] || 0) + 1;
        if (!response.ok) errors += 1;
      } catch {
        durations.push(performance.now() - requestStart);
        errors += 1;
      }
    }
  }

  await Promise.all(Array.from({ length: scenario.concurrency }, worker));
  const elapsedMs = performance.now() - started;
  return {
    ...scenario,
    elapsedMs: Number(elapsedMs.toFixed(2)),
    throughputPerSecond: Number((scenario.requests / (elapsedMs / 1000)).toFixed(2)),
    errorRate: errors / scenario.requests,
    errors,
    statuses,
    responseTimeMs: {
      min: Number(Math.min(...durations).toFixed(2)),
      average: Number((durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)),
      p50: Number(percentile(durations, 0.50).toFixed(2)),
      p90: Number(percentile(durations, 0.90).toFixed(2)),
      p95: Number(percentile(durations, 0.95).toFixed(2)),
      max: Number(Math.max(...durations).toFixed(2))
    }
  };
}

const warmup = await fetch(`${baseURL}/api/products?pageNumber=1`);
if (!warmup.ok) throw new Error(`Warmup failed with HTTP ${warmup.status}`);

const results = [];
for (const scenario of scenarios) results.push(await executeScenario(scenario));

const thresholds = { p95Ms: 500, errorRate: 0.01 };
const checks = results.map(result => ({
  scenario: result.name,
  p95Passed: result.responseTimeMs.p95 < thresholds.p95Ms,
  errorRatePassed: result.errorRate < thresholds.errorRate
}));
const passed = checks.every(check => check.p95Passed && check.errorRatePassed);
const report = {
  generatedAt: new Date().toISOString(),
  profile: 'Local smoke load; not a production capacity benchmark',
  baseURL,
  thresholds,
  passed,
  totalRequests: scenarios.reduce((sum, s) => sum + s.requests, 0),
  results,
  checks
};

await writeFile(path.join(outputDir, 'performance-results.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify(report, null, 2));
process.exitCode = passed ? 0 : 1;
