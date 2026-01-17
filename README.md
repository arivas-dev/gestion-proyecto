# Sistema de Gestión de Proyectos

Aplicación de gestión de proyectos desarrollada con Laravel y React, que incluye autenticación de usuarios, control de acceso basado en roles, y operaciones CRUD completas para proyectos y tareas.

## Características

- **Autenticación de usuarios**: Registro, inicio de sesión y restablecimiento de contraseña
- **Roles y permisos**: Dos roles (Administrador y Usuario) con acceso diferenciado
- **Gestión de proyectos**: Crear, leer, actualizar y eliminar proyectos
- **Gestión de tareas**: Crear, leer, actualizar y eliminar tareas dentro de proyectos
- **Estados de tareas**: Las tareas pueden estar pendientes, en progreso o completadas
- **API REST**: Endpoints para proyectos y tareas que responden en formato JSON
- **Base de datos Supabase**: Integración con Supabase (PostgreSQL en la nube)
- **Envío de correos Maileroo**: Sistema de envío de correos electrónicos mediante Maileroo

## Requisitos

- PHP >= 8.2
- Composer
- Node.js >= 18.x y npm
- Cuenta de Supabase (para la base de datos)
- Cuenta de Maileroo (para el envío de correos)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd gestion-proyecto
```

### 2. Instalar Dependencias de PHP

```bash
composer install
```

### 3. Instalar Dependencias de Node.js

```bash
npm install
```

### 4. Configurar el Entorno

Crear el archivo `.env` desde el ejemplo:

```bash
cp .env.example .env
```

Configurar la conexión a Supabase en el archivo `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_de_supabase
```

**Nota:** Obtén estos valores desde tu proyecto en Supabase → Settings → Database → Connection string.

Configurar Maileroo para el envío de correos:

```env
MAIL_MAILER=maileroo
MAIL_FROM_ADDRESS=noreply@tudominio.com
MAIL_FROM_NAME="${APP_NAME}"

MAILEROO_API_KEY=tu_api_key_de_maileroo
MAILEROO_API_URL=https://api.maileroo.com
```

**Nota:** Obtén tu API key desde tu cuenta de Maileroo.

Generar la clave de la aplicación:

```bash
php artisan key:generate
```

### 5. Configurar la Base de Datos

La aplicación utiliza Supabase como base de datos PostgreSQL en la nube. Una vez configuradas las credenciales en el archivo `.env`, ejecuta las migraciones:

Ejecutar las migraciones:

```bash
php artisan migrate
```

Poblar la base de datos con roles y usuarios de prueba:

```bash
php artisan db:seed
```

Esto creará:
- Rol de Administrador y Rol de Usuario
- Usuario administrador (email: `admin@example.com`, contraseña: `password`)
- Usuario regular (email: `user@example.com`, contraseña: `password`)

### 6. Compilar los Assets del Frontend (Solo para Producción)

Si vas a ejecutar en modo producción, compila los assets:

```bash
npm run build
```

### 7. Iniciar el Servidor de Desarrollo

Para desarrollo, ejecuta el siguiente comando que iniciará el servidor Laravel y Vite simultáneamente:

```bash
composer run dev
```

Este comando ejecuta:
- Servidor Laravel en `http://localhost:8000`
- Servidor de desarrollo de Vite (hot reload)
- Cola de trabajos de Laravel
- Visualizador de logs en tiempo real

La aplicación estará disponible en `http://localhost:8000`.

## Sistema de Autenticación

La aplicación utiliza el sistema de autenticación integrado de Laravel con autenticación basada en sesiones.

### Registro

Los usuarios pueden registrarse a través de la ruta `/register`. Al registrarse:
- Se crea una nueva cuenta de usuario
- El usuario recibe automáticamente el rol "Usuario"
- El usuario inicia sesión automáticamente

### Inicio de Sesión

Los usuarios pueden iniciar sesión a través de la ruta `/login` usando su correo electrónico y contraseña.

### Restablecimiento de Contraseña

