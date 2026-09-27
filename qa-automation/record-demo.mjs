import { chromium } from 'playwright-core';
import { browserLaunchOptions } from './browser-launch.mjs';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:5000';
const outputDir = path.resolve('evidence', 'demo');
const tempDir = path.join(outputDir, '.video-temp');
await mkdir(tempDir, { recursive: true });

const browser = await chromium.launch(browserLaunchOptions());
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: tempDir, size: { width: 1280, height: 720 } }
});
const page = await context.newPage();
const video = page.video();
const pause = ms => page.waitForTimeout(ms);

await page.goto(pathToFileURL(path.resolve('reports', 'html', 'index.html')).href, { waitUntil: 'load' });
await pause(2500);
await page.evaluate(() => window.scrollTo({ top: 680, behavior: 'smooth' }));
await pause(2200);
await page.evaluate(() => window.scrollTo({ top: 1450, behavior: 'smooth' }));
await pause(2500);

await page.goto(baseURL, { waitUntil: 'networkidle' });
await pause(2200);
await page.getByPlaceholder('Search Products...').fill('Airpods');
await pause(800);
await page.getByRole('button', { name: 'Search' }).click();
await page.getByText('Airpods Wireless Bluetooth Headphones').waitFor();
await pause(1800);
await page.getByText('Airpods Wireless Bluetooth Headphones').click();
await page.getByRole('button', { name: 'Add To Cart' }).waitFor();
await pause(2000);
await page.getByRole('button', { name: 'Add To Cart' }).click();
await page.getByText('Shopping Cart').waitFor();
await pause(2200);

await page.goto(pathToFileURL(path.resolve('reports', 'html', 'index.html')).href, { waitUntil: 'load' });
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
await pause(3000);

await page.close();
await context.close();
await browser.close();

const recorded = await video.path();
const target = path.join(outputDir, 'proshop-qa-walkthrough.webm');
await copyFile(recorded, target);
console.log(`Demo video written to ${path.relative(process.cwd(), target)}`);
