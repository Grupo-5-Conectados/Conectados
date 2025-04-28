
# 📚 Conectados – Proyecto Full Stack

**Conectados** es una aplicación web que conecta usuarios con proveedores de servicios en distintas áreas.  
Permite a los usuarios registrarse, buscar servicios y agendar citas, mientras que los proveedores pueden publicar sus servicios y administrar su agenda.

El proyecto consta de:

- **Frontend** desarrollado en **React.js**.
- **Backend** construido con **Node.js**, **Express**, **Sequelize** y **MySQL**.

Actualmente, está configurado para funcionar **localmente**.

---

# 🛠️ Tecnologías usadas

| Área        | Herramientas            |
|-------------|--------------------------|
| Frontend    | React.js, React Router, Axios |
| Backend     | Node.js, Express.js, Sequelize |
| Base de datos | MySQL |
| Autenticación | JWT (Json Web Tokens), Bcrypt |
| Desarrollo local | Nodemon |

---

# 📦 Requerimientos

Antes de empezar asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [MySQL Server](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

---

# 🚀 Instalación y ejecución local

## 1. Clona el repositorio
```bash
git clone https://github.com/tu_usuario/conectados.git
```

## 2. Configuración del Backend

### 📂 Entra al backend
```bash
cd conectados-backend
```

### 📦 Instala las dependencias
```bash
npm install
```

### 🛠️ Configura las variables de entorno

Crea un archivo llamado `.env` en `conectados-backend/` con el siguiente contenido:

```env
PORT=4000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=conectados
JWT_SECRET=UnaClaveMuySegura
```

> 📌 *Asegúrate de crear previamente la base de datos `conectados` en MySQL.*

### 🏗️ Inicia el servidor backend

```bash
npm run dev
```

Deberías ver algo como:

```
Servidor backend corriendo en http://localhost:4000
✅ Tablas sincronizadas en la BD
```

---

## 3. Configuración del Frontend

### 📂 Entra al frontend
```bash
cd conectados-frontend
```

### 📦 Instala las dependencias
```bash
npm install
```

### 🔧 Ajusta el archivo de conexión API

Edita el archivo `src/services/api.js` y asegúrate de apuntar a tu backend local:

```javascript
const API_URL = "http://localhost:4000/api"; 
export default API_URL;
```

### 🏃‍♂️ Inicia el servidor frontend

```bash
npm run dev
```

(En algunos casos puede ser `npm start` dependiendo cómo esté configurado)

El frontend debería abrirse automáticamente en tu navegador en:
```
http://localhost:3000
```

---

# 🔐 Funcionalidades principales

- Registro de usuarios (cliente o proveedor)
- Login con autenticación JWT
- Publicación de servicios por parte de proveedores
- Visualización de servicios públicos
- Navegación segura basada en roles (Admin, Profesional, Cliente)

---

# 📚 Estructura del proyecto

```
conectados-backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── server.js
└── .env

conectados-frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── styles/
│   └── App.js
└── public/
```

---

# ⚠️ Consideraciones

- La sincronización automática de tablas (`sequelize.sync()`) está activada solo en entorno de desarrollo.
- No subir `.env` ni archivos sensibles a GitHub.
- Para producción se recomienda usar Azure, Vercel, Railway o servicios equivalentes.

---

# 🤝 Contribuciones

Toda mejora o sugerencia es bienvenida.  
Por favor realiza un Fork del proyecto, crea una rama con tu mejora, y haz un Pull Request.

---

# Integrantes

- Tamara León
- Valentina Lepin   
- Manuel Vargas
- Claudio Villagrán
---

# 🎯 Estado del proyecto

✅ Backend funcional localmente  
✅ Frontend conectado al backend  
⬜ Próxima etapa: **Despliegue en Azure (VM + Web App)**

---
