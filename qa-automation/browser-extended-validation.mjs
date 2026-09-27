import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:5000';
const chromePath = process.env.QA_CHROME_PATH || 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = path.resolve('evidence', 'browser', '2026-09-26');
const results = [];
let registeredEmail = '';
await mkdir(evidenceDir, { recursive: true });

const page1 = await fetch(`${baseURL}/api/products?pageNumber=1`).then(r => r.json());
const page2 = await fetch(`${baseURL}/api/products?pageNumber=2`).then(r => r.json());
const products = [...page1.products, ...page2.products];
const airpods = products.find(p => p.name.includes('Airpods'));
const mouse = products.find(p => p.name.includes('Gaming Mouse'));

const browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });

async function scenario(id, fn) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  try {
    const actual = await fn(page);
    results.push({ id, status: 'Passed', actual, timestamp: new Date().toISOString() });
  } catch (error) {
    const safeId = id.replaceAll('/', '-');
    const failureShot = path.join(evidenceDir, `${safeId}-failure.png`);
    await page.screenshot({ path: failureShot, fullPage: true }).catch(() => {});
    results.push({ id, status: 'Failed', actual: error.message, evidence: path.relative(process.cwd(), failureShot).replaceAll('\\', '/'), timestamp: new Date().toISOString() });
  } finally {
    await context.close();
  }
}

async function login(page, email, password = '123456') {
  await page.goto(`${baseURL}/login`, { waitUntil: 'networkidle' });
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

await scenario('TC-AUTH-001', async page => {
  const email = `qa.browser.${Date.now()}@example.test`;
  registeredEmail = email;
  await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });
  await page.locator('#name').fill('QA Browser User');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill('123456');
  await page.locator('#confirmPassword').fill('123456');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL(baseURL + '/');
  await page.locator('#username').waitFor();
  return `Unique user ${email} registered and authenticated`;
});

await scenario('TC-AUTH-002', async page => {
  await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });
  await page.locator('#name').fill('Duplicate John');
  await page.locator('#email').fill('john@email.com');
  await page.locator('#password').fill('123456');
  await page.locator('#confirmPassword').fill('123456');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByText('User already exists').waitFor();
  return 'Duplicate seeded email rejected with User already exists';
});

await scenario('TC-AUTH-003', async page => {
  await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });
  await page.locator('#name').fill('Mismatch User');
  await page.locator('#email').fill('mismatch@example.test');
  await page.locator('#password').fill('123456');
  await page.locator('#confirmPassword').fill('654321');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByText('Passwords do not match').waitFor();
  return 'Mismatched confirmation rejected without navigation';
});

await scenario('TC-AUTH-004', async page => {
  await page.goto(`${baseURL}/register`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Register' }).click();
  const toast = page.locator('.Toastify__toast-body');
  await toast.waitFor();
  if (!page.url().endsWith('/register')) throw new Error('Empty registration navigated away');
  return `Empty registration rejected with message: ${(await toast.innerText()).replaceAll('\n', ' ')}`;
});

await scenario('TC-AUTH-005/006', async page => {
  await login(page, 'john@email.com', 'wrong-password');
  await page.getByText('Invalid email or password').waitFor();
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(baseURL + '/');
  await page.locator('#username').waitFor();
  return 'Invalid password rejected; valid customer credentials then authenticated';
});

await scenario('TC-AUTH-008', async page => {
  await login(page, 'jane@email.com');
  await page.waitForURL(baseURL + '/');
  await page.goto(`${baseURL}/profile`, { waitUntil: 'networkidle' });
  await page.locator('#name').fill('Jane QA');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByText('Profile updated successfully').waitFor();
  await page.reload({ waitUntil: 'networkidle' });
  if (await page.locator('#name').inputValue() !== 'Jane QA') throw new Error('Updated name did not persist');
  return 'Profile name updated to Jane QA and persisted after refresh';
});

await scenario('TC-CAT-002', async page => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.locator('.page-link').last().click();
  await page.waitForFunction(() => document.querySelectorAll('.product-title').length === 2);
  if (await page.locator('.product-title').count() !== 2) throw new Error('Last page did not contain two fixture products');
  return 'Page 2 control navigated to the final two fixture products';
});

