# Comentary Node - Servicio de Comentarios

API REST para gestión de comentarios en publicaciones de Gestify.

## Características

- Crear comentarios en publicaciones
- Editar comentarios propios
- Eliminar comentarios propios
- Listar comentarios por publicación
- Validación de JWT para autenticación

## Instalación

```bash
pnpm install
```

## Configuración

1. Copiar `.env.example` a `.env`
2. Configurar las variables de entorno

## Ejecución

```bash
# Desarrollo
pnpm dev

# Producción
pnpm start
```

## Endpoints

- `GET /api/v1/comments/publication/:publicationId` - Listar comentarios de una publicación
- `POST /api/v1/comments` - Crear comentario
- `PUT /api/v1/comments/:commentId` - Editar comentario propio
- `DELETE /api/v1/comments/:commentId` - Eliminar comentario propio
- `GET /api/v1/health` - Health check
