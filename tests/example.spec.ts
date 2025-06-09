import { test, expect } from '@playwright/test';

test('PlaywrightWithJenkins - homepage has title and shows login', async ({ page }) => {
  await page.goto('http://localhost:3000'); // ajusta el puerto si es otro
  await expect(page).toHaveTitle(/Conectados/); // o el título real de tu app
  await expect(page.locator('text=Iniciar sesión')).toBeVisible(); // cambia según tu interfaz
});

test('PlaywrightWithJenkins - login works', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'usuario@ejemplo.com');
  await page.fill('input[name="password"]', '123456');
  await page.click('text=Entrar');
  await expect(page.locator('text=Bienvenido')).toBeVisible();
});
