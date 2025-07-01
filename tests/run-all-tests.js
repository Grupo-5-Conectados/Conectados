const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');
const { runSimpleTests } = require('./simple-test');
const { runComprehensiveTests } = require('./comprehensive-test');
const { runAdvancedTests } = require('./advanced-test');
const fs = require('fs');
const path = require('path');

// Configuración para ejecutar todas las pruebas
const ALL_TESTS_CONFIG = {
  runComprehensive: true,
  runAdvanced: true,
  generateCombinedReport: true,
  timeout: 300000 // 5 minutos para todas las pruebas
};

// Resultados combinados
const combinedResults = {
  comprehensive: { total: 0, passed: 0, failed: 0, errors: [] },
  advanced: { total: 0, passed: 0, failed: 0, errors: [] },
  startTime: new Date(),
  endTime: null
};

// Función para generar reporte combinado
function generateCombinedReport() {
  const totalTests = combinedResults.comprehensive.total + combinedResults.advanced.total;
  const totalPassed = combinedResults.comprehensive.passed + combinedResults.advanced.passed;
  const totalFailed = combinedResults.comprehensive.failed + combinedResults.advanced.failed;
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      successRate: totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0
    },
    duration: Math.round((combinedResults.endTime - combinedResults.startTime) / 1000),
    comprehensive: {
      total: combinedResults.comprehensive.total,
      passed: combinedResults.comprehensive.passed,
      failed: combinedResults.comprehensive.failed,
      successRate: combinedResults.comprehensive.total > 0 ? 
        Math.round((combinedResults.comprehensive.passed / combinedResults.comprehensive.total) * 100) : 0
    },
    advanced: {
      total: combinedResults.advanced.total,
      passed: combinedResults.advanced.passed,
      failed: combinedResults.advanced.failed,
      successRate: combinedResults.advanced.total > 0 ? 
        Math.round((combinedResults.advanced.passed / combinedResults.advanced.total) * 100) : 0
    },
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

  fs.writeFileSync(path.join(reportDir, 'all-tests-report.json'), JSON.stringify(report, null, 2));
  console.log('📄 Reporte combinado JSON generado: reports/all-tests-report.json');
}

