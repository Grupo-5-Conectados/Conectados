const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');

describe('Pruebas de Panel de Administración', () => {
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
    await driver.manage().deleteAllCookies();
    // Login como admin
    await helpers.login('admin@conectados.com', 'admin123');
  });

  describe('Gestión de Usuarios', () => {
    test('Debería mostrar la lista de usuarios', async () => {
      await helpers.navigateTo('/gestion-usuarios');
      
      // Verificar que la página carga
      await helpers.waitForPageLoad();
      
      // Verificar que hay tabla o lista de usuarios
      const hasUserList = await helpers.elementExists('.user-table, .user-list, table');
      expect(hasUserList).toBe(true);
    }, 30000);

    test('Debería crear un nuevo usuario', async () => {
      await helpers.navigateTo('/crear-usuario');
      
      // Llenar formulario de usuario
      await helpers.typeText('input[name="nombre"]', 'Usuario Admin Test');
      await helpers.typeText('input[name="email"]', `admin-test-${Date.now()}@example.com`);
      await helpers.typeText('input[name="password"]', 'password123');
      await helpers.typeText('input[name="confirmPassword"]', 'password123');
      
      // Seleccionar rol
      await helpers.clickElement('input[value="usuario"]');
      
      // Enviar formulario
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar mensaje de éxito
      const hasSuccess = await helpers.checkSuccessMessage('creado');
      expect(hasSuccess).toBe(true);
    }, 30000);

    test('Debería editar un usuario existente', async () => {
      await helpers.navigateTo('/gestion-usuarios');
      
      // Buscar botón de editar en el primer usuario
      const editButton = await helpers.waitForElement('.edit-user, .btn-edit', 5000);
      if (editButton) {
        await editButton.click();
        
        // Modificar nombre
        await helpers.typeText('input[name="nombre"]', ' - Editado');
        
        // Guardar cambios
        await helpers.clickElement('button[type="submit"]');
        
        // Verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('actualizado');
        expect(hasSuccess).toBe(true);
      } else {
        console.log('No hay usuarios para editar');
      }
    }, 30000);

    test('Debería eliminar un usuario', async () => {
      await helpers.navigateTo('/gestion-usuarios');
      
      // Buscar botón de eliminar
      const deleteButton = await helpers.waitForElement('.delete-user, .btn-delete', 5000);
      if (deleteButton) {
        await deleteButton.click();
        
        // Confirmar eliminación
        try {
          await helpers.clickElement('.modal .btn-danger, .confirm-delete');
        } catch (error) {
          // Si no hay modal, continuar
        }
        
        // Verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('eliminado');
        expect(hasSuccess).toBe(true);
      } else {
        console.log('No hay usuarios para eliminar');
      }
    }, 30000);
  });

  describe('Gestión de Denuncias', () => {
    test('Debería mostrar la lista de denuncias', async () => {
      await helpers.navigateTo('/denuncias');
      
      // Verificar que la página carga
      await helpers.waitForPageLoad();
      
      // Verificar que hay tabla o lista de denuncias
      const hasDenunciasList = await helpers.elementExists('.denuncias-table, .denuncias-list, table');
      expect(hasDenunciasList).toBe(true);
    }, 30000);

    test('Debería resolver una denuncia', async () => {
      await helpers.navigateTo('/denuncias');
      
      // Buscar botón de resolver
      const resolveButton = await helpers.waitForElement('.resolve-denuncia, .btn-resolve', 5000);
      if (resolveButton) {
        await resolveButton.click();
        
        // Cambiar estado a resuelto
        try {
          await helpers.clickElement('select[name="estado"]');
          await helpers.clickElement('option[value="resuelto"]');
        } catch (error) {
          // Si no hay select, continuar
        }
        
        // Guardar cambios
        await helpers.clickElement('button[type="submit"]');
        
        // Verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('actualizada');
        expect(hasSuccess).toBe(true);
      } else {
        console.log('No hay denuncias para resolver');
      }
    }, 30000);

    test('Debería eliminar una denuncia', async () => {
      await helpers.navigateTo('/denuncias');
      
      // Buscar botón de eliminar
      const deleteButton = await helpers.waitForElement('.delete-denuncia, .btn-delete', 5000);
      if (deleteButton) {
        await deleteButton.click();
        
        // Confirmar eliminación
        try {
          await helpers.clickElement('.modal .btn-danger, .confirm-delete');
        } catch (error) {
          // Si no hay modal, continuar
        }
        
        // Verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('eliminada');
        expect(hasSuccess).toBe(true);
      } else {
        console.log('No hay denuncias para eliminar');
      }
    }, 30000);
  });

  describe('Dashboard de Administración', () => {
    test('Debería mostrar estadísticas del dashboard', async () => {
      await helpers.navigateTo('/admin');
      
      // Verificar que la página carga
      await helpers.waitForPageLoad();
      
      // Verificar que hay elementos del dashboard
      const hasDashboard = await helpers.elementExists('.dashboard, .stats, .admin-panel');
      expect(hasDashboard).toBe(true);
    }, 30000);

    test('Debería mostrar navegación del panel admin', async () => {
      await helpers.navigateTo('/admin');
      
      // Verificar que hay menú de navegación
      const hasNav = await helpers.elementExists('.admin-nav, .sidebar, .admin-menu');
      expect(hasNav).toBe(true);
    }, 30000);
  });

  describe('Acceso Restringido', () => {
    test('Debería denegar acceso a usuarios no admin', async () => {
      // Logout y login como usuario normal
      await helpers.logout();
      await helpers.login('usuario@test.com', 'password123');
      
      // Intentar acceder a panel admin
      await helpers.navigateTo('/admin');
      
      // Verificar que no puede acceder
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).not.toContain('/admin');
    }, 30000);
  });
}); 