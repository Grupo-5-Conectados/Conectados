# Pruebas de Interfaz con Selenium - Conectados

Este directorio contiene las pruebas de interfaz automatizadas para el proyecto Conectados utilizando Selenium WebDriver.

## 📋 Estructura

```
tests/
├── selenium.config.js      # Configuración de Selenium WebDriver
├── utils/
│   └── testHelpers.js      # Utilidades para pruebas
├── auth.test.js            # Pruebas de autenticación
├── services.test.js        # Pruebas de servicios
├── admin.test.js           # Pruebas de administración
├── run-all-tests.js        # Script principal de ejecución
├── package.json            # Dependencias de pruebas
├── README.md               # Esta documentación
├── reports/                # Reportes HTML generados
└── screenshots/            # Screenshots de pruebas
```

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   cd tests
   npm install
   ```

2. **Verificar Chrome y ChromeDriver:**
   ```bash
   google-chrome --version
   npx chromedriver --version
   ```

## 🧪 Ejecutar Pruebas

### Ejecutar todas las pruebas:
```bash
npm test
# o
node run-all-tests.js
```

### Ejecutar pruebas específicas:
```bash
# Solo autenticación
npm run test:auth

# Solo servicios
npm run test:services

# Solo administración
npm run test:admin
```

### Modo debug:
```bash
npm run test:debug
```

## 📊 Reportes

Las pruebas generan automáticamente:

- **Reporte HTML:** `tests/reports/test-report.html`
- **Screenshots:** `tests/screenshots/` (en caso de fallos)
- **Logs en consola:** Resumen detallado de resultados

## 🔧 Configuración

### Variables de entorno necesarias:
```bash
# Backend
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=conectados
JWT_SECRET=UnaClaveSegura

# Frontend
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_SOCKET_URL=http://localhost:4000
```

### Datos de prueba:
Los tests utilizan los siguientes usuarios de prueba:
- **Admin:** `admin@conectados.com` / `admin123`
- **Usuario:** `usuario@test.com` / `password123`
- **Prestador:** `prestador@test.com` / `password123`

## 🎯 Casos de Prueba

### Autenticación (`auth.test.js`)
- ✅ Registro de nuevos usuarios
- ✅ Login con credenciales válidas
- ✅ Login con credenciales inválidas
- ✅ Logout
- ✅ Validación de campos requeridos
- ✅ Redirección de páginas protegidas

### Servicios (`services.test.js`)
- ✅ Listado público de servicios
- ✅ Búsqueda de servicios
- ✅ Creación de servicios (prestadores)
- ✅ Edición de servicios
- ✅ Eliminación de servicios
- ✅ Detalle de servicios
- ✅ Reserva de servicios

### Administración (`admin.test.js`)
- ✅ Acceso al panel de administración
- ✅ Gestión de usuarios (CRUD)
- ✅ Gestión de denuncias
- ✅ Dashboard de estadísticas
- ✅ Control de acceso por roles

## 🔍 Troubleshooting

### Problemas comunes:

1. **Chrome no inicia:**
   ```bash
   # Verificar que Chrome esté instalado
   google-chrome --version
   
   # En modo headless, agregar argumentos adicionales en selenium.config.js
   '--no-sandbox',
   '--disable-dev-shm-usage'
   ```

2. **Elementos no encontrados:**
   - Verificar que las aplicaciones estén corriendo en los puertos correctos
   - Revisar selectores CSS en `testHelpers.js`
   - Aumentar timeouts en `selenium.config.js`

3. **Pruebas fallan intermitentemente:**
   - Aumentar timeouts de espera
   - Agregar más tiempo entre acciones
   - Verificar conectividad de red

### Debug:
```bash
# Ejecutar en modo visible (no headless)
# Modificar selenium.config.js removiendo '--headless'

# Tomar screenshots manualmente
node -e "
const { createDriver } = require('./selenium.config');
const TestHelpers = require('./utils/testHelpers');

(async () => {
  const driver = await createDriver();
  const helpers = new TestHelpers(driver);
  
  try {
    await helpers.navigateTo('/');
    await helpers.takeScreenshot('debug-home');
  } finally {
    await driver.quit();
  }
})();
"
```

## 📈 Integración CI/CD

Las pruebas están integradas en el pipeline de Jenkins:

1. **Instalación paralela** de dependencias
2. **Verificación** de servicios requeridos
3. **Levantamiento** de aplicaciones
4. **Ejecución** de pruebas Selenium
5. **Generación** de reportes y screenshots
6. **Notificaciones** de resultados

### Artifacts generados:
- `tests/reports/*.html` - Reportes HTML
- `tests/screenshots/*.png` - Screenshots de fallos
- `*.log` - Logs de aplicaciones

## 🤝 Contribución

Para agregar nuevas pruebas:

1. Crear archivo `nuevo-modulo.test.js`
2. Seguir el patrón de los tests existentes
3. Usar `TestHelpers` para operaciones comunes
4. Agregar el test al `run-all-tests.js`
5. Documentar en este README

## 📝 Notas

- Las pruebas se ejecutan en modo headless por defecto
- Timeouts configurados para entornos CI/CD
- Screenshots automáticos en caso de fallos
- Reportes HTML con resumen detallado
- Integración completa con Jenkins pipeline 