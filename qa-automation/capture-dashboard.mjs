import { chromium } from 'playwright-core';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const chromePath = process.env.QA_CHROME_PATH ||
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto(pathToFileURL(path.resolve('reports', 'html', 'index.html')).href, { waitUntil: 'load' });
await page.screenshot({ path: path.resolve('reports', 'html', 'dashboard-preview.png'), fullPage: true });
await browser.close();
console.log('Dashboard preview captured');
