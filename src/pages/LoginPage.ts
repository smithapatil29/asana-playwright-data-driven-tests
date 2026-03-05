import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = this.page.locator(
      [
        'input[name="username"]',
        'input[name="email"]',
        'input[type="text"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="user" i]'
      ].join(', ')
    ).first();

    this.passwordInput = this.page
      .locator('input[type="password"], input[name="password"]')
      .first();

    this.submitButton = this.page
      .getByRole('button', { name: /log\s?in|sign\s?in|submit/i })
      .first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.submitButton.waitFor({ state: 'visible' });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click({ noWaitAfter: true });
  }
}
