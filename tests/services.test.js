const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');

describe('Pruebas de Servicios', () => {
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
  });

  describe('Listado de Servicios', () => {
    test('Debería mostrar la lista de servicios públicamente', async () => {
      await helpers.navigateTo('/servicios');
      
      // Verificar que la página carga
      await helpers.waitForPageLoad();
      
      // Verificar que hay elementos de servicios (cards, listas, etc.)
      const hasServices = await helpers.elementExists('.service-card, .card, .service-item');
      expect(hasServices).toBe(true);
    }, 30000);

    test('Debería permitir buscar servicios', async () => {
      await helpers.navigateTo('/buscar-servicios');
      
      // Verificar que hay un campo de búsqueda
      const hasSearchInput = await helpers.elementExists('input[type="search"], input[placeholder*="buscar"]');
      expect(hasSearchInput).toBe(true);
      
      // Realizar búsqueda
      await helpers.typeText('input[type="search"], input[placeholder*="buscar"]', 'test');
      await helpers.clickElement('button[type="submit"], .search-button');
      
      // Verificar que se muestran resultados
      await helpers.waitForElement('.service-card, .card, .service-item', 10000);
    }, 30000);
  });

  describe('Crear Servicio (Prestador)', () => {
    beforeEach(async () => {
      // Login como prestador
      await helpers.login('prestador@test.com', 'password123');
    });

    test('Debería crear un nuevo servicio exitosamente', async () => {
      await helpers.navigateTo('/crear');
      
      // Llenar formulario de servicio
      await helpers.typeText('input[name="titulo"]', 'Servicio de Prueba');
      await helpers.typeText('textarea[name="descripcion"]', 'Descripción del servicio de prueba');
      await helpers.typeText('input[name="precio"]', '50');
      await helpers.typeText('input[name="categoria"]', 'Tecnología');
      
      // Enviar formulario
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar mensaje de éxito o redirección
      try {
        await helpers.waitForUrlChange('/servicios', 5000);
        console.log('Servicio creado exitosamente');
      } catch (error) {
        const hasSuccess = await helpers.checkSuccessMessage('creado');
        expect(hasSuccess).toBe(true);
      }
    }, 30000);

    test('Debería validar campos requeridos al crear servicio', async () => {
      await helpers.navigateTo('/crear');
      
      // Intentar enviar formulario vacío
      await helpers.clickElement('button[type="submit"]');
      
      // Verificar que no se envía el formulario
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/crear');
    }, 30000);
  });

  describe('Editar Servicio', () => {
    beforeEach(async () => {
      await helpers.login('prestador@test.com', 'password123');
    });

    test('Debería editar un servicio existente', async () => {
      // Primero ir a la lista de servicios del prestador
      await helpers.navigateTo('/mis-servicios');
      
      // Buscar un servicio para editar
      const editButton = await helpers.waitForElement('.edit-service, .btn-edit', 5000);
      if (editButton) {
        await editButton.click();
        
        // Modificar el título
        await helpers.typeText('input[name="titulo"]', ' - Editado');
        
        // Guardar cambios
        await helpers.clickElement('button[type="submit"]');
        
        // Verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('actualizado');
        expect(hasSuccess).toBe(true);
      } else {
        console.log('No hay servicios para editar');
      }
    }, 30000);
  });

  describe('Eliminar Servicio', () => {
    beforeEach(async () => {
      await helpers.login('prestador@test.com', 'password123');
    });

    test('Debería eliminar un servicio', async () => {
      await helpers.navigateTo('/mis-servicios');
      
      // Buscar botón de eliminar
      const deleteButton = await helpers.waitForElement('.delete-service, .btn-delete', 5000);
      if (deleteButton) {
        await deleteButton.click();
        
        // Confirmar eliminación (si hay modal)
        try {
          await helpers.clickElement('.modal .btn-danger, .confirm-delete');
        } catch (error) {
          // Si no hay modal, continuar
        }
        
        // Verificar mensaje de éxito
        const hasSuccess = await helpers.checkSuccessMessage('eliminado');
        expect(hasSuccess).toBe(true);
      } else {
        console.log('No hay servicios para eliminar');
      }
    }, 30000);
  });

  describe('Detalle de Servicio', () => {
    test('Debería mostrar detalles de un servicio', async () => {
      await helpers.navigateTo('/servicios');
      
      // Hacer click en el primer servicio
      const firstService = await helpers.waitForElement('.service-card, .card, .service-item');
      await firstService.click();
      
      // Verificar que estamos en la página de detalle
      await helpers.waitForUrlChange('/servicios/', 5000);
      
      // Verificar que se muestran los detalles
      const hasDetails = await helpers.elementExists('.service-details, .service-info');
      expect(hasDetails).toBe(true);
    }, 30000);
  });

  describe('Reservar Servicio', () => {
    beforeEach(async () => {
      await helpers.login('usuario@test.com', 'password123');
    });

    test('Debería permitir reservar un servicio', async () => {
      await helpers.navigateTo('/servicios');
      
      // Hacer click en un servicio
      const firstService = await helpers.waitForElement('.service-card, .card, .service-item');
      await firstService.click();
      
      // Buscar botón de reservar
      const bookButton = await helpers.waitForElement('.book-service, .btn-book, .reservar');
      await bookButton.click();
      
      // Llenar formulario de reserva si existe
      try {
        await helpers.typeText('input[name="fecha"]', '2024-12-25');
        await helpers.typeText('input[name="hora"]', '14:00');
        await helpers.typeText('textarea[name="comentarios"]', 'Comentarios de prueba');
      } catch (error) {
        // Si no hay formulario, continuar
      }
      
      // Confirmar reserva
      await helpers.clickElement('button[type="submit"], .confirm-booking');
      
      // Verificar mensaje de éxito
      const hasSuccess = await helpers.checkSuccessMessage('reservado');
      expect(hasSuccess).toBe(true);
    }, 30000);
  });
}); 