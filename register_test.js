const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function registerTest() {
  let options = new chrome.Options();
  options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get('http://localhost:3000/register');

    // Rellenar todos los campos del formulario
    await driver.findElement(By.name('name')).sendKeys('Usuario de Prueba');
    await driver.findElement(By.name('email')).sendKeys('usuario@ejemplo.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.name('confirmPassword')).sendKeys('123456');

    // Seleccionar rol - Ejemplo si son botones o radios
    await driver.findElement(By.xpath("//label[contains(text(),'Cliente')]")).click();

    // Hacer click en Registrarse
    await driver.findElement(By.xpath("//button[contains(text(),'Registrarse')]")).click();

    // Esperar mensaje de éxito o redirección
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Registro exitoso. Redirigiendo al login…')]")),
      5000
    );

    console.log("✅ Prueba exitosa: Registro completado");
  } catch (error) {
    console.error("❌ Prueba fallida:", error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();
