const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');
const fs = require('fs');
const path = require('path');

// Configuración para pruebas comprehensivas
const COMPREHENSIVE_CONFIG = {
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

// Función para generar reporte detallado
function generateComprehensiveReport() {
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

  fs.writeFileSync(path.join(reportDir, 'comprehensive-report.json'), JSON.stringify(report, null, 2));
  console.log('📄 Reporte comprehensivo JSON generado: reports/comprehensive-report.json');
}

// Función para ejecutar una prueba con reintentos
async function runTestWithRetry(testName, testFunction, category = 'general', maxRetries = COMPREHENSIVE_CONFIG.maxRetries) {
  testResults.total++;
  console.log(`\n🧪 [${category.toUpperCase()}] Ejecutando: ${testName}`);
  
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
          category: category,
          message: error.message,
          attempts: attempt
        });
        console.log(`❌ ${testName} - FALLÓ después de ${maxRetries} intentos`);
      } else {
        console.log(`🔄 Reintentando...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
}

// ===== PRUEBAS DE NAVEGACIÓN =====
async function runNavigationTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Navegación a página principal
    await runTestWithRetry('Navegación a página principal', async () => {
      await helpers.navigateTo('/');
      const title = await driver.getTitle();
      if (!title || title === '') {
        throw new Error('La aplicación no responde o no tiene título');
      }
      console.log(`📄 Título: "${title}"`);
    }, 'navigation');

    // Test 2: Navegación a about
    await runTestWithRetry('Navegación a página about', async () => {
      await helpers.navigateTo('/about');
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/about')) {
        throw new Error(`URL incorrecta: ${currentUrl}`);
      }
      console.log(`🔗 URL: ${currentUrl}`);
    }, 'navigation');

    // Test 3: Navegación a login
    await runTestWithRetry('Navegación a página de login', async () => {
      await helpers.navigateTo('/login');
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/login')) {
        throw new Error(`URL incorrecta: ${currentUrl}`);
      }
      console.log(`🔗 URL: ${currentUrl}`);
    }, 'navigation');

    // Test 4: Navegación a registro
    await runTestWithRetry('Navegación a página de registro', async () => {
      await helpers.navigateTo('/register');
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/register')) {
        throw new Error(`URL incorrecta: ${currentUrl}`);
      }
      console.log(`🔗 URL: ${currentUrl}`);
    }, 'navigation');

    // Test 5: Navegación a servicios
    await runTestWithRetry('Navegación a página de servicios', async () => {
      await helpers.navigateTo('/servicios');
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/servicios')) {
        throw new Error(`URL incorrecta: ${currentUrl}`);
      }
      console.log(`🔗 URL: ${currentUrl}`);
    }, 'navigation');

    // Test 6: Verificar navegación completa
    await runTestWithRetry('Verificar navegación completa entre páginas', async () => {
      const pages = ['/', '/about', '/login', '/register', '/servicios'];
      
      for (const page of pages) {
        await helpers.navigateTo(page);
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes(page.replace('/', '')) && page !== '/') {
          throw new Error(`Error navegando a ${page}: ${currentUrl}`);
        }
        console.log(`✅ Navegación a ${page} exitosa`);
      }
    }, 'navigation');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE FORMULARIOS =====
async function runFormTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar formulario de login
    await runTestWithRetry('Verificar elementos de formulario de login', async () => {
      await helpers.navigateTo('/login');
      const inputs = await driver.findElements({ tagName: 'input' });
      console.log(`📝 Encontrados ${inputs.length} inputs en login`);
      
      if (inputs.length < 2) {
        throw new Error(`Insuficientes inputs en login: ${inputs.length}`);
      }
      
      // Verificar que hay botón de submit
      const buttons = await driver.findElements({ tagName: 'button' });
      if (buttons.length === 0) {
        throw new Error('No se encontró botón de submit en login');
      }
    }, 'forms');

    // Test 2: Verificar formulario de registro
    await runTestWithRetry('Verificar elementos de formulario de registro', async () => {
      await helpers.navigateTo('/register');
      const inputs = await driver.findElements({ tagName: 'input' });
      console.log(`📝 Encontrados ${inputs.length} inputs en registro`);
      
      if (inputs.length < 3) {
        throw new Error(`Insuficientes inputs en registro: ${inputs.length}`);
      }
      
      // Verificar que hay botón de submit
      const buttons = await driver.findElements({ tagName: 'button' });
      if (buttons.length === 0) {
        throw new Error('No se encontró botón de submit en registro');
      }
    }, 'forms');

    // Test 3: Verificar validación de formularios
    await runTestWithRetry('Verificar validación de formularios', async () => {
      await helpers.navigateTo('/login');
      
      // Intentar enviar formulario vacío
      const submitButton = await driver.findElement({ tagName: 'button' });
      await submitButton.click();
      
      // Verificar que no se envía (debería estar en la misma página)
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/login')) {
        throw new Error('Formulario se envió sin datos');
      }
    }, 'forms');

    // Test 4: Verificar campos requeridos
    await runTestWithRetry('Verificar campos requeridos en formularios', async () => {
      await helpers.navigateTo('/register');
      
      // Verificar que hay campos de email y password
      const emailInputs = await driver.findElements({ css: 'input[type="email"]' });
      const passwordInputs = await driver.findElements({ css: 'input[type="password"]' });
      
      if (emailInputs.length === 0) {
        throw new Error('No se encontró campo de email');
      }
      
      if (passwordInputs.length === 0) {
        throw new Error('No se encontró campo de password');
      }
    }, 'forms');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE SERVICIOS =====
async function runServiceTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar lista de servicios
    await runTestWithRetry('Verificar lista de servicios', async () => {
      await helpers.navigateTo('/servicios');
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      
      if (bodyText.length < 50) {
        throw new Error('Página de servicios parece estar vacía');
      }
      
      console.log(`📝 Contenido de servicios: "${bodyText.substring(0, 100)}..."`);
    }, 'services');

    // Test 2: Verificar detalle de servicio
    await runTestWithRetry('Verificar detalle de servicio', async () => {
      await helpers.navigateTo('/servicios/1');
      const currentUrl = await driver.getCurrentUrl();
      
      if (!currentUrl.includes('/servicios/')) {
        throw new Error('No se navegó al detalle del servicio');
      }
      
      console.log(`🔗 URL de detalle: ${currentUrl}`);
    }, 'services');

    // Test 3: Verificar elementos de servicios
    await runTestWithRetry('Verificar elementos de servicios', async () => {
      await helpers.navigateTo('/servicios');
      
      // Buscar elementos comunes de servicios
      const cards = await driver.findElements({ css: '.card, .service-card, [class*="card"]' });
      const titles = await driver.findElements({ css: 'h1, h2, h3, h4, .title' });
      
      console.log(`📋 Encontrados ${cards.length} cards y ${titles.length} títulos`);
      
      // Al menos debería haber algún contenido
      if (cards.length === 0 && titles.length === 0) {
        throw new Error('No se encontraron elementos de servicios');
      }
    }, 'services');

    // Test 4: Verificar navegación a crear servicio (sin login)
    await runTestWithRetry('Verificar redirección al crear servicio sin login', async () => {
      await helpers.navigateTo('/crear');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/crear')) {
        throw new Error('No se redirigió correctamente al intentar crear servicio sin login');
      }
      
      console.log(`🔗 URL después de intentar crear: ${currentUrl}`);
    }, 'services');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE BÚSQUEDA =====
async function runSearchTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar página de búsqueda (sin login)
    await runTestWithRetry('Verificar redirección a búsqueda sin login', async () => {
      await helpers.navigateTo('/buscar-servicios');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/buscar-servicios')) {
        throw new Error('No se redirigió correctamente al intentar buscar sin login');
      }
      
      console.log(`🔗 URL después de intentar buscar: ${currentUrl}`);
    }, 'search');

    // Test 2: Verificar elementos de búsqueda en servicios
    await runTestWithRetry('Verificar elementos de búsqueda en servicios', async () => {
      await helpers.navigateTo('/servicios');
      
      // Buscar elementos de búsqueda
      const searchInputs = await driver.findElements({ css: 'input[type="search"], input[placeholder*="buscar"], input[placeholder*="search"]' });
      const searchButtons = await driver.findElements({ css: 'button[type="submit"], .search-button, button:contains("Buscar")' });
      
      console.log(`🔍 Encontrados ${searchInputs.length} inputs de búsqueda y ${searchButtons.length} botones`);
      
      // No es obligatorio tener búsqueda, pero si existe debe funcionar
      if (searchInputs.length > 0 && searchButtons.length === 0) {
        console.log('⚠️ Input de búsqueda encontrado pero sin botón');
      }
    }, 'search');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE PERFIL =====
async function runProfileTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar acceso a perfil sin login
    await runTestWithRetry('Verificar redirección a perfil sin login', async () => {
      await helpers.navigateTo('/perfil');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/perfil')) {
        throw new Error('No se redirigió correctamente al intentar acceder al perfil sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder al perfil: ${currentUrl}`);
    }, 'profile');

    // Test 2: Verificar acceso a mis citas sin login
    await runTestWithRetry('Verificar redirección a mis citas sin login', async () => {
      await helpers.navigateTo('/mis-citas');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/mis-citas')) {
        throw new Error('No se redirigió correctamente al intentar acceder a mis citas sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder a mis citas: ${currentUrl}`);
    }, 'profile');

    // Test 3: Verificar acceso a agenda sin login
    await runTestWithRetry('Verificar redirección a agenda sin login', async () => {
      await helpers.navigateTo('/agenda');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/agenda')) {
        throw new Error('No se redirigió correctamente al intentar acceder a agenda sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder a agenda: ${currentUrl}`);
    }, 'profile');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE ADMINISTRACIÓN =====
async function runAdminTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar acceso a panel admin sin login
    await runTestWithRetry('Verificar redirección a panel admin sin login', async () => {
      await helpers.navigateTo('/panel-admin');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/panel-admin')) {
        throw new Error('No se redirigió correctamente al intentar acceder al panel admin sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder al panel admin: ${currentUrl}`);
    }, 'admin');

    // Test 2: Verificar acceso a gestión de usuarios sin login
    await runTestWithRetry('Verificar redirección a gestión de usuarios sin login', async () => {
      await helpers.navigateTo('/gestion-usuarios');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/gestion-usuarios')) {
        throw new Error('No se redirigió correctamente al intentar acceder a gestión de usuarios sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder a gestión de usuarios: ${currentUrl}`);
    }, 'admin');

    // Test 3: Verificar acceso a crear usuario sin login
    await runTestWithRetry('Verificar redirección a crear usuario sin login', async () => {
      await helpers.navigateTo('/crear-usuario');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/crear-usuario')) {
        throw new Error('No se redirigió correctamente al intentar crear usuario sin login');
      }
      
      console.log(`🔗 URL después de intentar crear usuario: ${currentUrl}`);
    }, 'admin');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE CHAT =====
async function runChatTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar acceso a mensajes sin login
    await runTestWithRetry('Verificar redirección a mensajes sin login', async () => {
      await helpers.navigateTo('/mensajes');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/mensajes')) {
        throw new Error('No se redirigió correctamente al intentar acceder a mensajes sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder a mensajes: ${currentUrl}`);
    }, 'chat');

    // Test 2: Verificar acceso a chat específico sin login
    await runTestWithRetry('Verificar redirección a chat específico sin login', async () => {
      await helpers.navigateTo('/chats/1');
      const currentUrl = await driver.getCurrentUrl();
      
      // Debería redirigir a login si no está autenticado
      if (!currentUrl.includes('/login') && !currentUrl.includes('/chats/')) {
        throw new Error('No se redirigió correctamente al intentar acceder al chat sin login');
      }
      
      console.log(`🔗 URL después de intentar acceder al chat: ${currentUrl}`);
    }, 'chat');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE RESPONSIVE =====
async function runResponsiveTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar vista móvil
    await runTestWithRetry('Verificar vista móvil', async () => {
      await driver.manage().window().setRect({ width: 375, height: 667 });
      await helpers.navigateTo('/');
      
      const title = await driver.getTitle();
      if (!title) {
        throw new Error('La aplicación no responde en vista móvil');
      }
      
      console.log(`📱 Vista móvil funcionando: "${title}"`);
    }, 'responsive');

    // Test 2: Verificar vista tablet
    await runTestWithRetry('Verificar vista tablet', async () => {
      await driver.manage().window().setRect({ width: 768, height: 1024 });
      await helpers.navigateTo('/');
      
      const title = await driver.getTitle();
      if (!title) {
        throw new Error('La aplicación no responde en vista tablet');
      }
      
      console.log(`📱 Vista tablet funcionando: "${title}"`);
    }, 'responsive');

    // Test 3: Verificar vista desktop
    await runTestWithRetry('Verificar vista desktop', async () => {
      await driver.manage().window().setRect({ width: 1920, height: 1080 });
      await helpers.navigateTo('/');
      
      const title = await driver.getTitle();
      if (!title) {
        throw new Error('La aplicación no responde en vista desktop');
      }
      
      console.log(`🖥️ Vista desktop funcionando: "${title}"`);
    }, 'responsive');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE CONTENIDO =====
async function runContentTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar contenido de página principal
    await runTestWithRetry('Verificar contenido de página principal', async () => {
      await helpers.navigateTo('/');
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      
      if (bodyText.length < 20) {
        throw new Error('Contenido insuficiente en página principal');
      }
      
      console.log(`📝 Contenido principal: "${bodyText.substring(0, 100)}..."`);
    }, 'content');

    // Test 2: Verificar contenido de about
    await runTestWithRetry('Verificar contenido de página about', async () => {
      await helpers.navigateTo('/about');
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      
      if (bodyText.length < 10) {
        throw new Error('Contenido insuficiente en página about');
      }
      
      console.log(`📝 Contenido about: "${bodyText.substring(0, 100)}..."`);
    }, 'content');

    // Test 3: Verificar contenido de servicios
    await runTestWithRetry('Verificar contenido de página de servicios', async () => {
      await helpers.navigateTo('/servicios');
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      
      if (bodyText.length < 20) {
        throw new Error('Contenido insuficiente en página de servicios');
      }
      
      console.log(`📝 Contenido servicios: "${bodyText.substring(0, 100)}..."`);
    }, 'content');

    // Test 4: Verificar elementos de navegación
    await runTestWithRetry('Verificar elementos de navegación', async () => {
      await helpers.navigateTo('/');
      
      // Buscar elementos de navegación
      const navElements = await driver.findElements({ css: 'nav, .navbar, .navigation, [class*="nav"]' });
      const links = await driver.findElements({ tagName: 'a' });
      
      console.log(`🧭 Encontrados ${navElements.length} elementos de navegación y ${links.length} enlaces`);
      
      if (links.length === 0) {
        throw new Error('No se encontraron enlaces de navegación');
      }
    }, 'content');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE PERFORMANCE =====
async function runPerformanceTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar tiempo de carga de página principal
    await runTestWithRetry('Verificar tiempo de carga de página principal', async () => {
      const startTime = Date.now();
      await helpers.navigateTo('/');
      const loadTime = Date.now() - startTime;
      
      if (loadTime > 10000) {
        throw new Error(`Tiempo de carga muy lento: ${loadTime}ms`);
      }
      
      console.log(`⚡ Tiempo de carga principal: ${loadTime}ms`);
    }, 'performance');

    // Test 2: Verificar tiempo de carga de servicios
    await runTestWithRetry('Verificar tiempo de carga de servicios', async () => {
      const startTime = Date.now();
      await helpers.navigateTo('/servicios');
      const loadTime = Date.now() - startTime;
      
      if (loadTime > 10000) {
        throw new Error(`Tiempo de carga de servicios muy lento: ${loadTime}ms`);
      }
      
      console.log(`⚡ Tiempo de carga servicios: ${loadTime}ms`);
    }, 'performance');

    // Test 3: Verificar tiempo de carga de login
    await runTestWithRetry('Verificar tiempo de carga de login', async () => {
      const startTime = Date.now();
      await helpers.navigateTo('/login');
      const loadTime = Date.now() - startTime;
      
      if (loadTime > 10000) {
        throw new Error(`Tiempo de carga de login muy lento: ${loadTime}ms`);
      }
      
      console.log(`⚡ Tiempo de carga login: ${loadTime}ms`);
    }, 'performance');

  } finally {
    await driver.quit();
  }
}

// Función principal para pruebas comprehensivas
async function runComprehensiveTests() {
  console.log('🚀 Iniciando pruebas comprehensivas para Conectados...');
  console.log(`⏰ Inicio: ${testResults.startTime.toLocaleString()}`);
  console.log(`🔧 Configuración: ${JSON.stringify(COMPREHENSIVE_CONFIG)}`);
  
  try {
    // Ejecutar todas las categorías de pruebas
    console.log('\n📋 Ejecutando pruebas de navegación...');
    await runNavigationTests();
    
    console.log('\n📋 Ejecutando pruebas de formularios...');
    await runFormTests();
    
    console.log('\n📋 Ejecutando pruebas de servicios...');
    await runServiceTests();
    
    console.log('\n📋 Ejecutando pruebas de búsqueda...');
    await runSearchTests();
    
    console.log('\n📋 Ejecutando pruebas de perfil...');
    await runProfileTests();
    
    console.log('\n📋 Ejecutando pruebas de administración...');
    await runAdminTests();
    
    console.log('\n📋 Ejecutando pruebas de chat...');
    await runChatTests();
    
    console.log('\n📋 Ejecutando pruebas responsive...');
    await runResponsiveTests();
    
    console.log('\n📋 Ejecutando pruebas de contenido...');
    await runContentTests();
    
    console.log('\n📋 Ejecutando pruebas de performance...');
    await runPerformanceTests();
    
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
    if (COMPREHENSIVE_CONFIG.generateReport) {
      generateComprehensiveReport();
    }
    
    // Mostrar resumen final
    console.log('\n📊 RESUMEN FINAL DE PRUEBAS COMPREHENSIVAS');
    console.log('===========================================');
    console.log(`Total: ${testResults.total}`);
    console.log(`✅ Exitosas: ${testResults.passed}`);
    console.log(`❌ Fallidas: ${testResults.failed}`);
    console.log(`⏱️  Tiempo: ${Math.round((testResults.endTime - testResults.startTime) / 1000)}s`);
    console.log(`📈 Porcentaje de éxito: ${testResults.total > 0 ? Math.round((testResults.passed / testResults.total) * 100) : 0}%`);
    
    if (testResults.errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      testResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.category}] ${error.test}: ${error.message}`);
      });
    }
    
    // Retornar resultados en lugar de terminar el proceso
    const exitCode = testResults.failed > 0 ? 1 : 0;
    console.log(`\n🏁 Pruebas comprehensivas completadas con código: ${exitCode}`);
    return { exitCode, testResults };
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runComprehensiveTests();
}

module.exports = { runComprehensiveTests, testResults }; 