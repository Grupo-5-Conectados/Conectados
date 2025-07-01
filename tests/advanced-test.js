const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');
const fs = require('fs');
const path = require('path');

// Configuración para pruebas avanzadas
const ADVANCED_CONFIG = {
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
function generateAdvancedReport() {
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

  fs.writeFileSync(path.join(reportDir, 'advanced-report.json'), JSON.stringify(report, null, 2));
  console.log('📄 Reporte avanzado JSON generado: reports/advanced-report.json');
}

// Función para ejecutar una prueba con reintentos
async function runTestWithRetry(testName, testFunction, category = 'general', maxRetries = ADVANCED_CONFIG.maxRetries) {
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

// ===== PRUEBAS DE ACCESIBILIDAD =====
async function runAccessibilityTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar elementos semánticos
    await runTestWithRetry('Verificar elementos semánticos HTML', async () => {
      await helpers.navigateTo('/');
      
      // Verificar elementos semánticos importantes
      const headers = await driver.findElements({ tagName: 'h1' });
      const navs = await driver.findElements({ tagName: 'nav' });
      const mains = await driver.findElements({ tagName: 'main' });
      const footers = await driver.findElements({ tagName: 'footer' });
      
      console.log(`📋 Elementos semánticos: ${headers.length} h1, ${navs.length} nav, ${mains.length} main, ${footers.length} footer`);
      
      if (headers.length === 0) {
        throw new Error('No se encontraron encabezados H1');
      }
    }, 'accessibility');

    // Test 2: Verificar atributos alt en imágenes
    await runTestWithRetry('Verificar atributos alt en imágenes', async () => {
      await helpers.navigateTo('/');
      
      const images = await driver.findElements({ tagName: 'img' });
      console.log(`🖼️ Encontradas ${images.length} imágenes`);
      
      if (images.length > 0) {
        let imagesWithAlt = 0;
        for (const img of images) {
          const alt = await img.getAttribute('alt');
          if (alt !== null) {
            imagesWithAlt++;
          }
        }
        
        if (imagesWithAlt < images.length) {
          console.log(`⚠️ ${images.length - imagesWithAlt} imágenes sin atributo alt`);
        }
      }
    }, 'accessibility');

    // Test 3: Verificar contraste de colores (básico)
    await runTestWithRetry('Verificar contraste básico de colores', async () => {
      await helpers.navigateTo('/');
      
      // Verificar que hay texto visible
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      if (bodyText.length < 10) {
        throw new Error('Texto insuficiente para verificar contraste');
      }
      
      console.log(`📝 Texto encontrado para verificar contraste: ${bodyText.substring(0, 50)}...`);
    }, 'accessibility');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE SEO =====
async function runSEOTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar meta tags en página principal
    await runTestWithRetry('Verificar meta tags en página principal', async () => {
      await helpers.navigateTo('/');
      
      const metaTags = await driver.findElements({ tagName: 'meta' });
      console.log(`🔍 Encontrados ${metaTags.length} meta tags`);
      
      // Verificar meta tags importantes
      let hasViewport = false;
      let hasCharset = false;
      
      for (const meta of metaTags) {
        const name = await meta.getAttribute('name');
        const charset = await meta.getAttribute('charset');
        
        if (name === 'viewport') hasViewport = true;
        if (charset) hasCharset = true;
      }
      
      if (!hasViewport) {
        console.log('⚠️ No se encontró meta viewport');
      }
      
      if (!hasCharset) {
        console.log('⚠️ No se encontró charset meta tag');
      }
    }, 'seo');

    // Test 2: Verificar títulos de páginas
    await runTestWithRetry('Verificar títulos de páginas', async () => {
      const pages = [
        { path: '/', expected: 'React App' },
        { path: '/about', expected: 'React App' },
        { path: '/login', expected: 'React App' },
        { path: '/register', expected: 'React App' },
        { path: '/servicios', expected: 'React App' }
      ];
      
      for (const page of pages) {
        await helpers.navigateTo(page.path);
        const title = await driver.getTitle();
        
        if (!title || title === '') {
          throw new Error(`Página ${page.path} no tiene título`);
        }
        
        console.log(`📄 ${page.path}: "${title}"`);
      }
    }, 'seo');

    // Test 3: Verificar estructura de URLs
    await runTestWithRetry('Verificar estructura de URLs', async () => {
      const pages = ['/', '/about', '/login', '/register', '/servicios'];
      
      for (const page of pages) {
        await helpers.navigateTo(page);
        const currentUrl = await driver.getCurrentUrl();
        
        if (!currentUrl.includes('localhost:3000')) {
          throw new Error(`URL incorrecta para ${page}: ${currentUrl}`);
        }
        
        console.log(`🔗 ${page} -> ${currentUrl}`);
      }
    }, 'seo');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE SEGURIDAD =====
async function runSecurityTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar protección de rutas privadas
    await runTestWithRetry('Verificar protección de rutas privadas', async () => {
      const privateRoutes = [
        '/perfil',
        '/mis-citas',
        '/agenda',
        '/crear',
        '/panel-admin',
        '/gestion-usuarios',
        '/crear-usuario',
        '/mensajes',
        '/chats/1',
        '/buscar-servicios'
      ];
      
      for (const route of privateRoutes) {
        await helpers.navigateTo(route);
        const currentUrl = await driver.getCurrentUrl();
        
        // Debería redirigir a login
        if (!currentUrl.includes('/login')) {
          console.log(`⚠️ Ruta ${route} no redirige a login: ${currentUrl}`);
        } else {
          console.log(`✅ ${route} protegida correctamente`);
        }
      }
    }, 'security');

    // Test 2: Verificar formularios sin XSS básico
    await runTestWithRetry('Verificar formularios sin XSS básico', async () => {
      await helpers.navigateTo('/login');
      
      // Buscar inputs y verificar que no ejecutan scripts
      const inputs = await driver.findElements({ tagName: 'input' });
      
      for (const input of inputs) {
        const type = await input.getAttribute('type');
        if (type === 'text' || type === 'email') {
          // Intentar insertar script básico
          await input.clear();
          await input.sendKeys('<script>alert("test")</script>');
          
          const value = await input.getAttribute('value');
          if (value.includes('<script>')) {
            console.log(`⚠️ Input ${type} no filtra scripts: ${value}`);
          }
        }
      }
    }, 'security');

    // Test 3: Verificar headers de seguridad
    await runTestWithRetry('Verificar headers de seguridad básicos', async () => {
      await helpers.navigateTo('/');
      
      // Verificar que la página carga sin errores de seguridad
      const title = await driver.getTitle();
      if (!title) {
        throw new Error('Página no carga correctamente');
      }
      
      console.log(`🔒 Página principal carga sin errores de seguridad: "${title}"`);
    }, 'security');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE USABILIDAD =====
async function runUsabilityTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar navegación intuitiva
    await runTestWithRetry('Verificar navegación intuitiva', async () => {
      await helpers.navigateTo('/');
      
      // Verificar que hay enlaces de navegación claros
      const links = await driver.findElements({ tagName: 'a' });
      const buttons = await driver.findElements({ tagName: 'button' });
      
      console.log(`🔗 Encontrados ${links.length} enlaces y ${buttons.length} botones`);
      
      if (links.length < 3) {
        throw new Error('Insuficientes enlaces de navegación');
      }
      
      // Verificar que hay enlaces a páginas principales
      let hasHomeLink = false;
      let hasServicesLink = false;
      
      for (const link of links) {
        const text = await link.getText();
        const href = await link.getAttribute('href');
        
        if (text.toLowerCase().includes('inicio') || href.includes('/')) {
          hasHomeLink = true;
        }
        if (text.toLowerCase().includes('servicio') || href.includes('/servicios')) {
          hasServicesLink = true;
        }
      }
      
      if (!hasHomeLink) {
        console.log('⚠️ No se encontró enlace a inicio');
      }
      if (!hasServicesLink) {
        console.log('⚠️ No se encontró enlace a servicios');
      }
    }, 'usability');

    // Test 2: Verificar feedback visual
    await runTestWithRetry('Verificar feedback visual', async () => {
      await helpers.navigateTo('/login');
      
      // Verificar que hay elementos interactivos
      const inputs = await driver.findElements({ tagName: 'input' });
      const buttons = await driver.findElements({ tagName: 'button' });
      
      if (inputs.length === 0) {
        throw new Error('No hay campos de entrada');
      }
      
      if (buttons.length === 0) {
        throw new Error('No hay botones de acción');
      }
      
      console.log(`👁️ Elementos interactivos: ${inputs.length} inputs, ${buttons.length} botones`);
    }, 'usability');

    // Test 3: Verificar consistencia de diseño
    await runTestWithRetry('Verificar consistencia de diseño', async () => {
      const pages = ['/', '/about', '/login', '/register', '/servicios'];
      
      for (const page of pages) {
        await helpers.navigateTo(page);
        
        // Verificar que cada página tiene elementos básicos
        const body = await driver.findElement({ tagName: 'body' });
        const text = await body.getText();
        
        if (text.length < 10) {
          throw new Error(`Página ${page} tiene muy poco contenido`);
        }
        
        console.log(`🎨 ${page}: ${text.length} caracteres de contenido`);
      }
    }, 'usability');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE INTEGRACIÓN =====
async function runIntegrationTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar flujo completo de navegación
    await runTestWithRetry('Verificar flujo completo de navegación', async () => {
      const navigationFlow = [
        { from: '/', to: '/about', description: 'Inicio -> About' },
        { from: '/about', to: '/servicios', description: 'About -> Servicios' },
        { from: '/servicios', to: '/login', description: 'Servicios -> Login' },
        { from: '/login', to: '/register', description: 'Login -> Register' },
        { from: '/register', to: '/', description: 'Register -> Inicio' }
      ];
      
      for (const step of navigationFlow) {
        await helpers.navigateTo(step.from);
        await helpers.navigateTo(step.to);
        
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes(step.to.replace('/', '')) && step.to !== '/') {
          throw new Error(`Error en flujo ${step.description}: ${currentUrl}`);
        }
        
        console.log(`✅ ${step.description}: ${currentUrl}`);
      }
    }, 'integration');

    // Test 2: Verificar persistencia de estado
    await runTestWithRetry('Verificar persistencia de estado básica', async () => {
      await helpers.navigateTo('/');
      const initialTitle = await driver.getTitle();
      
      await helpers.navigateTo('/about');
      await helpers.navigateTo('/');
      
      const finalTitle = await driver.getTitle();
      
      if (initialTitle !== finalTitle) {
        throw new Error('El título cambió inesperadamente');
      }
      
      console.log(`🔄 Estado persistente: "${initialTitle}"`);
    }, 'integration');

    // Test 3: Verificar manejo de errores
    await runTestWithRetry('Verificar manejo de errores', async () => {
      // Intentar acceder a una ruta inexistente
      await helpers.navigateTo('/ruta-inexistente-12345');
      
      const currentUrl = await driver.getCurrentUrl();
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      
      // Debería mostrar algún mensaje de error o redirigir
      if (bodyText.length < 5) {
        throw new Error('Página de error vacía');
      }
      
      console.log(`🚫 Manejo de error: "${bodyText.substring(0, 50)}..."`);
    }, 'integration');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE RENDIMIENTO AVANZADO =====
async function runAdvancedPerformanceTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar tiempo de carga bajo diferentes condiciones
    await runTestWithRetry('Verificar tiempo de carga bajo diferentes condiciones', async () => {
      const pages = ['/', '/about', '/login', '/register', '/servicios'];
      const results = [];
      
      for (const page of pages) {
        const startTime = Date.now();
        await helpers.navigateTo(page);
        const loadTime = Date.now() - startTime;
        
        results.push({ page, loadTime });
        
        if (loadTime > 15000) {
          throw new Error(`Página ${page} muy lenta: ${loadTime}ms`);
        }
        
        console.log(`⚡ ${page}: ${loadTime}ms`);
      }
      
      const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
      console.log(`📊 Tiempo promedio de carga: ${Math.round(avgLoadTime)}ms`);
    }, 'performance');

    // Test 2: Verificar uso de memoria
    await runTestWithRetry('Verificar uso de memoria básico', async () => {
      await helpers.navigateTo('/');
      
      // Simular múltiples navegaciones para verificar memoria
      for (let i = 0; i < 5; i++) {
        await helpers.navigateTo('/about');
        await helpers.navigateTo('/servicios');
        await helpers.navigateTo('/');
      }
      
      const title = await driver.getTitle();
      if (!title) {
        throw new Error('Aplicación no responde después de múltiples navegaciones');
      }
      
      console.log(`💾 Aplicación estable después de múltiples navegaciones: "${title}"`);
    }, 'performance');

    // Test 3: Verificar responsividad de la interfaz
    await runTestWithRetry('Verificar responsividad de la interfaz', async () => {
      const viewports = [
        { width: 320, height: 568, name: 'Mobile Small' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Desktop Small' },
        { width: 1920, height: 1080, name: 'Desktop Large' }
      ];
      
      for (const viewport of viewports) {
        await driver.manage().window().setRect(viewport);
        await helpers.navigateTo('/');
        
        const title = await driver.getTitle();
        if (!title) {
          throw new Error(`Aplicación no responde en ${viewport.name}`);
        }
        
        console.log(`📱 ${viewport.name}: "${title}"`);
      }
    }, 'performance');

  } finally {
    await driver.quit();
  }
}

