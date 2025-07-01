const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');
const fs = require('fs');
const path = require('path');

// Configuración para CI/CD
const CI_CONFIG = {
  maxRetries: 2,
  timeout: 30000,
  screenshotOnFailure: true,
  generateReport: true
};

// Resultados de las pruebas
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  startTime: new Date(),
  endTime: null
};

// Función para generar reporte simple
function generateSimpleReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0
    },
    duration: Math.round((testResults.endTime - testResults.startTime) / 1000),
    errors: testResults.errors,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      ci: process.env.CI || false
    }
  };

  const reportDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(path.join(reportDir, 'ci-report.json'), JSON.stringify(report, null, 2));
  console.log('📄 Reporte JSON generado: reports/ci-report.json');
}

// Función para ejecutar una prueba con reintentos
async function runTestWithRetry(testName, testFunction, maxRetries = CI_CONFIG.maxRetries) {
  testResults.total++;
  console.log(`\n🧪 Ejecutando: ${testName}`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await testFunction();
      testResults.passed++;
      console.log(`✅ ${testName} - PASÓ`);
      return;
    } catch (error) {
      console.log(`❌ Intento ${attempt}/${maxRetries} falló: ${error.message}`);
      
      if (attempt === maxRetries) {
        testResults.failed++;
        testResults.errors.push({
          test: testName,
          message: error.message,
          attempts: attempt
        });
        console.log(`❌ ${testName} - FALLÓ después de ${maxRetries} intentos`);
      } else {
        console.log(`🔄 Reintentando...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
      }
    }
  }
}

// Pruebas básicas de navegación
async function runBasicNavigationTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar que la aplicación responde
    await runTestWithRetry('Verificar respuesta de la aplicación', async () => {
      await helpers.navigateTo('/');
      const title = await driver.getTitle();
      if (!title || title === '') {
        throw new Error('La aplicación no responde o no tiene título');
      }
      console.log(`📄 Título: "${title}"`);
    });

    // Test 2: Navegación a login
    await runTestWithRetry('Navegación a página de login', async () => {
      await helpers.navigateTo('/login');
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/login')) {
        throw new Error(`URL incorrecta: ${currentUrl}`);
      }
      console.log(`🔗 URL: ${currentUrl}`);
    });

    // Test 3: Navegación a servicios
    await runTestWithRetry('Navegación a página de servicios', async () => {
      await helpers.navigateTo('/servicios');
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/servicios')) {
        throw new Error(`URL incorrecta: ${currentUrl}`);
      }
      console.log(`🔗 URL: ${currentUrl}`);
    });

    // Test 4: Verificar contenido básico
    await runTestWithRetry('Verificar contenido básico de la aplicación', async () => {
      await helpers.navigateTo('/');
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      if (bodyText.length < 20) {
        throw new Error('Contenido insuficiente en la página');
      }
      console.log(`📝 Contenido: "${bodyText.substring(0, 50)}..."`);
    });

  } finally {
    await driver.quit();
  }
}

// Pruebas de elementos de interfaz
async function runInterfaceTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar elementos de login
    await runTestWithRetry('Verificar elementos de formulario de login', async () => {
      await helpers.navigateTo('/login');
      const inputs = await driver.findElements({ tagName: 'input' });
      console.log(`📝 Encontrados ${inputs.length} inputs en login`);
      
      if (inputs.length < 2) {
        throw new Error(`Insuficientes inputs en login: ${inputs.length}`);
      }
    });

    // Test 2: Verificar elementos de registro
    await runTestWithRetry('Verificar elementos de formulario de registro', async () => {
      await helpers.navigateTo('/register');
      const inputs = await driver.findElements({ tagName: 'input' });
      console.log(`📝 Encontrados ${inputs.length} inputs en registro`);
      
      if (inputs.length < 3) {
        throw new Error(`Insuficientes inputs en registro: ${inputs.length}`);
      }
    });

    // Test 3: Verificar navegación entre páginas
    await runTestWithRetry('Verificar navegación completa', async () => {
      const pages = ['/', '/login', '/register', '/servicios'];
      
      for (const page of pages) {
        await helpers.navigateTo(page);
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes(page.replace('/', '')) && page !== '/') {
          throw new Error(`Error navegando a ${page}: ${currentUrl}`);
        }
        console.log(`✅ Navegación a ${page} exitosa`);
      }
    });

  } finally {
    await driver.quit();
  }
}

// Función principal para CI/CD
async function runCITests() {
  console.log('🚀 Iniciando pruebas de CI/CD para Conectados...');
  console.log(`⏰ Inicio: ${testResults.startTime.toLocaleString()}`);
  console.log(`🔧 Configuración: ${JSON.stringify(CI_CONFIG)}`);
  
  try {
    // Ejecutar pruebas básicas
    console.log('\n📋 Ejecutando pruebas básicas de navegación...');
    await runBasicNavigationTests();
    
    console.log('\n📋 Ejecutando pruebas de interfaz...');
    await runInterfaceTests();
    
  } catch (error) {
    console.error('❌ Error crítico en las pruebas:', error.message);
    testResults.failed++;
    testResults.errors.push({
      test: 'Error crítico',
      message: error.message
    });
  } finally {
    testResults.endTime = new Date();
    
    // Generar reporte
    if (CI_CONFIG.generateReport) {
      generateSimpleReport();
    }
    
    // Mostrar resumen final
    console.log('\n📊 RESUMEN FINAL DE PRUEBAS CI/CD');
    console.log('===================================');
    console.log(`Total: ${testResults.total}`);
    console.log(`✅ Exitosas: ${testResults.passed}`);
    console.log(`❌ Fallidas: ${testResults.failed}`);
    console.log(`⏱️  Tiempo: ${Math.round((testResults.endTime - testResults.startTime) / 1000)}s`);
    console.log(`📈 Porcentaje de éxito: ${testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0}%`);
    
    if (testResults.errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      testResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.test}: ${error.message}`);
      });
    }
    
    // Exit code para CI/CD
    const exitCode = testResults.failed > 0 ? 1 : 0;
    console.log(`\n🏁 Finalizando con código de salida: ${exitCode}`);
    process.exit(exitCode);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runCITests();
}

module.exports = { runCITests, testResults }; 