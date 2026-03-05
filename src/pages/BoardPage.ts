import { Locator, Page } from '@playwright/test';

export class BoardPage {
  private readonly navProjects: Locator;
  private readonly taskContainers: Locator;
  private readonly columnContainers: Locator;

  constructor(private readonly page: Page) {
    this.navProjects = this.page.getByText(/web application|mobile application/i);
    this.taskContainers = this.page.locator('div, article, li, section');
    this.columnContainers = this.page.locator('div, section, article');
  }

  async waitForLoaded(): Promise<void> {
    await this.navProjects.first().waitFor({ state: 'visible' });
  }

  async openProject(projectName: string): Promise<void> {
    await this.getProject(projectName).click();
  }

  getProject(projectName: string): Locator {
    return this.page
      .getByText(projectName, { exact: true })
      .first();
  }

  getTaskCard(taskName: string): Locator {
    return this.taskContainers
      .filter({ hasText: taskName })
      .last();
  }

  getColumn(columnName: string): Locator {
    return this.columnContainers
      .filter({ hasText: columnName })
      .last();
  }
}