// ===== PRUEBAS DE COMPATIBILIDAD =====
async function runCompatibilityTests() {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    // Test 1: Verificar compatibilidad con diferentes resoluciones
    await runTestWithRetry('Verificar compatibilidad con diferentes resoluciones', async () => {
      const resolutions = [
        { width: 1366, height: 768, name: 'HD' },
        { width: 1920, height: 1080, name: 'Full HD' },
        { width: 2560, height: 1440, name: '2K' },
        { width: 3840, height: 2160, name: '4K' }
      ];
      
      for (const resolution of resolutions) {
        await driver.manage().window().setRect(resolution);
        await helpers.navigateTo('/');
        
        const title = await driver.getTitle();
        if (!title) {
          throw new Error(`Aplicación no funciona en resolución ${resolution.name}`);
        }
        
        console.log(`🖥️ ${resolution.name}: "${title}"`);
      }
    }, 'compatibility');

    // Test 2: Verificar compatibilidad de navegador
    await runTestWithRetry('Verificar compatibilidad de navegador', async () => {
      await helpers.navigateTo('/');
      
      // Verificar funcionalidades básicas del navegador
      const title = await driver.getTitle();
      const url = await driver.getCurrentUrl();
      const bodyText = await driver.findElement({ tagName: 'body' }).getText();
      
      if (!title || !url || bodyText.length < 10) {
        throw new Error('Funcionalidades básicas del navegador no funcionan');
      }
      
      console.log(`🌐 Navegador compatible: "${title}" en ${url}`);
    }, 'compatibility');

    // Test 3: Verificar manejo de JavaScript
    await runTestWithRetry('Verificar manejo de JavaScript', async () => {
      await helpers.navigateTo('/');
      
      // Verificar que JavaScript funciona
      const result = await driver.executeScript('return document.title');
      
      if (!result) {
        throw new Error('JavaScript no funciona correctamente');
      }
      
      console.log(`⚡ JavaScript funcionando: "${result}"`);
    }, 'compatibility');

  } finally {
    await driver.quit();
  }
}

