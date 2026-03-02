import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/animated-gingersnap-8cf7f2\.netlify\.app/i);
  }

  async login(email: string, password: string): Promise<void> {
    const emailInput = this.resolveEmailInput();
    const passwordInput = this.resolvePasswordInput();
    const submitButton = this.resolveSubmitButton();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click({ noWaitAfter: true });
  }

  private resolveEmailInput(): Locator {
    return this.page.locator(
      [
        'input[name="username"]',
        'input[name="email"]',
        'input[type="text"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="user" i]'
      ].join(', ')
    ).first();
  }

  private resolvePasswordInput(): Locator {
    return this.page.locator('input[type="password"], input[name="password"]').first();
  }

  private resolveSubmitButton(): Locator {
    return this.page
      .getByRole('button', { name: /log\s?in|sign\s?in|submit/i })
      .first();
  }
}
