# MilfShakes CMS - Strapi Microservice

Servicio de Content Management System (CMS) basado en Strapi para gestionar el catálogo de productos, usuarios y contenido de MilfShakes.

## 🚀 Características

- **Gestión de Productos**: Crear, editar, eliminar y organizar productos
- **Usuarios y Permisos**: Sistema de roles y permisos integrado
- **Internacionalización**: Soporte multi-idioma con plugin i18n
- **REST & GraphQL APIs**: Acceso a contenido vía API REST estándar
- **Media Library**: Gestor de archivos integrado
- **Webhooks**: Eventos en tiempo real para actualizar otros microservicios
- **Drafts & Publishing**: Publicación programada de productos

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+ (recomendado) o SQLite (desarrollo)
- npm 9+

## 🔧 Instalación Local

```bash
cd microservices/cms-strapi

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Configurar base de datos en .env
DATABASE_HOST=localhost
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=strapi_milfshakes

# Ejecutar en desarrollo (con hot reload)
npm run develop
```

Strapi estará disponible en:
- **Admin Panel**: http://localhost:1337/admin
- **API REST**: http://localhost:1337/api
- **GraphQL**: http://localhost:1337/graphql

## 🐳 Despliegue con Docker

```bash
# Build de imagen
docker build -t milfshakes-cms:latest .

# Ejecutar contenedor
docker run -p 1337:1337 \
  -e DATABASE_HOST=postgres \
  -e DATABASE_USERNAME=strapi \
  -e DATABASE_PASSWORD=strapi \
  -e DATABASE_NAME=strapi_milfshakes \
  -e NODE_ENV=production \
  milfshakes-cms:latest
```

## 🌐 Despliegue en Vercel

### Paso 1: Preparar variables de entorno

1. Ir a Vercel dashboard
2. Crear nuevo proyecto
3. Conectar repositorio Git
4. En "Environment Variables", añadir:

```
DATABASE_CLIENT=postgres
DATABASE_HOST=<tu-host-postgres>
DATABASE_PORT=5432
DATABASE_NAME=strapi_milfshakes
DATABASE_USERNAME=<tu-usuario>
DATABASE_PASSWORD=<tu-contraseña-encriptada>
JWT_SECRET=<generar-random-string>
ADMIN_JWT_SECRET=<generar-random-string>
API_TOKEN_SALT=<generar-random-string>
NODE_ENV=production
```

### Paso 2: Base de datos en Vercel

Opciones:
- **Vercel Postgres**: Integración nativa, recomendado
- **Railway**: https://railway.app
- **Render**: https://render.com
- **AWS RDS**: PostgreSQL administrado

#### Con Vercel Postgres:

```bash
# Instalar CLI
npm install -g vercel

# Conectar
vercel postgres connect

# El CONNECTION_STRING se creará automáticamente
```

### Paso 3: Deploy

```bash
# Via Vercel CLI
vercel

# O via Git push (auto-deploy)
git push origin main
```

## 📊 Estructura de Contenido

### Colecciones Recomendadas

**Products**
```
- id: UUID
- name: String (required)
- description: Rich Text
- price: Decimal
- category: Relation (Categories)
- images: Media
- stock: Integer
- sku: String (unique)
- slug: String (auto-generated)
- published_at: DateTime
```

**Categories**
```
- id: UUID
- name: String
- description: Text
- icon: Media
- products: Relation (Products)
- displayOrder: Integer
```

**Orders** (con relaciones con User collection)
```
- id: UUID
- user: Relation (Users)
- products: Relation (Products)
- totalPrice: Decimal
- status: Enum (pending, processing, shipped, delivered)
- createdAt: DateTime
```

## 🔗 Integración con Microservicios

### Llamadas desde Frontend/API Gateway

```bash
# Obtener productos
GET /api/milfshakes-cms/products?populate=*

# Obtener categorías
GET /api/milfshakes-cms/categories?populate=products

# Crear producto (requiere autenticación)
POST /api/milfshakes-cms/products
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "data": {
    "name": "Blue Hoodie",
    "price": 59.99,
    "stock": 50,
    "category": 1
  }
}
```

### Webhooks a otros servicios

Configurar webhooks en Strapi para notificar a otros microservicios:

1. Ir a Settings → Webhooks
2. Crear webhook para "Product.published"
3. URL: `http://catalog-service:3001/webhook/product-updated`
4. Payload example:
```json
{
  "event": "entry.publish",
  "model": "product",
  "entry": {
    "id": 1,
    "name": "Blue Hoodie",
    "price": 59.99
  }
}
```

## 🔐 Seguridad

- **JWT Tokens**: Autenticación basada en JWT
- **Rate Limiting**: Configurar en Settings → API Tokens
- **CORS**: Configurar en config/middlewares.js
- **API Keys**: Generar en Admin Panel → Settings → API Tokens
- **Permiso

s**: Usar Roles & Permissions para limitar acceso

### Configurar CORS

```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://milfshakes.com'
      ],
      credentials: true,
    },
  },
];
```

## 📈 Monitoreo

### Logs
```bash
# Ver logs en producción
vercel logs milfshakes-cms --follow
```

### Health Check
```bash
curl http://localhost:1337/admin/health
```

### Métricas
- Monitor Strapi con Prometheus/Grafana
- AlertAs en Vercel dashboard

## 🚀 CI/CD

### Deploy automático
Cada push a main dispara auto-deploy en Vercel.

### Pruebas
```bash
npm run build  # Verifica build
npm test       # Ejecutar tests
```

## 🔄 Actualizaciones y Mantenimiento

```bash
# Actualizar Strapi a versión minor
npm update @strapi/strapi

# Actualizar versión major (requiere migration)
npm install @strapi/strapi@latest

# Generar nuevas migraciones de BD
npm run strapi migrations:generate
```

## 📚 Documentación Oficial

- [Strapi Docs](https://docs.strapi.io)
- [Strapi Community](https://discord.strapi.io)
- [Vercel Docs](https://vercel.com/docs)

## 🆘 Troubleshooting

### Error: Database connection failed
- Verificar credentials en .env
- Comprobar firewall/security groups
- Verificar que PostgreSQL está corriendo

### Error: Admin panel not loading
- Limpiar cache: `rm -rf .cache`
- Reconstruir admin: `npm run build`

### Vercel deployment timeout
- Aumentar timeouts en vercel.json
- Optimizar package.json (remover deps innecesarias)

## 📝 Licencia

Parte de MilfShakes Project - 2026
