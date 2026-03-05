import { expect, test } from './fixtures';
import { BoardPage } from '../src/pages/BoardPage';
import {
  categorizedTestScenarios,
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
        const boardPage = new BoardPage(page);

        await page.goto('/');

        await boardPage.waitForLoaded();

        await boardPage.openProject(testScenario.project);

        const taskCard = boardPage.getTaskCard(testScenario.task);
        await expect(taskCard).toBeVisible();
        await expect(boardPage.getColumn(testScenario.column)).toContainText(testScenario.task);

        for (const tag of testScenario.tags) {
          await expect(taskCard).toContainText(tag);
        }
      });
    }
  });
}
