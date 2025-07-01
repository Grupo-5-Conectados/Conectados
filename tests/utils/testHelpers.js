const { By, until } = require('selenium-webdriver');
const { seleniumConfig } = require('../selenium.config');

// Utilidades para pruebas de Selenium
class TestHelpers {
  constructor(driver) {
    this.driver = driver;
  }

  // Función para encontrar elemento con múltiples selectores
  async findElementWithMultipleSelectors(selectors, timeout = 10000) {
    const selectorArray = selectors.split(', ');
    
    for (const selector of selectorArray) {
      try {
        const element = await this.driver.wait(until.elementLocated(By.css(selector)), 2000);
        return element;
      } catch (error) {
        // Continuar con el siguiente selector
        continue;
      }
    }
    
    throw new Error(`No se encontró elemento con ninguno de los selectores: ${selectors}`);
  }

  // Esperar a que un elemento sea visible
  async waitForElement(selector, timeout = 10000) {
    try {
      // Si es un selector múltiple, usar la función especializada
      if (selector.includes(', ')) {
        return await this.findElementWithMultipleSelectors(selector, timeout);
      }
      
      await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
      return await this.driver.findElement(By.css(selector));
    } catch (error) {
      throw new Error(`Elemento no encontrado: ${selector}`);
    }
  }

  // Esperar a que un elemento sea clickeable
  async waitForClickable(selector, timeout = 10000) {
    try {
      const element = await this.waitForElement(selector, timeout);
      await this.driver.wait(until.elementIsEnabled(element), timeout);
      return element;
    } catch (error) {
      throw new Error(`Elemento no clickeable: ${selector}`);
    }
  }

  // Hacer click en un elemento
  async clickElement(selector) {
    const element = await this.waitForClickable(selector);
    await element.click();
  }

  // Escribir texto en un campo
  async typeText(selector, text) {
    const element = await this.waitForElement(selector);
    await element.clear();
    await element.sendKeys(text);
  }

  // Obtener texto de un elemento
  async getText(selector) {
    const element = await this.waitForElement(selector);
    return await element.getText();
  }

  // Verificar si un elemento existe
  async elementExists(selector) {
    try {
      await this.waitForElement(selector, 3000);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Esperar a que la URL cambie
  async waitForUrlChange(expectedUrl, timeout = 10000) {
    await this.driver.wait(async () => {
      const currentUrl = await this.driver.getCurrentUrl();
      return currentUrl.includes(expectedUrl);
    }, timeout);
  }

  // Tomar screenshot
  async takeScreenshot(filename) {
    const screenshot = await this.driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    const screenshotsDir = path.join(__dirname, '../screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(screenshotsDir, `${filename}.png`), screenshot, 'base64');
  }

  // Login helper mejorado
  async login(email, password) {
    await this.driver.get('http://localhost:3000/login');
    
    // Usar selectores flexibles
    await this.typeText(seleniumConfig.selectors.emailInput, email);
    await this.typeText(seleniumConfig.selectors.passwordInput, password);
    await this.clickElement(seleniumConfig.selectors.loginButton);
    
    // Esperar a que redirija después del login
    try {
      await this.waitForUrlChange('/perfil', 10000);
    } catch (error) {
      // Si no redirige a perfil, verificar si está en otra página
      const currentUrl = await this.driver.getCurrentUrl();
      if (currentUrl.includes('/login')) {
        throw new Error('Login falló - aún en página de login');
      }
    }
  }

  // Logout helper mejorado
  async logout() {
    try {
      // Buscar botón de logout en navbar
      await this.clickElement(seleniumConfig.selectors.logoutLink);
    } catch (error) {
      // Si no hay botón de logout, ir directamente a la URL
      await this.driver.get('http://localhost:3000/logout');
    }
  }

  // Verificar mensaje de error mejorado
  async checkErrorMessage(expectedMessage) {
    try {
      const errorElement = await this.waitForElement(seleniumConfig.selectors.errorMessage, 5000);
      const errorText = await errorElement.getText();
      return errorText.toLowerCase().includes(expectedMessage.toLowerCase());
    } catch (error) {
      return false;
    }
  }

  // Verificar mensaje de éxito mejorado
  async checkSuccessMessage(expectedMessage) {
    try {
      const successElement = await this.waitForElement(seleniumConfig.selectors.successMessage, 5000);
      const successText = await successElement.getText();
      return successText.toLowerCase().includes(expectedMessage.toLowerCase());
    } catch (error) {
      return false;
    }
  }

  // Navegar a una página
  async navigateTo(path) {
    await this.driver.get(`http://localhost:3000${path}`);
  }

  // Esperar a que la página cargue completamente
  async waitForPageLoad() {
    await this.driver.wait(until.titleIs(await this.driver.getTitle()), 10000);
  }

  // Función para buscar elementos por texto
  async findElementByText(text, tagName = '*') {
    try {
      const element = await this.driver.findElement(
        By.xpath(`//${tagName}[contains(text(), '${text}')]`)
      );
      return element;
    } catch (error) {
      throw new Error(`Elemento con texto "${text}" no encontrado`);
    }
  }

  // Función para hacer click en elemento por texto
  async clickElementByText(text, tagName = 'button') {
    const element = await this.findElementByText(text, tagName);
    await element.click();
  }

  // Función para verificar si estamos en una página específica
  async isOnPage(pagePath) {
    const currentUrl = await this.driver.getCurrentUrl();
    return currentUrl.includes(pagePath);
  }

  // Función para esperar y verificar que un elemento contenga texto específico
  async waitForElementWithText(selector, expectedText, timeout = 10000) {
    await this.driver.wait(async () => {
      try {
        const element = await this.waitForElement(selector, 2000);
        const text = await element.getText();
        return text.includes(expectedText);
      } catch (error) {
        return false;
      }
    }, timeout);
  }
}

module.exports = TestHelpers; 