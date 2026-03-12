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
    const attempts = 3;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        await this.page.goto('/', { waitUntil: 'load', timeout: 30_000 });
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isTransient =
          message.includes('ERR_CONNECTION_RESET') ||
          message.includes('ERR_NETWORK_CHANGED') ||
          message.includes('ERR_TIMED_OUT') ||
          message.includes('ETIMEDOUT') ||
          message.includes('ECONNRESET');

        if (!isTransient || attempt === attempts) {
          throw error;
        }

        await this.page.waitForTimeout(1500 * attempt);
      }
    }
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