// Función para ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚀 INICIANDO SUITE COMPLETA DE PRUEBAS PARA CONECTADOS');
  console.log('=====================================================');
  console.log(`⏰ Inicio: ${combinedResults.startTime.toLocaleString()}`);
  console.log(`🔧 Configuración: ${JSON.stringify(ALL_TESTS_CONFIG)}`);
  console.log('');

  try {
    // Ejecutar pruebas comprehensivas
    if (ALL_TESTS_CONFIG.runComprehensive) {
      console.log('📋 EJECUTANDO PRUEBAS COMPREHENSIVAS (34 pruebas)');
      console.log('================================================');
      
      try {
        const comprehensiveResult = await runComprehensiveTests();
        // Los resultados se capturan del valor retornado
        combinedResults.comprehensive = {
          total: comprehensiveResult.testResults.total,
          passed: comprehensiveResult.testResults.passed,
          failed: comprehensiveResult.testResults.failed,
          errors: comprehensiveResult.testResults.errors
        };
      } catch (error) {
        console.error('❌ Error en pruebas comprehensivas:', error.message);
        combinedResults.comprehensive.failed++;
        combinedResults.comprehensive.errors.push({
          test: 'Error crítico en comprehensivas',
          message: error.message
        });
      }
      
      console.log('');
    }

    // Ejecutar pruebas avanzadas
    if (ALL_TESTS_CONFIG.runAdvanced) {
      console.log('📋 EJECUTANDO PRUEBAS AVANZADAS (21 pruebas)');
      console.log('============================================');
      
      try {
        const advancedResult = await runAdvancedTests();
        // Los resultados se capturan del valor retornado
        combinedResults.advanced = {
          total: advancedResult.testResults.total,
          passed: advancedResult.testResults.passed,
          failed: advancedResult.testResults.failed,
          errors: advancedResult.testResults.errors
        };
      } catch (error) {
        console.error('❌ Error en pruebas avanzadas:', error.message);
        combinedResults.advanced.failed++;
        combinedResults.advanced.errors.push({
          test: 'Error crítico en avanzadas',
          message: error.message
        });
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error crítico general:', error.message);
  } finally {
    combinedResults.endTime = new Date();
    
    // Generar reporte combinado
    if (ALL_TESTS_CONFIG.generateCombinedReport) {
      generateCombinedReport();
    }
    
    // Mostrar resumen final completo
    console.log('📊 RESUMEN FINAL COMPLETO DE TODAS LAS PRUEBAS');
    console.log('==============================================');
    
    const totalTests = combinedResults.comprehensive.total + combinedResults.advanced.total;
    const totalPassed = combinedResults.comprehensive.passed + combinedResults.advanced.passed;
    const totalFailed = combinedResults.comprehensive.failed + combinedResults.advanced.failed;
    
    console.log(`📈 TOTAL GENERAL:`);
    console.log(`   Total: ${totalTests} pruebas`);
    console.log(`   ✅ Exitosas: ${totalPassed}`);
    console.log(`   ❌ Fallidas: ${totalFailed}`);
    console.log(`   📊 Porcentaje de éxito: ${totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0}%`);
    console.log(`   ⏱️  Tiempo total: ${Math.round((combinedResults.endTime - combinedResults.startTime) / 1000)}s`);
    
    console.log('');
    console.log(`📋 PRUEBAS COMPREHENSIVAS:`);
    console.log(`   Total: ${combinedResults.comprehensive.total}`);
    console.log(`   ✅ Exitosas: ${combinedResults.comprehensive.passed}`);
    console.log(`   ❌ Fallidas: ${combinedResults.comprehensive.failed}`);
    console.log(`   📊 Porcentaje: ${combinedResults.comprehensive.total > 0 ? 
      Math.round((combinedResults.comprehensive.passed / combinedResults.comprehensive.total) * 100) : 0}%`);
    
    console.log('');
    console.log(`📋 PRUEBAS AVANZADAS:`);
    console.log(`   Total: ${combinedResults.advanced.total}`);
    console.log(`   ✅ Exitosas: ${combinedResults.advanced.passed}`);
    console.log(`   ❌ Fallidas: ${combinedResults.advanced.failed}`);
    console.log(`   📊 Porcentaje: ${combinedResults.advanced.total > 0 ? 
      Math.round((combinedResults.advanced.passed / combinedResults.advanced.total) * 100) : 0}%`);
    
    // Mostrar categorías de pruebas
    console.log('');
    console.log('📂 CATEGORÍAS DE PRUEBAS EJECUTADAS:');
    console.log('   • Navegación (6 pruebas)');
    console.log('   • Formularios (4 pruebas)');
    console.log('   • Servicios (4 pruebas)');
    console.log('   • Búsqueda (2 pruebas)');
    console.log('   • Perfil (3 pruebas)');
    console.log('   • Administración (3 pruebas)');
    console.log('   • Chat (2 pruebas)');
    console.log('   • Responsive (3 pruebas)');
    console.log('   • Contenido (4 pruebas)');
    console.log('   • Performance (3 pruebas)');
    console.log('   • Accesibilidad (3 pruebas)');
    console.log('   • SEO (3 pruebas)');
    console.log('   • Seguridad (3 pruebas)');
    console.log('   • Usabilidad (3 pruebas)');
    console.log('   • Integración (3 pruebas)');
    console.log('   • Performance Avanzado (3 pruebas)');
    console.log('   • Compatibilidad (3 pruebas)');
    
    // Mostrar errores si los hay
    const allErrors = [...combinedResults.comprehensive.errors, ...combinedResults.advanced.errors];
    if (allErrors.length > 0) {
      console.log('');
      console.log('❌ ERRORES ENCONTRADOS:');
      allErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. [${error.category || 'general'}] ${error.test}: ${error.message}`);
      });
    }
    
    // Exit code para CI/CD
    const exitCode = totalFailed > 0 ? 1 : 0;
    console.log('');
    console.log(`🏁 Finalizando con código de salida: ${exitCode}`);
    console.log('');
    console.log('🎉 ¡Suite de pruebas completada!');
    console.log(`📄 Reportes generados en: tests/reports/`);
    
    process.exit(exitCode);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, combinedResults }; 