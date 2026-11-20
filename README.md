# BibliotecaTS

**Dominio:** C — Biblioteca
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** Carpeta por tipo de archivo

## Integrantes
- Bogado, Augusto — [LLLozer](https://github.com/LLLozer)
- Rossi, Fabiana — [caramelin-n](https://github.com/caramelin-n)
- Escalante, Facundo — [hearty22](https://github.com/hearty22)

## Descripción
BibliotecaTS es una aplicación para gestionar los libros de una biblioteca. Cada libro tiene un estado (`DISPONIBLE`, `PRESTADO` o `EN_REPARACION`). Los usuarios pueden suscribirse a un libro y, cada vez que su estado cambia, todos los suscriptores reciben una notificación en la aplicación y en la consola del backend. El acceso a cada acción se controla con roles y permisos.

## Requisitos previos
- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local) Node.js 24 y pnpm

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/caramelin-n/Actividad-pr-ctica-integrador.git
   cd Actividad-pr-ctica-integrador
   ```
2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Levantar los servicios:
   ```bash
   docker compose up --build
   ```
4. El seed de roles, permisos, usuarios de prueba y libros de ejemplo se ejecuta automáticamente al iniciar el backend. No hace falta ningún paso extra.
5. Abrir la aplicación:
   - Frontend: http://localhost:8080
   - API: http://localhost:3000/api

## Ejecución sin Docker (opcional)

### Backend
Requiere una base PostgreSQL accesible. Se puede levantar solo la base con `docker compose up database`.

```bash
cd backend
npm install
```

Exportar las variables de entorno (o copiar el `.env` dentro de `backend/`) con `DB_HOST=localhost`, y luego:

```bash
npm run dev
```

Para compilar y ejecutar la versión de producción:

```bash
npm run build
npm start
```

### Frontend
Con el backend corriendo en `http://localhost:3000`:

```bash
cd frontend
pnpm install
pnpm dev
```

Vite levanta el frontend en http://localhost:5173 y usa `VITE_API_URL` (por defecto `http://localhost:3000/api`).

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `POSTGRES_USER` | Usuario de la base de datos | `admin123` |
| `POSTGRES_PASSWORD` | Contraseña de la base de datos | `everdaquetuaguantaesto` |
| `POSTGRES_DB` | Nombre de la base | `tpintergrador` |
| `DB_HOST` | Host de la base de datos | `database` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `JWT_SECRET` | Clave para firmar los tokens | `mi_super_clave_secreta` |
| `API_PORT` | Puerto del backend | `3000` |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@tp.com | admin123 |
| operador | operador@tp.com | operador123 |
| usuario | usuario@tp.com | usuario123 |

Todo usuario nuevo que se registra recibe el rol `usuario`.

## Autenticación

`POST /api/auth/login` devuelve el token JWT en el cuerpo de la respuesta (`token`) y además lo guarda en una cookie `httpOnly` llamada `token`. Las rutas protegidas aceptan cualquiera de las dos formas:

```
Authorization: Bearer <token>
```

El token vence a la hora.

## Cómo probar el flujo de notificaciones
1. Ingresar como `usuario` en http://localhost:8080, entrar a un libro y presionar **Suscribirse**.
2. En otra ventana (o en incógnito), ingresar como `operador`, entrar al mismo libro y cambiar su estado con el selector **Cambiar estado**.
3. Volver a la sesión de `usuario`: en menos de 10 segundos la campana de la barra superior muestra el contador de no leídas, y la notificación aparece en **Notificaciones**, donde se puede marcar como leída.
4. Verificar la notificación en la consola del backend:
   ```bash
   docker compose logs backend
   ```
   ```
   [NOTIFICACIÓN] Para: usuario@tp.com | Libro #1 | Estado: DISPONIBLE → PRESTADO
   ```

## Endpoints principales

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| POST | /api/auth/logout | — |
| GET | /api/auth/me | autenticado |
| GET | /api/libros | libro:read |
| GET | /api/libros/:id | libro:read |
| POST | /api/libros | libro:create |
| PUT | /api/libros/:id | libro:update |
| PATCH | /api/libros/:id/state | libro:change-status |
| DELETE | /api/libros/:id | libro:delete |
| GET | /api/subscriptions | libro:read |
| POST | /api/subscriptions | subscription:create |
| DELETE | /api/subscriptions/:libroId | subscription:delete |
| GET | /api/notifications | notification:read |
| GET | /api/notifications/unread-count | notification:read |
| PATCH | /api/notifications/:id/read | notification:read |
| PATCH | /api/notifications/read-all | notification:read |
| GET | /api/users | user:read |
| PATCH | /api/users/:id/role | user:assign-role |
| GET | /api/health | — |

Un endpoint invocado sin el permiso correspondiente responde `403`, y sin sesión responde `401`.

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
