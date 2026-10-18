import { expect, test } from '@playwright/test';

test('renderiza o acesso sintético em desktop e mobile', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /melimetrics/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /acessar dashboard/i })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'visible');
});
