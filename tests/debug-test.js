const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');

async function debugTest() {
  console.log('🔍 Iniciando debug de Selenium...');
  
  let driver;
  try {
    console.log('1. Creando driver de Chrome...');
    driver = await createDriver();
    console.log('✅ Driver creado exitosamente');
    
    const helpers = new TestHelpers(driver);
    
    console.log('2. Navegando a la página principal...');
    await helpers.navigateTo('/');
    console.log('✅ Navegación completada');
    
    console.log('3. Obteniendo título de la página...');
    const title = await driver.getTitle();
    console.log(`📄 Título de la página: "${title}"`);
    
    console.log('4. Obteniendo URL actual...');
    const currentUrl = await driver.getCurrentUrl();
    console.log(`🔗 URL actual: "${currentUrl}"`);
    
    console.log('5. Verificando elementos básicos...');
    const bodyText = await driver.findElement({ tagName: 'body' }).getText();
    console.log(`📝 Primeros 200 caracteres del body: "${bodyText.substring(0, 200)}..."`);
    
    console.log('6. Tomando screenshot...');
    await helpers.takeScreenshot('debug-test');
    console.log('✅ Screenshot guardado');
    
    console.log('7. Navegando a login...');
    await helpers.navigateTo('/login');
    console.log('✅ Navegación a login completada');
    
    console.log('8. Verificando elementos de login...');
    try {
      const emailInput = await helpers.waitForElement('input[name="email"]', 5000);
      console.log('✅ Campo email encontrado');
    } catch (error) {
      console.log('❌ Campo email no encontrado');
      console.log('Buscando cualquier input...');
      const inputs = await driver.findElements({ tagName: 'input' });
      console.log(`Encontrados ${inputs.length} inputs en la página`);
    }
    
    console.log('9. Tomando screenshot de login...');
    await helpers.takeScreenshot('debug-login');
    console.log('✅ Screenshot de login guardado');
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Tomar screenshot en caso de error
    if (driver) {
      try {
        const helpers = new TestHelpers(driver);
        await helpers.takeScreenshot('debug-error');
        console.log('✅ Screenshot de error guardado');
      } catch (screenshotError) {
        console.error('Error tomando screenshot:', screenshotError.message);
      }
    }
  } finally {
    if (driver) {
      console.log('10. Cerrando driver...');
      await driver.quit();
      console.log('✅ Driver cerrado');
    }
  }
  
  console.log('🏁 Debug completado');
}

// Ejecutar el debug
debugTest().catch(console.error); 