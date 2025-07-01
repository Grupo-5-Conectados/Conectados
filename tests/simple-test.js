const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');

async function runSimpleTests() {
  console.log('🚀 Iniciando pruebas simplificadas...');
  
  let driver;
  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  try {
    console.log('1. Creando driver...');
    driver = await createDriver();
    const helpers = new TestHelpers(driver);
    console.log('✅ Driver creado');

    // Test 1: Navegación a página principal
    testResults.total++;
    try {
      console.log('\n🧪 Test 1: Navegación a página principal');
      await helpers.navigateTo('/');
      const title = await driver.getTitle();
      console.log(`📄 Título: "${title}"`);
      
      if (title.includes('React App') || title.includes('Conectados')) {
        testResults.passed++;
        console.log('✅ Test 1 PASÓ');
      } else {
        throw new Error('Título inesperado');
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: 'Navegación principal', error: error.message });
      console.log('❌ Test 1 FALLÓ:', error.message);
    }

    // Test 2: Navegación a login
    testResults.total++;
    try {
      console.log('\n🧪 Test 2: Navegación a login');
      await helpers.navigateTo('/login');
      const currentUrl = await driver.getCurrentUrl();
      console.log(`🔗 URL: "${currentUrl}"`);
      
      if (currentUrl.includes('/login')) {
        testResults.passed++;
        console.log('✅ Test 2 PASÓ');
      } else {
        throw new Error('No se navegó a login');
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: 'Navegación login', error: error.message });
      console.log('❌ Test 2 FALLÓ:', error.message);
    }

    // Test 3: Verificar elementos de login
    testResults.total++;
    try {
      console.log('\n🧪 Test 3: Verificar elementos de login');
      
      // Buscar cualquier input en la página
      const inputs = await driver.findElements({ tagName: 'input' });
      console.log(`📝 Encontrados ${inputs.length} inputs`);
      
      if (inputs.length >= 2) {
        testResults.passed++;
        console.log('✅ Test 3 PASÓ');
      } else {
        throw new Error('No hay suficientes inputs');
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: 'Elementos login', error: error.message });
      console.log('❌ Test 3 FALLÓ:', error.message);
    }

    // Test 4: Navegación a servicios
    testResults.total++;
    try {
      console.log('\n🧪 Test 4: Navegación a servicios');
      await helpers.navigateTo('/servicios');
      const currentUrl = await driver.getCurrentUrl();
      console.log(`🔗 URL: "${currentUrl}"`);
      
      if (currentUrl.includes('/servicios')) {
        testResults.passed++;
        console.log('✅ Test 4 PASÓ');
      } else {
        throw new Error('No se navegó a servicios');
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: 'Navegación servicios', error: error.message });
      console.log('❌ Test 4 FALLÓ:', error.message);
    }

    // Test 5: Verificar contenido de servicios
    testResults.total++;
    try {
      console.log('\n🧪 Test 5: Verificar contenido de servicios');
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      console.log(`📝 Contenido: "${bodyText.substring(0, 100)}..."`);
      
      if (bodyText.length > 50) {
        testResults.passed++;
        console.log('✅ Test 5 PASÓ');
      } else {
        throw new Error('Página vacía');
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: 'Contenido servicios', error: error.message });
      console.log('❌ Test 5 FALLÓ:', error.message);
    }

    // Test 6: Navegación a registro
    testResults.total++;
    try {
      console.log('\n🧪 Test 6: Navegación a registro');
      await helpers.navigateTo('/register');
      const currentUrl = await driver.getCurrentUrl();
      console.log(`🔗 URL: "${currentUrl}"`);
      
      if (currentUrl.includes('/register')) {
        testResults.passed++;
        console.log('✅ Test 6 PASÓ');
      } else {
        throw new Error('No se navegó a registro');
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ test: 'Navegación registro', error: error.message });
      console.log('❌ Test 6 FALLÓ:', error.message);
    }

    // Tomar screenshot final
    await helpers.takeScreenshot('simple-test-final');
    console.log('📸 Screenshot final guardado');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    testResults.failed++;
    testResults.errors.push({ test: 'Error general', error: error.message });
  } finally {
    if (driver) {
      await driver.quit();
      console.log('🔒 Driver cerrado');
    }
  }

  // Mostrar resumen
  console.log('\n📊 RESUMEN DE PRUEBAS SIMPLIFICADAS');
  console.log('=====================================');
  console.log(`Total: ${testResults.total}`);
  console.log(`✅ Exitosas: ${testResults.passed}`);
  console.log(`❌ Fallidas: ${testResults.failed}`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errores:');
    testResults.errors.forEach(error => {
      console.log(`  - ${error.test}: ${error.error}`);
    });
  }

  return testResults;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSimpleTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = { runSimpleTests }; 