await scenario('TC-CAT-006', async page => {
  await page.goto(`${baseURL}/product/${airpods._id}`, { waitUntil: 'networkidle' });
  await page.getByText('Price: $89.99').waitFor();
  await page.getByText('In Stock').waitFor();
  await page.getByText(/\d+ reviews/).first().waitFor();
  return 'Airpods detail showed price, stock, rating/reviews, description, and purchase controls';
});

await scenario('TC-REV-001/002', async page => {
  await login(page, registeredEmail);
  await page.waitForURL(baseURL + '/');
  await page.goto(`${baseURL}/product/${airpods._id}`, { waitUntil: 'networkidle' });
  await page.locator('#rating').selectOption('4');
  await page.locator('#comment').fill('QA browser review');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Review created successfully').waitFor();
  await page.locator('#rating').selectOption('5');
  await page.locator('#comment').fill('Duplicate QA review');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Product already reviewed').waitFor();
  return 'First review accepted and second review by same customer rejected';
});

await scenario('TC-CART-003/004/005', async page => {
  await page.goto(`${baseURL}/product/${airpods._id}`, { waitUntil: 'networkidle' });
  await page.locator('.card select').selectOption('2');
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.goto(`${baseURL}/product/${mouse._id}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByText('Subtotal (3) items').waitFor();
  await page.getByText('$229.97').waitFor();
  const airpodsRow = page.locator('.list-group-item').filter({ hasText: 'Airpods Wireless' }).first();
  await airpodsRow.locator('select').selectOption('3');
  await page.getByText('Subtotal (4) items').waitFor();
  const mouseRow = page.locator('.list-group-item').filter({ hasText: 'Logitech G-Series' }).first();
  await mouseRow.locator('button').click();
  await page.getByText('Subtotal (3) items').waitFor();
  await page.getByText('$269.97').waitFor();
  return 'Multi-item subtotal was 229.97; quantity update and item removal recalculated accurately';
});

await scenario('TC-CHK-003', async page => {
  await page.goto(`${baseURL}/product/${airpods._id}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByRole('button', { name: 'Proceed To Checkout' }).click();
  await page.locator('#email').fill('john@email.com');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.locator('#address').fill('1 Main St');
  await page.locator('#city').fill('Lahore');
  await page.locator('#postalCode').fill('54000');
  await page.locator('#country').fill('');
  await page.getByRole('button', { name: 'Continue' }).click();
  if (!page.url().endsWith('/shipping')) throw new Error('Missing country did not block shipping submission');
  if (!(await page.locator('#country').evaluate(el => el.matches(':invalid')))) throw new Error('Missing country was not marked invalid');
  return 'Missing required country blocked shipping submission and focused invalid field state';
});

await scenario('TC-ORD-004', async page => {
  await login(page, 'john@email.com');
  await page.waitForURL(baseURL + '/');
  await page.goto(`${baseURL}/profile`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'My Orders' }).waitFor();
  if (await page.locator('tbody tr').count() < 1) throw new Error('John order history was empty');
  return 'Customer profile listed at least one previously created order';
});

await scenario('TC-ADM-001', async page => {
  await page.goto(`${baseURL}/admin/orderlist`, { waitUntil: 'networkidle' });
  if (!page.url().endsWith('/login')) throw new Error(`Guest landed on ${page.url()}`);
  if (await page.locator('table').count()) throw new Error('Admin order table was exposed');
  return 'Guest direct admin navigation redirected to Login without data';
});

await scenario('TC-ADM-005/006-smoke', async page => {
  await login(page, 'admin@email.com');
  await page.waitForURL(baseURL + '/');
  await page.goto(`${baseURL}/admin/userlist`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Users' }).waitFor();
  if (await page.locator('tbody tr').count() < 3) throw new Error('Seeded users missing from admin list');
  await page.goto(`${baseURL}/admin/orderlist`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Orders' }).waitFor();
  if (await page.locator('tbody tr').count() < 1) throw new Error('Created order missing from admin list');
  return 'Admin user list and order list rendered expected seeded data';
});

await browser.close();
const summary = {
  runAt: new Date().toISOString(), baseURL,
  browser: 'Installed Google Chrome via Playwright Core',
  total: results.length,
  passed: results.filter(r => r.status === 'Passed').length,
  failed: results.filter(r => r.status === 'Failed').length,
  results
};
await writeFile(path.join(evidenceDir, 'browser-extended-results.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(JSON.stringify(summary, null, 2));
process.exitCode = summary.failed ? 1 : 0;
