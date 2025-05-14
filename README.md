# Proyecto Conectados

Este repositorio contiene dos aplicaciones independientes:

1. **Back-end**: API REST construida con Node.js, Express, Sequelize y MySQL.  
2. **Front-end**: SPA en React que consume la API.

---

## 🔸 1. Back-end (API)

### 1.1 Descripción  
La API expone endpoints para:

- **Autenticación** (`/api/auth`): registro, login, `GET /me`  
- **Usuarios** (`/api/usuarios`): CRUD (admin), perfil propio  
- **Servicios** (`/api/servicios`): CRUD, listado público, detalle  
- **Reservas** (`/api/bookings`): crear, listar, actualizar, eliminar  
- **Denuncias** (`/api/denuncias`): listar, resolver, eliminar (admin)

### 1.2 Tech Stack  
- Node.js + Express  
- Sequelize ORM para MySQL  
- JWT para autenticación  
- bcryptjs para hash de contraseñas  
- dotenv para variables de entorno

### 1.3 Prerrequisitos  
- Node.js ≥14  
- MySQL local o remoto  
- (Opcional) Docker + Docker Compose

### 1.4 Variables de entorno  
Crea un archivo `.env` en la raíz del back con:

```ini
PORT=4000
DB_HOST=localhost
DB_USER=<tu_usuario_mysql>
DB_PASSWORD=<tu_contraseña_mysql>
DB_NAME=<nombre_base_de_datos>
JWT_SECRET=<una_clave_secreta>
```

### 1.5 Instalación y ejecución

```bash
cd backend
npm install
npm start                         # arranca en http://localhost:4000
```
Si no funciona iniciar con npm run dev.

Se debe tener previamente creada la base de datos a usar, es decir se debe tener previamente instalado mysql con datos previos creados en el .env, todavia no configuramos para que funcione en la nube la base de datos las tablas se generan automaticamente despues de iniciar.

### 1.6 Estructura de carpetas

```
backend/
├── config/
│   └── sequelize.js      # configuración Sequelize
├── controllers/
│   ├── authControllers.js
│   ├── usuarioControllers.js
│   ├── servicioController.js
│   ├── bookingController.js
│   └── denunciaController.js
├── middleware/
│   └── authMiddleware.js
├── models/               # definiciones Sequelize
├── routes/
│   ├── authRoutes.js
│   ├── usuarioRoutes.js
│   ├── servicioRoutes.js
│   ├── bookingRoutes.js
│   └── denunciaRoutes.js
├── .env                  # variables de entorno
└── server.js             # punto de entrada
```

### 1.7 Endpoints clave

| Método | Ruta                       | Acceso                   | Descripción                  |
|-------:|----------------------------|--------------------------|------------------------------|
| POST   | `/api/auth/register`       | Público                  | Registrar nuevo usuario      |
| POST   | `/api/auth/login`          | Público                  | Obtener token JWT            |
| GET    | `/api/auth/me`             | Usuario autenticado      | Perfil propio                |
| GET    | `/api/usuarios`            | Admin                    | Listar usuarios              |
| GET    | `/api/usuarios/:id`        | Admin / Propio ID        | Ver datos de un usuario      |
| PUT    | `/api/usuarios/me`         | Usuario autenticado      | Actualizar perfil propio     |
| GET    | `/api/servicios`           | Público                  | Listar servicios             |
| POST   | `/api/servicios`           | Prestador / Admin        | Crear servicio               |
| GET    | `/api/servicios/:id`       | Público                  | Ver detalle de servicio      |
| PATCH  | `/api/bookings/:id`        | Prestador                | Cambiar estado de reserva    |
| POST   | `/api/bookings`            | Usuario                  | Crear reserva                |
| GET    | `/api/denuncias`           | Admin                    | Listar denuncias             |
| PUT    | `/api/denuncias/:id`       | Admin                    | Actualizar estado denuncia   |

---

## 🔸 2. Front-end (React)

### 2.1 Descripción  
SPA en React que permite al usuario:

- Registrarse / Iniciar sesión  
- Ver y buscar servicios  
- Reservar (“Mis Citas”)  
- Publicar / editar servicios (prestadores)
- Eliminar servicio (prestadores)  
- Ver “Mi Agenda” (prestadores)  
- Administrar usuarios y denuncias (admins)  
- Ver perfil propio

### 2.2 Tech Stack  
- React (Create React App)  
- React Router v6  
- Axios para llamadas HTTP  
- SCSS + BEM para estilos  
- JWT en `localStorage` para auth

### 2.3 Variables de entorno  
Crea un archivo `.env` en la raíz del front:

```ini
REACT_APP_API_URL=http://localhost:4000/api
```

### 2.4 Instalación y ejecución

```bash
cd frontend
npm install
npm start       # abre en http://localhost:3000
```

### 2.5 Estructura de carpetas

```
frontend/
├── public/
├── src/
│   ├── components/        # Navbar, PrivateRoute, Formularios…
│   ├── pages/             # Home, LoginPage, RegisterPage, ProfilePage…
│   ├── utils/
│   │   └── api.js         # funciones Axios
│   ├── styles/            # global.scss, index.css
│   └── App.js             # configuración de rutas
└── .env
```

### 2.6 Rutas principales (cliente)

| Ruta                  | Componente                 | Acceso                |
|-----------------------|----------------------------|-----------------------|
| `/`                   | Home                       | Público               |
| `/register`           | RegisterPage               | Público               |
| `/login`              | LoginPage                  | Público               |
| `/perfil`             | ProfilePage                | Usuario / Prestador / Admin |
| `/servicios`          | ServiceListPage            | Público               |
| `/servicios/:id`      | ServiceDetailPage          | Público               |
| `/buscar-servicios`   | SearchServicesPage         | Cliente               |
| `/mis-citas`          | BookingListPage (cliente)  | Cliente               |
| `/agenda`             | BookingListPage (agenda)   | Prestador             |
| `/crear`              | CreateServicePage          | Prestador / Admin     |
| `/editar/:id`         | Editar                     | Prestador / Admin     |
| `/bookings`           | BookingListPage (all)      | Cliente / Prestador   |
| `/gestion-usuarios`   | UserListPage               | Admin                 |
| `/crear-usuario`      | CreateUserPage             | Admin                 |
| `/editar-usuario/:id` | UserEditPage               | Admin                 |
| `/denuncias`          | DenunciasPage              | Admin                 |
| `*`                   | Página 404                 | Público               |

---

## 📖 Notas para el equipo

- **Roles**:  
  - `admin` ve y modifica todo.  
  - `prestador` gestiona sus servicios y reservas.  
  - `usuario` busca y reserva servicios.  
- **Protección de rutas**: `PrivateRoute` valida JWT y rol.  
- **Control de acceso (back)**: middleware `verifyToken` + validaciones en controladores.  
- **Migraciones**: usa Sequelize CLI para mantener esquemas.  
- **Testing**: aunque no implementado aún.


## Integrantes

- Tamara León
- Valentina Lepin   
- Manuel Vargas
- Claudio Villagrán

## Evidencia

Conección Jira con Slack
![SlackJira](https://github.com/user-attachments/assets/9ad6a2f5-807d-41fe-9d6b-d80fcdde4304)

Conección Github con Slack
![SlackGit](https://github.com/user-attachments/assets/2b5d2b6f-c2d1-49d6-a708-886634325d0f)

Utilización de Jira
![Jira](https://github.com/user-attachments/assets/b8c06bcf-8df5-44ce-9b1e-79138100e14d)




