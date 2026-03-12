import { defineConfig } from '@playwright/test';
import projectRunConfig from './data/project-run-config.json';

type RunConfig = {
  baseURL: string;
};

const runConfig = projectRunConfig as RunConfig;

if (!runConfig.baseURL) {
  throw new Error('baseURL is required in data/project-run-config.json');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 4,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: runConfig.baseURL,
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chrome',
      use: { browserName: 'chromium' }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' }
    }
  ]
});
