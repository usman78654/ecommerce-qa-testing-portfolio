import path from 'node:path';

const WINDOWS_CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

export function browserLaunchOptions() {
  const configuredPath = process.env.QA_CHROME_PATH;
  const options = { headless: true, args: ['--no-sandbox'] };

  if (configuredPath && configuredPath !== 'bundled') {
    options.executablePath = path.resolve(configuredPath);
  } else if (!configuredPath && process.platform === 'win32') {
    options.executablePath = WINDOWS_CHROME;
  }

  return options;
}
