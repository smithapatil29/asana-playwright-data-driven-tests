import { defineConfig } from '@playwright/test';
import projectRunConfig from './data/project-run-config.json';

type BrowserKey = 'chrome' | 'firefox' | 'webkit';

type RunConfig = {
  baseURL?: string;
  browsers?: {
    all?: boolean;
    chrome?: boolean;
    firefox?: boolean;
    webkit?: boolean;
  };
};

const runConfig = projectRunConfig as RunConfig;

const browserProjectMap: Record<BrowserKey, { name: BrowserKey; use: { browserName: 'chromium' | 'firefox' | 'webkit' } }> = {
  chrome: {
    name: 'chrome',
    use: {
      browserName: 'chromium'
    }
  },
  firefox: {
    name: 'firefox',
    use: {
      browserName: 'firefox'
    }
  },
  webkit: {
    name: 'webkit',
    use: {
      browserName: 'webkit'
    }
  }
};

const allBrowserKeys: BrowserKey[] = ['chrome', 'firefox', 'webkit'];

function getEnabledBrowserProjects() {
  const browserConfig = runConfig.browsers;

  if (!browserConfig || browserConfig.all) {
    return allBrowserKeys.map((key) => browserProjectMap[key]);
  }

  const selected = allBrowserKeys
    .filter((key) => Boolean(browserConfig[key]))
    .map((key) => browserProjectMap[key]);

  if (selected.length > 0) {
    return selected;
  }

  return [browserProjectMap.chrome];
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: runConfig.baseURL ?? 'https://animated-gingersnap-8cf7f2.netlify.app/',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: getEnabledBrowserProjects()
});
