const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function loginTest() {
  let options = new chrome.Options();
  options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await driver.get('http://localhost:3000/login');

    await driver.findElement(By.name('email')).sendKeys('usuario@ejemplo.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.xpath("//button[contains(text(),'Entrar')]")).click();

    // Esperar mensaje visible o cambio de URL
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Bienvenido')]")), 5000);

    console.log("✅ Prueba de login exitosa");
  } catch (error) {
    console.error("❌ Prueba de login fallida:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();