La aplicación incluye un flujo de restablecimiento de contraseña:
1. El usuario solicita el restablecimiento en `/forgot-password`
2. El sistema envía un enlace de restablecimiento al correo del usuario mediante Maileroo
3. El usuario hace clic en el enlace y establece una nueva contraseña en `/reset-password/{token}`

**Nota:** El envío de correos está configurado con Maileroo. Asegúrate de tener configurada tu API key de Maileroo en el archivo `.env`.

## Roles y Permisos

La aplicación implementa un sistema de control de acceso basado en roles.

### Roles Disponibles

- **Administrador**: Acceso completo al sistema, incluyendo acceso a la ruta `/admin`
- **Usuario**: Acceso estándar a proyectos y tareas

### Acceso de Administrador

La ruta `/admin` está protegida por el middleware `EnsureUserIsAdmin`, que:
- Verifica que el usuario esté autenticado
- Verifica que el usuario tenga el rol "admin"
- Retorna error 403 si el acceso es denegado

## Modelo de Datos

### Relación entre Proyectos y Tareas

La aplicación implementa una relación **uno-a-muchos** entre Proyectos y Tareas:
- Un proyecto puede tener múltiples tareas
- Cada tarea pertenece a un solo proyecto

### Estados de Tareas

Las tareas pueden tener tres estados:
- `pending`: Pendiente
- `in_progress`: En progreso
- `completed`: Completada

## API REST

La API está disponible en `/api` y requiere autenticación mediante token. La API es completamente independiente de la interfaz web.

### URL Base

```
http://localhost:8000/api
```

### Autenticación

Todos los endpoints de la API requieren autenticación mediante token. La API no depende de la sesión web.

#### 1. Obtener Token de Acceso

Haz una petición POST a `/api/login` con tus credenciales:

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

**Respuesta exitosa (200 OK):**
```json
{
  "token": "tu_token_de_acceso_aqui",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

#### 2. Usar el Token en las Peticiones

Incluye el token en el header `Authorization` con el prefijo `Bearer`:

```bash
curl -X GET http://localhost:8000/api/projects \
  -H "Accept: application/json" \
  -H "Authorization: Bearer tu_token_de_acceso_aqui"
```

**Alternativa:** También puedes usar el header `X-API-TOKEN`:

```bash
curl -X GET http://localhost:8000/api/projects \
  -H "Accept: application/json" \
  -H "X-API-TOKEN: tu_token_de_acceso_aqui"
```

#### 3. Cerrar Sesión (Invalidar Token)

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer tu_token_de_acceso_aqui"
```

**Nota:** Al cerrar sesión, el token se invalida y ya no podrá ser usado.

### Endpoints de Proyectos

### Endpoints de Autenticación

#### Login

**POST** `/api/login`

Autentica un usuario y devuelve un token de acceso.

**Cuerpo de la Solicitud:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Respuesta (200 OK):**
```json
{
  "token": "abc123def456...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

#### Logout

**POST** `/api/logout`

Invalida el token de acceso del usuario autenticado.

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

**Respuesta (200 OK):**
```json
{
  "message": "Logged out successfully."
}
```

### Projects Endpoints

#### Listar Todos los Proyectos

**GET** `/api/projects`

Retorna todos los proyectos del usuario autenticado.

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Nombre del Proyecto",
      "description": "Descripción del proyecto",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "user": {
        "id": 1,
        "name": "Nombre del Usuario",
        "email": "usuario@example.com"
      },
      "tasks": []
    }
  ]
}
```

#### Crear Proyecto

**POST** `/api/projects`

**Cuerpo de la Solicitud:**
```json
{
  "name": "Nuevo Proyecto",
  "description": "Descripción del proyecto"
}
```

**Respuesta (201 Created):**
```json
{
  "data": {
    "id": 1,
    "name": "Nuevo Proyecto",
    "description": "Descripción del proyecto",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "user": {...},
    "tasks": []
  },
  "message": "Proyecto creado exitosamente"
}
```

#### Obtener Proyecto

**GET** `/api/projects/{id}`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

Retorna los detalles de un proyecto específico.

#### Actualizar Proyecto

**PUT/PATCH** `/api/projects/{id}`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

