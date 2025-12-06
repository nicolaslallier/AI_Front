import { test, expect } from '@playwright/test';

test.describe('Counter Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display counter application title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Counter Application' })).toBeVisible();
  });

  test('should display initial counter value of 0', async ({ page }) => {
    const counterValue = page.locator('text=/^0$/').first();
    await expect(counterValue).toBeVisible();
  });

  test('should increment counter when increment button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Increment' }).click();
    const counterValue = page.locator('text=/^1$/').first();
    await expect(counterValue).toBeVisible();
  });

  test('should decrement counter when decrement button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Decrement' }).click();
    const counterValue = page.locator('text=/^-1$/').first();
    await expect(counterValue).toBeVisible();
  });

  test('should reset counter to 0 when reset button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Reset' }).click();
    const counterValue = page.locator('text=/^0$/').first();
    await expect(counterValue).toBeVisible();
  });

  test('should display double count correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.locator('text=Double: 4')).toBeVisible();
  });

  test('should display history of counter values', async ({ page }) => {
    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.locator('text=History (3 entries)')).toBeVisible();
  });

  test('should clear history when clear button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Clear History' }).click();
    await expect(page.locator('text=History (1 entries)')).toBeVisible();
  });

  test('should apply positive color class when counter is positive', async ({ page }) => {
    await page.getByRole('button', { name: 'Increment' }).click();
    const counterValue = page.locator('.text-green-600').first();
    await expect(counterValue).toBeVisible();
  });

  test('should apply negative color class when counter is negative', async ({ page }) => {
    await page.getByRole('button', { name: 'Decrement' }).click();
    const counterValue = page.locator('.text-red-600').first();
    await expect(counterValue).toBeVisible();
  });
});
