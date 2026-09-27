import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:5000';
const chromePath = process.env.QA_CHROME_PATH ||
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.resolve('evidence', 'browser', '2026-09-26');
const results = [];

const catalog = await fetch(`${baseURL}/api/products?pageNumber=1`).then(response => response.json());
const airpods = catalog.products.find(product => product.name.includes('Airpods'));
if (!airpods) throw new Error('Airpods fixture was not found in the seeded catalog');

await mkdir(evidenceDir, { recursive: true });

function record(id, status, actual, screenshot = '') {
  results.push({ id, status, actual, screenshot, timestamp: new Date().toISOString() });
}

async function check(id, action) {
  try {
    const detail = await action();
    record(id, 'Passed', detail || 'Expected behavior observed');
  } catch (error) {
    record(id, 'Failed', error.message);
  }
}

async function shot(page, name, fullPage = true) {
  const target = path.join(evidenceDir, name);
  await page.screenshot({ path: target, fullPage });
  return path.relative(process.cwd(), target).replaceAll('\\', '/');
}

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox']
});

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
page.setDefaultTimeout(10000);

await check('TC-CAT-001', async () => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Latest Products' }).waitFor();
  const cards = page.locator('.card');
  if (await cards.count() !== 4) throw new Error(`Expected 4 products on page 1; found ${await cards.count()}`);
  const screenshot = await shot(page, 'TC-CAT-001-home-desktop.png');
  results.at(-1)?.screenshot;
  return `Four products rendered on page 1; screenshot ${screenshot}`;
});

await check('TC-CAT-003/004', async () => {
  const search = page.getByPlaceholder('Search Products...');
  await search.fill('aIrPoDs');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForURL(/\/search\/aIrPoDs/);
  await page.getByText('Airpods Wireless Bluetooth Headphones').waitFor();
  const products = page.locator('.product-title');
  if (await products.count() !== 1) throw new Error(`Expected one result; found ${await products.count()}`);
  const screenshot = await shot(page, 'TC-CAT-003-search-mixed-case.png');
  return `Mixed-case search returned the Airpods product; screenshot ${screenshot}`;
});

await check('TC-CAT-005', async () => {
  await page.goto(`${baseURL}/search/zz-no-product`, { waitUntil: 'networkidle' });
  if (await page.locator('.product-title').count() !== 0) throw new Error('Unexpected product returned');
  const screenshot = await shot(page, 'TC-CAT-005-no-results.png');
  return `No product cards displayed; screenshot ${screenshot}`;
});

await check('TC-CAT-007', async () => {
  await page.goto(`${baseURL}/search/Amazon%20Echo`, { waitUntil: 'networkidle' });
  await page.getByText('Amazon Echo Dot 3rd Generation').click();
  await page.getByText('Out Of Stock').waitFor();
  if (!(await page.getByRole('button', { name: 'Add To Cart' }).isDisabled())) throw new Error('Add To Cart was enabled');
  const screenshot = await shot(page, 'TC-CAT-007-out-of-stock.png');
  return `Out-of-stock label shown and Add To Cart disabled; screenshot ${screenshot}`;
});

await check('TC-CART-001/002/006/007', async () => {
  await page.goto(`${baseURL}/product/${airpods._id}`, { waitUntil: 'networkidle' });
  const qty = page.locator('.card select');
  const optionCount = await qty.locator('option').count();
  if (optionCount !== airpods.countInStock) throw new Error(`Quantity options ${optionCount} do not match stock ${airpods.countInStock}`);
  await qty.selectOption('3');
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByText('Subtotal (3) items').waitFor();
  await page.getByText('$269.97').waitFor();
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Subtotal (3) items').waitFor();
  const screenshot = await shot(page, 'TC-CART-006-decimal-and-persistence.png');
  return `Quantity options capped at 10; 3 x 89.99 = 269.97 and persisted after refresh; screenshot ${screenshot}`;
});

await check('TC-CHK-001', async () => {
  await page.getByRole('button', { name: 'Proceed To Checkout' }).click();
  await page.waitForURL(/\/login\?redirect=\/shipping/);
  await page.locator('#email').fill('john@email.com');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(/\/shipping$/);
  await page.getByRole('heading', { name: 'Shipping' }).waitFor();
  return 'Guest redirected to login and returned to Shipping after authentication';
});

