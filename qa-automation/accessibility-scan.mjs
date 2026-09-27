import { chromium } from 'playwright-core';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:5000';
const configuredChrome = process.env.QA_CHROME_PATH;
const defaultChrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (configuredChrome !== 'bundled') launchOptions.executablePath = configuredChrome || defaultChrome;

const outputDir = path.resolve('evidence', 'accessibility', '2026-09-27');
await mkdir(outputDir, { recursive: true });
const axeSource = await readFile(path.resolve('node_modules', 'axe-core', 'axe.min.js'), 'utf8');

const productPage = await fetch(`${baseURL}/api/products?pageNumber=1`).then(r => r.json());
const productId = productPage.products[0]._id;
const targets = [
  { name: 'home', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'register', path: '/register' },
  { name: 'cart', path: '/cart' },
  { name: 'product-detail', path: `/product/${productId}` }
];

const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pages = [];

for (const target of targets) {
  const page = await context.newPage();
  await page.goto(baseURL + target.path, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const scan = await page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      resultTypes: ['violations', 'incomplete', 'passes']
    });
  });
  const screenshot = path.join(outputDir, `${target.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  pages.push({
    name: target.name,
    url: page.url(),
    violations: scan.violations,
    incomplete: scan.incomplete,
    passCount: scan.passes.length,
    screenshot: path.relative(process.cwd(), screenshot).replaceAll('\\', '/')
  });
  await page.close();
}

await context.close();
await browser.close();

const impactCounts = { critical: 0, serious: 0, moderate: 0, minor: 0, unknown: 0 };
for (const page of pages) {
  for (const violation of page.violations) {
    impactCounts[violation.impact || 'unknown'] += violation.nodes.length;
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  standard: 'WCAG 2.0/2.1 A and AA automated axe rules',
  baseURL,
  pagesScanned: pages.length,
  ruleViolations: pages.reduce((sum, page) => sum + page.violations.length, 0),
  affectedNodes: Object.values(impactCounts).reduce((a, b) => a + b, 0),
  impactCounts,
  pages
};

await writeFile(path.join(outputDir, 'axe-results.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({
  pagesScanned: report.pagesScanned,
  ruleViolations: report.ruleViolations,
  affectedNodes: report.affectedNodes,
  impactCounts
}, null, 2));

// Automated accessibility scans are evidence, not a complete WCAG audit.
process.exitCode = impactCounts.critical > 0 ? 1 : 0;
