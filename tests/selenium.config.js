const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuración de Selenium WebDriver
const seleniumConfig = {
  // Configuración del navegador Chrome
  chromeOptions: {
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      // '--headless' // Comentado para debug
    ]
  },
  
  // Timeouts
  timeouts: {
    implicit: 10000,    // 10 segundos para encontrar elementos
    pageLoad: 30000,    // 30 segundos para cargar página
    script: 30000       // 30 segundos para ejecutar scripts
  },
  
  // URLs de la aplicación
  urls: {
    base: 'http://localhost:3000',
    api: 'http://localhost:4000/api',
    login: 'http://localhost:3000/login',
    register: 'http://localhost:3000/register',
    home: 'http://localhost:3000/',
    servicios: 'http://localhost:3000/servicios'
  },
  
  // Datos de prueba
  testData: {
    admin: {
      email: 'admin@conectados.com',
      password: 'admin123'
    },
    user: {
      email: 'usuario@test.com',
      password: 'password123'
    },
    prestador: {
      email: 'prestador@test.com',
      password: 'password123'
    }
  },
  
  // Selectores CSS actualizados basados en la estructura real
  selectors: {
    // Login
    emailInput: 'input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="correo"]',
    passwordInput: 'input[type="password"], input[name="password"], input[placeholder*="contraseña"]',
    loginButton: 'button[type="submit"], button:contains("Iniciar sesión"), button:contains("Login"), .btn-primary',
    
    // Registro
    nameInput: 'input[name="nombre"], input[name="name"], input[placeholder*="nombre"]',
    confirmPasswordInput: 'input[name="confirmPassword"], input[name="password_confirmation"]',
    registerButton: 'button[type="submit"], button:contains("Registrarse"), button:contains("Register")',
    
    // Navegación
    loginLink: 'a[href="/login"], a:contains("Iniciar sesión"), a:contains("Login")',
    registerLink: 'a[href="/register"], a:contains("Registrarse"), a:contains("Register")',
    logoutLink: 'a[href="/logout"], button:contains("Cerrar sesión"), button:contains("Logout")',
    
    // Servicios
    serviceCard: '.service-card, .card, .service-item, [class*="service"], [class*="card"]',
    serviceTitle: 'h3, h4, .title, .service-title',
    servicePrice: '.price, .service-price, [class*="price"]',
    
    // Formularios
    submitButton: 'button[type="submit"], .btn-primary, .btn-success',
    cancelButton: '.btn-secondary, .btn-cancel, button:contains("Cancelar")',
    
    // Mensajes
    successMessage: '.alert-success, .success, .message-success, [class*="success"]',
    errorMessage: '.alert-danger, .error, .message-error, [class*="error"], .alert',
    
    // Admin
    adminPanel: '.admin-panel, .dashboard, [class*="admin"], [class*="dashboard"]',
    userTable: '.user-table, table, [class*="table"]',
    denunciasTable: '.denuncias-table, .denuncias-list, [class*="denuncia"]'
  }
};

// Función para crear el driver de Chrome
async function createDriver() {
  const options = new chrome.Options();
  
  // Agregar argumentos de Chrome
  seleniumConfig.chromeOptions.args.forEach(arg => {
    options.addArguments(arg);
  });
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  // Configurar timeouts
  await driver.manage().setTimeouts(seleniumConfig.timeouts);
  
  return driver;
}

module.exports = {
  seleniumConfig,
  createDriver
}; 