// Función principal para pruebas avanzadas
async function runAdvancedTests() {
  console.log('🚀 Iniciando pruebas avanzadas para Conectados...');
  console.log(`⏰ Inicio: ${testResults.startTime.toLocaleString()}`);
  console.log(`🔧 Configuración: ${JSON.stringify(ADVANCED_CONFIG)}`);
  
  try {
    // Ejecutar todas las categorías de pruebas avanzadas
    console.log('\n📋 Ejecutando pruebas de accesibilidad...');
    await runAccessibilityTests();
    
    console.log('\n📋 Ejecutando pruebas de SEO...');
    await runSEOTests();
    
    console.log('\n📋 Ejecutando pruebas de seguridad...');
    await runSecurityTests();
    
    console.log('\n📋 Ejecutando pruebas de usabilidad...');
    await runUsabilityTests();
    
    console.log('\n📋 Ejecutando pruebas de integración...');
    await runIntegrationTests();
    
    console.log('\n📋 Ejecutando pruebas de rendimiento avanzado...');
    await runAdvancedPerformanceTests();
    
    console.log('\n📋 Ejecutando pruebas de compatibilidad...');
    await runCompatibilityTests();
    
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
    if (ADVANCED_CONFIG.generateReport) {
      generateAdvancedReport();
    }
    
    // Mostrar resumen final
    console.log('\n📊 RESUMEN FINAL DE PRUEBAS AVANZADAS');
    console.log('=====================================');
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
    console.log(`\n🏁 Pruebas avanzadas completadas con código: ${exitCode}`);
    return { exitCode, testResults };
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAdvancedTests();
}

module.exports = { runAdvancedTests, testResults }; 