**Cuerpo de la Solicitud:**
```json
{
  "name": "Nombre Actualizado",
  "description": "Descripción actualizada"
}
```

#### Eliminar Proyecto

**DELETE** `/api/projects/{id}`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

Elimina un proyecto específico.

### Endpoints de Tareas

#### Listar Tareas de un Proyecto

**GET** `/api/projects/{projectId}/tasks`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

Retorna todas las tareas de un proyecto específico.

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Título de la Tarea",
      "description": "Descripción de la tarea",
      "status": "pending",
      "project_id": 1,
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "user": {
        "id": 1,
        "name": "Nombre del Usuario",
        "email": "usuario@example.com"
      }
    }
  ]
}
```

#### Crear Tarea

**POST** `/api/projects/{projectId}/tasks`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

**Cuerpo de la Solicitud:**
```json
{
  "title": "Nueva Tarea",
  "description": "Descripción de la tarea",
  "status": "pending"
}
```

**Valores de estado:** `pending`, `in_progress`, `completed`

**Respuesta (201 Created):**
```json
{
  "data": {
    "id": 1,
    "title": "Nueva Tarea",
    "description": "Descripción de la tarea",
    "status": "pending",
    "project_id": 1,
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "user": {...},
    "project": {...}
  },
  "message": "Tarea creada exitosamente"
}
```

#### Obtener Tarea

**GET** `/api/projects/{projectId}/tasks/{taskId}`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

Retorna los detalles de una tarea específica.

#### Actualizar Tarea

**PUT/PATCH** `/api/projects/{projectId}/tasks/{taskId}`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

**Cuerpo de la Solicitud:**
```json
{
  "title": "Título Actualizado",
  "description": "Descripción actualizada",
  "status": "in_progress"
}
```

#### Eliminar Tarea

**DELETE** `/api/projects/{projectId}/tasks/{taskId}`

**Headers requeridos:**
- `Authorization: Bearer TOKEN` o `X-API-TOKEN: TOKEN`

Elimina una tarea específica.

### Códigos de Estado HTTP

- `200 OK`: Solicitudes GET, PUT, PATCH, DELETE exitosas
- `201 Created`: Solicitudes POST exitosas
- `403 Forbidden`: Intento de acceso no autorizado
- `422 Unprocessable Entity`: Errores de validación
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── ProjectController.php
│   │   │   └── TaskController.php
│   │   ├── Auth/
│   │   │   ├── LoginController.php
│   │   │   ├── RegisterController.php
│   │   │   └── PasswordResetController.php
│   │   ├── AdminController.php
│   │   ├── ProjectController.php
│   │   └── TaskController.php
│   └── Middleware/
│       └── EnsureUserIsAdmin.php
├── Models/
│   ├── Project.php
│   ├── Role.php
│   ├── Task.php
│   └── User.php
└── Policies/
    ├── ProjectPolicy.php
    └── TaskPolicy.php

database/
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 2026_01_16_040700_create_roles_table.php
│   ├── 2026_01_16_040701_create_role_user_table.php
│   ├── 2026_01_16_040702_create_projects_table.php
│   └── 2026_01_16_040702_create_tasks_table.php
└── seeders/
    ├── DatabaseSeeder.php
    └── RoleSeeder.php

routes/
├── api.php
└── web.php
```

## Uso de la Plataforma

### Para Usuarios Regulares

1. **Registro e Inicio de Sesión**: Crea una cuenta o inicia sesión con tus credenciales
2. **Crear Proyectos**: Accede a "Proyectos" y crea nuevos proyectos
3. **Gestionar Tareas**: Dentro de cada proyecto, puedes crear, editar y eliminar tareas
4. **Cambiar Estados**: Actualiza el estado de las tareas (pendiente, en progreso, completada)

### Para Administradores

1. **Panel de Administración**: Accede a `/admin` para ver estadísticas del sistema
2. **Gestión Completa**: Los administradores tienen acceso completo a todos los proyectos y tareas
3. **Gestión de Usuarios**: Pueden gestionar usuarios del sistema desde el panel de administración