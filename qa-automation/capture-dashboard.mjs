import { chromium } from 'playwright-core';
import { browserLaunchOptions } from './browser-launch.mjs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto(pathToFileURL(path.resolve('reports', 'html', 'index.html')).href, { waitUntil: 'load' });
await page.screenshot({ path: path.resolve('reports', 'html', 'dashboard-preview.png'), fullPage: true });
await browser.close();
console.log('Dashboard preview captured');
