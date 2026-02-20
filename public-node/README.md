# 📚 Servicio de Publicaciones - Public Node

## 🎯 Descripción

Microservicio para gestionar publicaciones en Gestify. Permite crear, listar, obtener, editar y eliminar publicaciones. Está integrado con `auth-node` para autenticación.

---

## 📁 Estructura de Carpetas

```
public-node/
├── src/
│   └── publications/
│       ├── publication.model.js       # Modelo Sequelize
│       ├── publication.controller.js  # Lógica de negocios
│       └── publication.routes.js      # Endpoints REST
├── helpers/
│   ├── publication-db.js              # Operaciones con BD
│   └── uuid-generator.js              # Generador de IDs únicos
├── middlewares/
│   ├── server-genericError-handler.js # Manejo centralizado de errores
│   └── validate-JWT.js                # Validación de tokens JWT
├── utils/
│   └── publication-helpers.js         # Funciones auxiliares
├── configs/
│   ├── app.js                         # Configuración Express
│   ├── db.js                          # Conexión PostgreSQL
│   ├── cors.configuration.js          # CORS settings
│   └── helmet-configurations.js       # Seguridad HTTP
├── index.js                           # Punto de entrada
└── package.json
```

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd public-node
pnpm install
```

### 2. Variables de entorno (`.env`)
```env
NODE_ENV=development
PORT=4000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestify
DB_USER=postgres
DB_PASSWORD=your_password

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT (desde auth-node)
JWT_SECRET=your_secret_key
```

### 3. Ejecutar servidor
```bash
# Desarrollo (con hot reload)
pnpm run dev

# Producción
pnpm start
```

El servidor escuchará en `http://localhost:4000`

---

## 📡 Endpoints API

### 1️⃣ Crear Publicación
```
POST /api/v1/publications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mi Primera Publicación",
  "category": "Tecnología",
  "text": "Este es el contenido de mi publicación..."
}
```

**Respuesta (201)**:
```json
{
  "success": true,
  "message": "Publicación creada exitosamente.",
  "data": {
    "id": "pub_ABC123XYZ456",
    "title": "Mi Primera Publicación",
    "category": "Tecnología",
    "text": "Este es el contenido...",
    "author": {
      "id": "usr_DEF789",
      "name": "Juan",
      "surname": "Pérez",
      "username": "juanperez"
    },
    "createdAt": "2026-02-20T10:30:00Z",
    "updatedAt": "2026-02-20T10:30:00Z"
  }
}
```

---

### 2️⃣ Listar Todas las Publicaciones
```
GET /api/v1/publications
```

**Respuesta (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "pub_ABC123XYZ456",
      "title": "Mi Primera Publicación",
      "category": "Tecnología",
      "text": "...",
      "author": {...},
      "createdAt": "2026-02-20T10:30:00Z",
      "updatedAt": "2026-02-20T10:30:00Z"
    }
  ]
}
```

---

### 3️⃣ Obtener Publicación por ID
```
GET /api/v1/publications/:publicationId
```

**Parámetros**: `publicationId` (ej: pub_ABC123XYZ456)

**Respuesta (200)**:
```json
{
  "success": true,
  "data": {...}
}
```

**Error (404)**: Publicación no encontrada

---

### 4️⃣ Obtener Publicaciones por Autor
```
GET /api/v1/publications/author/:authorId
```

**Parámetros**: `authorId` (ID del usuario)

**Respuesta (200)**: Array de publicaciones del autor

---

### 5️⃣ Editar Publicación
```
PUT /api/v1/publications/:publicationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nuevo título",
  "category": "Negocios",
  "text": "Contenido actualizado..."
}
```

**Restricción**: Solo el autor puede editar

**Respuesta (200)**:
```json
{
  "success": true,
  "message": "Publicación actualizada exitosamente.",
  "data": {...}
}
```

**Error (403)**: No eres el autor
**Error (404)**: Publicación no encontrada

---

### 6️⃣ Eliminar Publicación
```
DELETE /api/v1/publications/:publicationId
Authorization: Bearer <token>
```

**Restricción**: Solo el autor puede eliminar

**Respuesta (200)**:
```json
{
  "success": true,
  "message": "Publicación eliminada exitosamente."
}
```

**Error (403)**: No eres el autor
**Error (404)**: Publicación no encontrada

---

## ✅ Validaciones

### Campos Requeridos
| Campo | Min | Max | Tipo | Ejemplo |
|-------|-----|-----|------|---------|
| `title` | 3 | 200 | String | "Introducción a Node.js" |
| `category` | - | - | Enum | "Tecnología" |
| `text` | 10 | 10000 | String | "Contenido largo..." |

### Categorías Permitidas
- ✅ Tecnología
- ✅ Negocios
- ✅ Educación
- ✅ Salud
- ✅ Lifestyle
- ✅ Otro

### Mensajes de Error
```javascript
// Título vacío o muy corto
"El título debe tener entre 3 y 200 caracteres."

// Categoría inválida
"Categoría debe ser una de: Tecnología, Negocios, Educación, Salud, Lifestyle, Otro"

// Contenido insuficiente
"El contenido debe tener entre 10 y 10000 caracteres."

