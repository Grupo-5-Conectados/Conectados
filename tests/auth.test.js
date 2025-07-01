const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');

describe('Pruebas de Autenticación', () => {
  let driver;
  let helpers;

  beforeAll(async () => {
    driver = await createDriver();
    helpers = new TestHelpers(driver);
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    // Limpiar cookies antes de cada prueba
    await driver.manage().deleteAllCookies();
  });

  describe('Registro de Usuario', () => {
    test('Debería registrar un nuevo usuario exitosamente', async () => {
      await helpers.navigateTo('/register');
      
      // Llenar formulario de registro
      await helpers.typeText('input[name="nombre"]', 'Usuario Test');
      await helpers.typeText('input[name="email"]', `test${Date.now()}@example.com`);
      await helpers.typeText('input[name="password"]', 'password123');
      await helpers.typeText('input[name="confirmPassword"]', 'password123');
      
      // Seleccionar rol de usuario
      await helpers.clickElement('input[value="usuario"]');
      
      // Enviar formulario
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar redirección a login o mensaje de éxito
      try {
        await helpers.waitForUrlChange('/login', 5000);
        console.log('Usuario registrado exitosamente');
      } catch (error) {
        // Si no redirige, verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('registrado');
        expect(hasSuccess).toBe(true);
      }
    }, 30000);

    test('Debería mostrar error con contraseñas diferentes', async () => {
      await helpers.navigateTo('/register');
      
      await helpers.typeText('input[name="nombre"]', 'Usuario Test');
      await helpers.typeText('input[name="email"]', 'test@example.com');
      await helpers.typeText('input[name="password"]', 'password123');
      await helpers.typeText('input[name="confirmPassword"]', 'differentpassword');
      
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar mensaje de error
      const hasError = await helpers.checkErrorMessage('contraseñas');
      expect(hasError).toBe(true);
    }, 30000);
  });

  describe('Login de Usuario', () => {
    test('Debería hacer login exitosamente con credenciales válidas', async () => {
      await helpers.navigateTo('/login');
      
      await helpers.typeText('input[name="email"]', 'admin@conectados.com');
      await helpers.typeText('input[name="password"]', 'admin123');
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar redirección a perfil
      await helpers.waitForUrlChange('/perfil', 10000);
      
      // Verificar que estamos en la página de perfil
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/perfil');
    }, 30000);

    test('Debería mostrar error con credenciales inválidas', async () => {
      await helpers.navigateTo('/login');
      
      await helpers.typeText('input[name="email"]', 'invalid@example.com');
      await helpers.typeText('input[name="password"]', 'wrongpassword');
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar mensaje de error
      const hasError = await helpers.checkErrorMessage('credenciales');
      expect(hasError).toBe(true);
    }, 30000);

    test('Debería validar campos requeridos', async () => {
      await helpers.navigateTo('/login');
      
      // Intentar enviar formulario vacío
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar que no se envía el formulario (debería estar en la misma página)
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    }, 30000);
  });

  describe('Logout', () => {
    test('Debería hacer logout exitosamente', async () => {
      // Primero hacer login
      await helpers.login('admin@conectados.com', 'admin123');
      
      // Verificar que estamos logueados
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/perfil');
      
      // Hacer logout
      await helpers.logout();
      
      // Verificar redirección a home o login
      const urlAfterLogout = await driver.getCurrentUrl();
      expect(urlAfterLogout).toMatch(/\/(login|$)/);
    }, 30000);
  });

  describe('Navegación sin autenticación', () => {
    test('Debería redirigir a login cuando se accede a página protegida', async () => {
      await helpers.navigateTo('/perfil');
      
      // Verificar redirección a login
      await helpers.waitForUrlChange('/login', 5000);
      
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    }, 30000);
  });
}); 