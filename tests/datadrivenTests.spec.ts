import { test } from '@playwright/test';
import { BoardPage } from '../src/pages/BoardPage';
import { LoginPage } from '../src/pages/LoginPage';
import {
  categorizedTestScenarios,
  runConfig,
  shouldRunProject,
  shouldRunRequestedProject
} from './setup';

for (const [projectName, projectScenarios] of Object.entries(categorizedTestScenarios)) {
  if (!shouldRunProject(projectName) || !shouldRunRequestedProject(projectName)) {
    continue;
  }

  test.describe(`Project ${projectName}`, () => {
    for (const testScenario of projectScenarios) {
      test(`[TC${testScenario.id}] ${testScenario.name}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const boardPage = new BoardPage(page);

        await loginPage.goto();
        await loginPage.login(runConfig.credentials.email, runConfig.credentials.password);

        await boardPage.waitForLoaded();

        if (testScenario.expectedResult === 'negative') {
          if (testScenario.negativeCheck === 'projectNotFound') {
            await boardPage.expectProjectNotAvailable(testScenario.project);
            return;
          }

          await boardPage.openProject(testScenario.project);

          if (testScenario.negativeCheck === 'taskNotFound') {
            await boardPage.expectTaskNotVisible(testScenario.task);
            return;
          }

          if (testScenario.negativeCheck === 'taskNotInColumn') {
            await boardPage.expectTaskNotInColumn(testScenario.task, testScenario.column);
            return;
          }

          await boardPage.expectTaskMissingTags(testScenario.task, testScenario.tags);
          return;
        }

        await boardPage.openProject(testScenario.project);
        await boardPage.expectTaskInColumn(testScenario.task, testScenario.column);
        await boardPage.expectTaskTags(testScenario.task, testScenario.tags);
      });
    }
  });
}
