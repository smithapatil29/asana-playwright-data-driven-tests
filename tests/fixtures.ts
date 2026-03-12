import fs from 'fs';
import path from 'path';
import { BrowserContext, Page, test as base } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import projectRunConfig from '../data/project-run-config.json';

type ProjectConfig = {
  credentials: {
    email: string;
    password: string;
  };
  baseURL?: string;
};

const config = projectRunConfig as ProjectConfig;

type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<{}, WorkerFixtures>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const authDir = path.join(workerInfo.project.outputDir, '.auth');
      const authFile = path.join(authDir, `${workerInfo.parallelIndex}.json`);
      const configuredBaseUrl = config.baseURL ?? workerInfo.project.use.baseURL;

      if (!configuredBaseUrl) {
        throw new Error('baseURL is not configured. Set it in data/project-run-config.json or playwright.config.ts');
      }

      if (!fs.existsSync(authFile)) {
        fs.mkdirSync(authDir, { recursive: true });

        let context: BrowserContext | undefined;
        let page: Page | undefined;

        try {
          context = await browser.newContext({
            baseURL: configuredBaseUrl
          });

          page = await context.newPage();
          const loginPage = new LoginPage(page);

          await loginPage.goto();
          await loginPage.login(config.credentials.email, config.credentials.password);

          await context.storageState({ path: authFile });
        } finally {
          if (page) {
            await page.close();
          }

          if (context) {
            await context.close();
          }
        }
      }

      await use(authFile);
    },
    { scope: 'worker', timeout: 120_000 }
  ]
});

export { expect } from '@playwright/test';