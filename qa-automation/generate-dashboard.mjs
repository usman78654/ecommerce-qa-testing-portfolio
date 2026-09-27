import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.resolve('reports', 'html');
await mkdir(outputDir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { field += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(value => value.length)) rows.push(row);
      row = [];
    } else field += char;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const [headers, ...data] = rows;
  return data.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function escape(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

async function readJson(relative, fallback = null) {
  try { return JSON.parse(await readFile(path.resolve(relative), 'utf8')); }
  catch { return fallback; }
}

const cases = parseCsv(await readFile(path.resolve('test-cases', 'manual-test-cases.csv'), 'utf8'));
const browser = await readJson('evidence/browser/2026-09-26/browser-results.json', { total: 0, passed: 0, failed: 0, results: [] });
const extended = await readJson('evidence/browser/2026-09-26/browser-extended-results.json', { total: 0, passed: 0, failed: 0, results: [] });
const accessibility = await readJson('evidence/accessibility/2026-09-27/axe-results.json');
const performanceReport = await readJson('evidence/performance/2026-09-27/performance-results.json');
const defects = (await readdir(path.resolve('defects'))).filter(name => /^BUG-\d+.*\.md$/.test(name)).sort();

const statusCounts = { Passed: 0, Failed: 0, 'Not Run': 0, Blocked: 0 };
for (const testCase of cases) statusCounts[testCase.Status] = (statusCounts[testCase.Status] || 0) + 1;
const executed = statusCounts.Passed + statusCounts.Failed + statusCounts.Blocked;
const passRate = executed ? ((statusCounts.Passed / executed) * 100).toFixed(1) : '0.0';
const coverage = cases.length ? ((executed / cases.length) * 100).toFixed(1) : '0.0';

const defectRows = [];
for (const defect of defects) {
  const text = await readFile(path.resolve('defects', defect), 'utf8');
  defectRows.push({
    id: defect.match(/BUG-\d+/)?.[0] || defect,
    title: text.match(/^#\s+BUG-\d+\s+(.+)$/m)?.[1] || defect,
    severity: text.match(/\*\*Severity \/ priority:\*\*\s*(.+)/)?.[1] || 'Unknown'
  });
}

const statusBars = ['Passed', 'Failed', 'Not Run'].map(status => {
  const value = statusCounts[status] || 0;
  const width = cases.length ? (value / cases.length) * 100 : 0;
  return `<div class="bar-row"><span>${status}</span><div class="track"><div class="bar ${status.toLowerCase().replace(' ', '-')}" style="width:${width}%"></div></div><strong>${value}</strong></div>`;
}).join('');

const accessibilitySection = accessibility ? `
  <div class="card"><h3>Accessibility</h3><div class="metric">${accessibility.pagesScanned}</div><p>pages scanned with axe</p></div>
  <div class="card"><h3>Affected nodes</h3><div class="metric warn">${accessibility.affectedNodes}</div><p>${accessibility.ruleViolations} rule violations</p></div>` :
  `<div class="card"><h3>Accessibility</h3><div class="metric muted">Pending</div><p>Run npm run test:accessibility</p></div>`;

const performanceSection = performanceReport ? performanceReport.results.map(result => `
  <tr><td>${escape(result.name)}</td><td>${result.requests}</td><td>${result.concurrency}</td><td>${result.responseTimeMs.average} ms</td><td>${result.responseTimeMs.p95} ms</td><td>${result.throughputPerSecond}/s</td><td>${(result.errorRate * 100).toFixed(1)}%</td></tr>`).join('') :
  `<tr><td colspan="7">Run npm run test:performance to populate this section.</td></tr>`;

const failedCases = cases.filter(item => item.Status === 'Failed').map(item => `
  <tr><td>${escape(item.Test_Case_ID)}</td><td>${escape(item.Module)}</td><td>${escape(item.Title)}</td><td>${escape(item.Priority)}</td><td>${escape(item.Evidence)}</td></tr>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ProShop QA Portfolio Dashboard</title>
<style>
:root{--navy:#20364a;--blue:#2878b5;--green:#218838;--red:#c0392b;--amber:#d68910;--ink:#24313d;--muted:#687785;--paper:#f5f7fa;--line:#dce3e9}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}header{background:linear-gradient(135deg,var(--navy),#46647e);color:#fff;padding:36px max(5vw,24px)}header h1{margin:0 0 6px;font-size:32px}header p{margin:0;color:#dce8f2}main{max-width:1180px;margin:auto;padding:28px 24px 60px}h2{margin-top:34px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}.card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:18px;box-shadow:0 2px 10px #1d344510}.card h3{margin:0;color:var(--muted);font-size:14px;text-transform:uppercase;letter-spacing:.04em}.metric{font-size:36px;font-weight:750;color:var(--blue);margin:6px 0}.metric.good{color:var(--green)}.metric.bad{color:var(--red)}.metric.warn{color:var(--amber)}.metric.muted{font-size:24px;color:var(--muted)}.card p{margin:0;color:var(--muted)}.panel{background:#fff;border:1px solid var(--line);border-radius:10px;padding:20px;margin-top:16px}.bar-row{display:grid;grid-template-columns:80px 1fr 36px;gap:12px;align-items:center;margin:12px 0}.track{height:18px;background:#edf1f4;border-radius:9px;overflow:hidden}.bar{height:100%}.passed{background:var(--green)}.failed{background:var(--red)}.not-run{background:#9aa7b2}table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:11px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:#edf3f7;color:#34495e}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:10px}.tag{display:inline-block;padding:3px 8px;border-radius:12px;background:#e8eef3;margin:2px 4px 2px 0;font-size:12px}.footer{color:var(--muted);margin-top:30px}.no-go{color:#fff;background:var(--red);display:inline-block;padding:7px 12px;border-radius:6px;font-weight:700}
</style></head><body>
<header><h1>ProShop QA Portfolio</h1><p>Evidence dashboard · generated ${escape(new Date().toISOString())}</p></header>
<main><p class="no-go">Release recommendation: NO-GO</p>
<div class="grid">
  <div class="card"><h3>Traceable cases</h3><div class="metric">${cases.length}</div><p>${executed} executed · ${coverage}% coverage</p></div>
  <div class="card"><h3>Pass rate</h3><div class="metric good">${passRate}%</div><p>${statusCounts.Passed} passed of ${executed} executed</p></div>
  <div class="card"><h3>Failed cases</h3><div class="metric bad">${statusCounts.Failed}</div><p>Evidence attached to every result</p></div>
  <div class="card"><h3>Confirmed defects</h3><div class="metric bad">${defects.length}</div><p>Critical authorization defect open</p></div>
  <div class="card"><h3>Browser workflows</h3><div class="metric">${browser.total + extended.total}</div><p>${browser.passed + extended.passed} passed · ${browser.failed + extended.failed} failed</p></div>
  ${accessibilitySection}
</div>
<h2>Case execution</h2><div class="panel">${statusBars}</div>
<h2>Failed traceable cases</h2><div class="table-wrap"><table><thead><tr><th>ID</th><th>Module</th><th>Title</th><th>Priority</th><th>Evidence</th></tr></thead><tbody>${failedCases}</tbody></table></div>
<h2>Defects</h2><div class="table-wrap"><table><thead><tr><th>ID</th><th>Summary</th><th>Severity / priority</th></tr></thead><tbody>${defectRows.map(d => `<tr><td>${escape(d.id)}</td><td>${escape(d.title)}</td><td>${escape(d.severity)}</td></tr>`).join('')}</tbody></table></div>
<h2>Local performance smoke</h2><div class="table-wrap"><table><thead><tr><th>Scenario</th><th>Requests</th><th>Concurrency</th><th>Average</th><th>P95</th><th>Throughput</th><th>Error rate</th></tr></thead><tbody>${performanceSection}</tbody></table></div>
<p class="footer">Source evidence: manual-test-cases.csv, browser JSON reports, axe results, performance results, and defect reports. Automated accessibility results do not replace manual WCAG evaluation. Local load results are not production capacity claims.</p>
</main></body></html>`;

await writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
console.log(`Dashboard written to ${path.relative(root, path.join(outputDir, 'index.html'))}`);