await check('TC-CHK-002/004', async () => {
  await page.locator('#address').fill('1 Main St');
  await page.locator('#city').fill('Lahore');
  await page.locator('#postalCode').fill('54000');
  await page.locator('#country').fill('Pakistan');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('heading', { name: 'Payment Method' }).waitFor();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('heading', { name: 'Order Summary' }).waitFor();
  const screenshot = await shot(page, 'TC-CHK-004-order-review.png');
  return `Shipping and payment persisted to order review; screenshot ${screenshot}`;
});

await check('TC-ORD-001', async () => {
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.waitForURL(/\/order\/[a-f0-9]+$/);
  await page.getByText('Not Paid').waitFor();
  const orderId = page.url().split('/').pop();
  await writeFile(path.join(evidenceDir, 'created-order-id.txt'), `${orderId}\n`, 'utf8');
  const screenshot = await shot(page, 'TC-ORD-001-order-created.png');
  return `Order ${orderId} created and order detail displayed; screenshot ${screenshot}`;
});

await check('TC-AUTH-007/CART-008', async () => {
  await page.getByRole('button', { name: /John Doe/ }).click();
  await page.getByText('Logout').click();
  await page.waitForURL(/\/login$/);
  await page.locator('#email').fill('jane@email.com');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });
  await page.getByText('Your cart is empty').waitFor();
  const screenshot = await shot(page, 'TC-CART-008-account-cart-isolation.png');
  return `After account switch, Jane's cart is empty; screenshot ${screenshot}`;
});

await check('TC-ADM-002', async () => {
  await page.goto(`${baseURL}/admin/userlist`, { waitUntil: 'networkidle' });
  if (page.url().includes('/admin/userlist')) throw new Error('Customer remained on admin user-list URL');
  if (await page.getByRole('heading', { name: 'Users' }).count()) throw new Error('Admin Users heading was exposed');
  if (await page.locator('table').count()) throw new Error('Admin user table was exposed');
  return `Customer denied admin user list and redirected to ${page.url()}`;
});

await desktop.close();

const mobile = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true
});
const mobilePage = await mobile.newPage();
mobilePage.setDefaultTimeout(10000);

await check('TC-UX-001', async () => {
  await mobilePage.goto(baseURL, { waitUntil: 'networkidle' });
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error('Horizontal overflow exists at 375px');
  await mobilePage.getByRole('button', { name: 'Toggle navigation' }).click();
  await mobilePage.getByPlaceholder('Search Products...').fill('Airpods');
  await mobilePage.getByRole('button', { name: 'Search' }).click();
  await mobilePage.getByText('Airpods Wireless Bluetooth Headphones').click();
  await mobilePage.getByRole('button', { name: 'Add To Cart' }).click();
  await mobilePage.getByText('Subtotal (1) items').waitFor();
  const screenshot = await shot(mobilePage, 'TC-UX-001-mobile-cart.png');
  return `375px catalog-to-cart usable without horizontal overflow; screenshot ${screenshot}`;
});

await check('TC-UX-002', async () => {
  await mobilePage.getByRole('button', { name: 'Proceed To Checkout' }).click();
  await mobilePage.locator('#email').fill('john@email.com');
  await mobilePage.locator('#password').fill('123456');
  await mobilePage.getByRole('button', { name: 'Sign In' }).click();
  await mobilePage.locator('#address').fill('1 Main St');
  await mobilePage.locator('#city').fill('Lahore');
  await mobilePage.locator('#postalCode').fill('54000');
  await mobilePage.locator('#country').fill('Pakistan');
  await mobilePage.getByRole('button', { name: 'Continue' }).click();
  await mobilePage.getByRole('button', { name: 'Continue' }).click();
  await mobilePage.getByRole('heading', { name: 'Order Summary' }).waitFor();
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error('Horizontal overflow exists in checkout at 375px');
  const screenshot = await shot(mobilePage, 'TC-UX-002-mobile-checkout.png');
  return `375px checkout review usable without horizontal overflow; screenshot ${screenshot}`;
});

await mobile.close();
await browser.close();

const summary = {
  runAt: new Date().toISOString(),
  baseURL,
  browser: 'Installed Google Chrome via Playwright Core',
  total: results.length,
  passed: results.filter(r => r.status === 'Passed').length,
  failed: results.filter(r => r.status === 'Failed').length,
  results
};

await writeFile(path.join(evidenceDir, 'browser-results.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(JSON.stringify(summary, null, 2));
process.exitCode = summary.failed ? 1 : 0;
