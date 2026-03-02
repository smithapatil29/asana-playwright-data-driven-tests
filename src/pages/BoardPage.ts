import { expect, Locator, Page } from '@playwright/test';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class BoardPage {
  private readonly navProjects: Locator;
  private readonly taskContainers: Locator;
  private readonly columnContainers: Locator;
  private readonly projectByName: (projectName: string) => Locator;
  private readonly taskCardByName: (taskName: string) => Locator;
  private readonly columnByName: (columnName: string) => Locator;

  constructor(private readonly page: Page) {
    this.navProjects = this.page.getByText(/web application|mobile application|marketing campaign/i);
    this.taskContainers = this.page.locator('div, article, li, section');
    this.columnContainers = this.page.locator('div, section, article');

    this.projectByName = (projectName: string) => this.page
      .getByText(new RegExp(`^${escapeRegExp(projectName)}$`, 'i'))
      .first();

    this.taskCardByName = (taskName: string) => this.taskContainers
      .filter({ hasText: new RegExp(escapeRegExp(taskName), 'i') })
      .last();

    this.columnByName = (columnName: string) => this.columnContainers
      .filter({ hasText: new RegExp(escapeRegExp(columnName), 'i') })
      .last();
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.navProjects.first()).toBeVisible();
  }

  async openProject(projectName: string): Promise<void> {
    const project = this.projectByName(projectName);
    await expect(project).toBeVisible();
    await project.click();
  }

  async expectTaskInColumn(taskName: string, columnName: string): Promise<void> {
    const taskCard = this.taskCardByName(taskName);
    await expect(taskCard).toBeVisible();

    const columnContainer = this.columnByName(columnName);
    await expect(columnContainer).toContainText(taskName);
  }

  async expectTaskTags(taskName: string, tags: string[]): Promise<void> {
    const taskCard = this.taskCardByName(taskName);
    for (const tag of tags) {
      await expect(taskCard).toContainText(new RegExp(escapeRegExp(tag), 'i'));
    }
  }

  async expectProjectNotAvailable(projectName: string): Promise<void> {
    const project = this.page.getByText(new RegExp(`^${escapeRegExp(projectName)}$`, 'i'));
    await expect(project).toHaveCount(0);
  }

  async expectTaskNotVisible(taskName: string): Promise<void> {
    const taskCards = this.taskContainers.filter({
      hasText: new RegExp(escapeRegExp(taskName), 'i')
    });
    await expect(taskCards).toHaveCount(0);
  }

  async expectTaskNotInColumn(taskName: string, columnName: string): Promise<void> {
    const columnContainer = this.columnByName(columnName);
    await expect(columnContainer).not.toContainText(new RegExp(escapeRegExp(taskName), 'i'));
  }

  async expectTaskMissingTags(taskName: string, tags: string[]): Promise<void> {
    const taskCard = this.taskCardByName(taskName);
    await expect(taskCard).toBeVisible();

    for (const tag of tags) {
      await expect(taskCard).not.toContainText(new RegExp(escapeRegExp(tag), 'i'));
    }
  }
}