// No autorizado
"Solo el autor puede editar/eliminar esta publicación."
```

---

## 🔐 Seguridad y Autenticación

### Flujo de Autenticación
1. Usuario se registra en `auth-node`
2. Recibe un JWT token
3. Envía el token en header `Authorization: Bearer <token>`
4. `public-node` valida el token
5. Si es válido, extrae `userId` del token

### Headers Requeridos
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Control de Acceso
| Operación | Requerido | Solo Autor |
|-----------|-----------|-----------|
| Crear | ✅ JWT | - |
| Listar | ❌ | - |
| Obtener por ID | ❌ | - |
| Obtener por Autor | ❌ | - |
| Editar | ✅ JWT | ✅ |
| Eliminar | ✅ JWT | ✅ |

---

## 🔌 Integración con Auth-Node

### Configuración
`public-node` obtiene los usuarios desde la BD compartida con `auth-node`:

```javascript
// En publication.model.js
AuthorId: {
  type: DataTypes.STRING(16),
  references: {
    model: 'users',  // Tabla de auth-node
    key: 'id',
  },
}
```

### Validación de Token
El middleware `validateJWT` verifica tokens JWT:

```javascript
// Request
Authorization: Bearer <token>

// Resultado
req.userId = "usr_ABC123XYZ"  // Extraído del token
```

---

## 📊 Estructura de Datos en BD

### Tabla: publications
```sql
CREATE TABLE publications (
  id VARCHAR(16) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  author_id VARCHAR(16) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_publications_author_id ON publications(author_id);
CREATE INDEX idx_publications_created_at ON publications(created_at DESC);
```

---

## 🛠️ Explicación de Componentes

### 📄 publication.model.js
Define la estructura de la tabla usando Sequelize ORM:
- Define columnas, tipos y restricciones
- Validaciones de datos (longitud, formato, etc.)
- Relaciones con otras tablas

### 🎮 publication.controller.js
Contiene la lógica de negocios:
- Valida el JWT (si es necesario)
- Valida los parámetros y datos de entrada
- Verifica permisos (¿eres el autor?)
- Llama a funciones de BD
- Devuelve respuestas formateadas

### 🔗 publication.routes.js
Mapea rutas HTTP a controladores:
```javascript
POST   /publications              → createNewPublication
GET    /publications              → getAllPublications
GET    /publications/:id          → getPublicationById
GET    /publications/author/:id   → getPublicationsByAuthor
PUT    /publications/:id          → editPublication
DELETE /publications/:id          → deletePublication
```

### 💾 publication-db.js
Funciones que interactúan con PostgreSQL:
- `createPublication()` - Inserta nueva publicación
- `getAllPublications()` - Obtiene todas ordenadas
- `getPublicationById()` - Busca por ID específico
- `updatePublication()` - Actualiza campos
- `deletePublication()` - Elimina publicación

### 🎨 publication-helpers.js
Funciones auxiliares:
- `buildPublicationResponse()` - Formatea respuesta
- `validatePublicationInput()` - Valida datos de entrada

---

## 🐛 Debugging y Logs

### Activar logs detallados
```env
NODE_ENV=development
```

Mostrará:
- Queries SQL
- Requests HTTP
- Errores con stack trace

---

## 📈 Ejemplo de Uso Completo

### Paso 1: Registrarse (en auth-node)
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "surname": "Pérez",
    "username": "juanperez",
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

Respuesta:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Paso 2: Crear una publicación
```bash
curl -X POST http://localhost:4000/api/v1/publications \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introducción a Node.js",
    "category": "Tecnología",
    "text": "Node.js permite ejecutar JavaScript en el servidor. Es muy popular para crear APIs REST..."
  }'
```

### Paso 3: Listar publicaciones
```bash
curl http://localhost:4000/api/v1/publications
```

### Paso 4: Obtener una publicación
```bash
curl http://localhost:4000/api/v1/publications/pub_ABC123XYZ456
```

### Paso 5: Editar tu publicación
```bash
curl -X PUT http://localhost:4000/api/v1/publications/pub_ABC123XYZ456 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Guía Completa de Node.js"
  }'
```

### Paso 6: Eliminar tu publicación
```bash
curl -X DELETE http://localhost:4000/api/v1/publications/pub_ABC123XYZ456 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🚀 Próximas Características (Opcionales)

- [ ] Búsqueda por palabra clave
- [ ] Filtrado por categoría
- [ ] Paginación (10 items por página)
- [ ] Ordenamiento por fecha/popularidad
- [ ] Sistema de comentarios
- [ ] Sistema de "me gusta"
- [ ] Tags/etiquetas
- [ ] Archivo de publicaciones favoritas

---

## 📝 Notas Importantes

- El `AuthorId` se obtiene automáticamente del JWT del usuario
- Solo el autor puede editar o eliminar sus publicaciones
- Las publicaciones se ordenan por fecha (más recientes primero)
- Los IDs se generan automáticamente con prefijo `pub_`
- La BD está sincronizada con `auth-node`

---

**Versión**: 1.0.0  
**Creado**: 20 de febrero de 2026  
**Autor**: Joshua Solares
