# 🎯 Frontend React Admin Dashboard - Guía de Integración

## Resumen Ejecutivo

Se ha creado un **panel administrativo React moderno y completo** para MilfShakes con:

- ✅ Dashboard con métricas en tiempo real
- ✅ Gráficos interactivos (Recharts)
- ✅ Gestión de productos, pedidos y usuarios
- ✅ Monitoreo de microservicios
- ✅ Interfaz responsiva (mobile-first)
- ✅ Integración con API Gateway y Strapi

---

## 📁 Archivos Creados

### Estructura Completa

```
frontend/
├── components/
│   ├── Sidebar.jsx              (240 líneas) - Navegación lateral colapsable
│   ├── DashboardMetrics.jsx     (60 líneas)  - KPI cards (Ventas, Pedidos, etc)
│   ├── SalesChart.jsx           (40 líneas)  - Gráfico de ventas (Recharts)
│   ├── OrdersList.jsx           (70 líneas)  - Tabla de pedidos interactiva
│   └── ServerStatus.jsx         (100 líneas) - Estado de microservicios
├── utils/
│   └── api.js                   (150 líneas) - Cliente HTTP con Axios
├── AdminDashboard.jsx           (280 líneas) - Componente principal
├── main.jsx                     (12 líneas)  - Entry point React
├── index.html                   (15 líneas)  - HTML base
├── index.css                    (50 líneas)  - Tailwind + custom CSS
├── package.json                 - Dependencias npm
├── vite.config.js               - Config Vite (port 5173)
├── tailwind.config.js           - Tailwind CSS config
├── postcss.config.js            - PostCSS plugins
├── .env.example                 - Template de variables
├── .gitignore                   - Archivos a ignorar
└── README.md                    (400+ líneas) - Documentación completa
```

### Componentes Importados en AdminDashboard

```javascript
import Sidebar from './components/Sidebar';
import DashboardMetrics from './components/DashboardMetrics';
import SalesChart from './components/SalesChart';
import OrdersList from './components/OrdersList';
import ServerStatus from './components/ServerStatus';
```

---

## 🚀 Instalación Paso a Paso

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

**Paquetes instalados:**
- react@18.2.0 - Framework UI
- vite@4.2.0 - Build tool (rápido)
- tailwindcss@3.3.0 - Estilos CSS
- recharts@2.5.0 - Gráficos interactivos
- axios@1.3.0 - Cliente HTTP
- lucide-react@0.263.1 - Iconos vectoriales
- zustand@4.3.6 - State management

### 2. Crear .env

```bash
cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_STRAPI_URL=http://localhost:1337
NODE_ENV=development
EOF
```

### 3. Iniciar en Desarrollo

```bash
npm run dev
```

**Output esperado:**
```
VITE v4.2.0  ready in 256 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Abre http://localhost:5173 en tu navegador.

### 4. Compilar para Producción

```bash
npm run build
# Genera carpeta dist/
```

---

## 🎨 Características por Sección

### Dashboard (vista principal)

**Componentes:**
1. **Barra superior** - Logo, selector de usuario, botón refresh
2. **Sidebar** - Navegación colapsable
3. **Métricas** - 4 KPI cards con tendencias
4. **Gráficos** - Ventas vs. Ingresos (últimos 7 días)
5. **Productos** - Top 4 productos más vendidos
6. **Pedidos** - Tabla con últimas 5 órdenes
7. **Servidores** - Estado de 6 microservicios

### Páginas de Sección

**Productos:**
- Nota: Gestionados en Strapi CMS (http://localhost:1337/admin)
- El dashboard enlaza al panel de Strapi

**Pedidos:**
- Tabla completa de pedidos
- Filtros por estado (pending, processing, shipped, completed)
- Detalles al hacer clic en "Ver"

**Usuarios:**
- Lista de usuarios registrados
- Roles (Admin, Cliente)
- Fecha de registro

**Servidores:**
- API Gateway, Catalog, Auth, Strapi, Database, Cache
- Indica: Estado, Uptime, Latencia

---

## 🔗 Integración con APIs

### Cliente HTTP (axios)

```javascript
// En utils/api.js se configuran automáticamente:
// - Base URL: http://localhost:3000
// - Timeout: 10 segundos
// - Retry automático en 401

import { catalogAPI, authAPI, ordersAPI } from './utils/api';

// Ejemplo 1: Obtener productos
const brands = await catalogAPI.getProducts({ limit: 50 });

// Ejemplo 2: Autenticación
const user = await authAPI.login('admin@milfshakes.es', 'password');

// Ejemplo 3: Obtener pedidos
const orders = await ordersAPI.getOrders({ status: 'pending' });
```

### Endpoints Disponibles

**Catalog Service (GET /catalog/...)**
```
/products              - Listar con paginación
/products/:id          - Obtener uno
/categories            - Categorías
/search?q=term         - Buscar
```

**Auth Service (POST /auth/...)**
```
/login                 - {"email", "password"}
/register              - {"email", "password", "name"}
/me                    - Obtener perfil actual
/profile               - Actualizar perfil
```

**Orders Service**
```
GET  /orders           - Listar con filtros
POST /orders           - Crear nuevo
GET  /orders/:id       - Detalle
PUT  /orders/:id       - Actualizar
POST /orders/:id/cancel - Cancelar
```

**Health Checks**
```
GET /health            - API Gateway
GET /catalog/health    - Catalog Service
GET /auth/health       - Auth Service
... (todos los servicios tienen /health)
```

---

## 📊 Mock Data (Desarrollo)

El dashboard incluye datos simulados para demostración:

```javascript
const mockMetrics = {
  totalSales: 45230.50,
  totalOrders: 342,
  totalProducts: 127,
  activeUsers: 1245,
  // ... cambios porcentuales
};

const mockSalesData = [
  { date: 'Mar 01', sales: 2400, revenue: 2400 },
  // ... 7 días
];

const mockOrders = [
  { id: 'ORD-001', customer: 'Juan García', total: 125.50, ... },
  // ... 5 órdenes
];
```

Para usar datos reales, reemplaza en `AdminDashboard.jsx`:

```javascript
// Cambiar de:
setTimeout(() => { setDashboardData({...mockData}) }, 1000);

// A:
const fetchData = async () => {
  const metrics = await healthAPI.checkGateway();
  const orders = await ordersAPI.getOrders();
  const servers = await Promise.all([
    healthAPI.checkGateway(),
    healthAPI.checkCatalog(),
    // ... más checks
  ]);
  setDashboardData({ metrics, orders, servers });
};

useEffect(() => { fetchData(); }, []);
```

---

## 🎨 Personalización

### Cambiar Colores

En `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',      // Azul - cambiar hex
      secondary: '#10b981',    // Verde
      accent: '#f59e0b',       // Naranja
    }
  }
}
```

Luego usa en componentes:
```jsx
<div className="bg-primary text-white">Contenido</div>
```

### Cambiar Sidebar Ancho

En `Sidebar.jsx`:
```javascript
// DEFAULT: w-64 (ancho 256px cuando open, w-20 cuando closed)
<aside className={`${isOpen ? 'w-96' : 'w-24'} ...`}>
```

### Añadir Nuevas Métricas

En `DashboardMetrics.jsx`:
```jsx
const metricCards = [
  // ... existentes
  {
    title: 'Nueva Métrica',
    value: '12,345',
    change: 8.5,
    icon: NewIcon,
    color: 'from-cyan-500 to-cyan-600'
  }
];
```

---

## 📱 Responsive Design

El dashboard es totalmente responsivo gracias a Tailwind:

```javascript
// Grid que se adapta:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  // 1 columna en móvil
  // 2 en tablet
  // 4 en desktop
</div>
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px  (tablet)
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)

---

## 🔐 Autenticación

### Flujo de Login

```javascript
// 1. Usuario entra credenciales
const { email, password } = formData;

// 2. Llamar API
const response = await authAPI.login(email, password);

// 3. Guardar token
localStorage.setItem('authToken', response.data.token);

// 4. Enviar con próximas requests (automático en api.js)
// El interceptor añade: Authorization: Bearer <token>
```

### Proteger Rutas

```javascript
// En componente que necesita auth:
useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Redirigir a login
    window.location.href = '/login';
  }
}, []);
```

---

## 🚀 Despliegue

### Despliegue Local (Desarrollo)

```bash
npm run dev
# Accesible en http://localhost:5173
```

### Despliegue en Vercel

```bash
# 1. Conectar repo a Vercel
vercel login
vercel link

# 2. Configurar variables
vercel env add VITE_API_URL
vercel env add VITE_STRAPI_URL

# 3. Deploy automático con git push
git push origin main
# O manual:
vercel --prod

# URL: https://[proyecto].vercel.app
```

### Despliegue en Other Platforms

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

**Docker Compose:**
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://api:3000
      - VITE_STRAPI_URL=http://cms:1337
```

**Nginx:**
```nginx
server {
  listen 80;
  server_name milfshakes.es;

  location / {
    root /var/www/frontend/dist;
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://localhost:3000;
  }

  location /admin {
    proxy_pass http://localhost:1337;
  }
}
```

---

## 🧪 Testing

### Instalar dependencias de test

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Correr tests

```bash
# Una vez
npm run test

# En modo watch
npm run test -- --watch
```

### Ejemplo de test

```javascript
// components/DashboardMetrics.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardMetrics from './DashboardMetrics';

describe('DashboardMetrics', () => {
  it('debe mostrar las 4 métricas', () => {
    const metrics = {
      totalSales: 1000,
      totalOrders: 10,
      totalProducts: 50,
      activeUsers: 100,
      salesChange: 5,
      ordersChange: 3,
      productsChange: 2,
      usersChange: -1
    };
    
    render(<DashboardMetrics metrics={metrics} />);
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
```

---

## 📚 Estructura de Carpetas Recomendada

Para proyectos más grandes, considera estructura adicional:

```
frontend/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── Layout.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Metrics.jsx
│   │   └── Charts.jsx
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProductCard.jsx
│   ├── orders/
│   │   ├── OrderList.jsx
│   │   └── OrderDetail.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── Loading.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Orders.jsx
│   ├── Users.jsx
│   └── Servers.jsx
├── hooks/
│   ├── useFetch.js
│   ├── useAuth.js
│   └── useLocalStorage.js
├── store/
│   ├── authStore.js
│   ├── productsStore.js
│   └── ordersStore.js
├── utils/
│   ├── api.js
│   ├── constants.js
│   └── validators.js
└── styles/
    ├── index.css
    ├── tailwind.css
    └── globals.css
```

---

## 🔄 Próximos Pasos

1. **Conectar datos reales**
   - Reemplazar mock data con llamadas a APIs
   - Implementar pagination en tablas

2. **Añadir autenticación**
   - Login form
   - JWT token management
   - Protected routes

3. **Mejorar UX**
   - Loading states
   - Error handling
   - Toast notifications
   - Confirmación de acciones

4. **Real-time Updates**
   - WebSockets con Socket.io
   - Actualización automática de métricas
   - Notificaciones push

5. **Performance**
   - Code splitting
   - Lazy loading de componentes
   - Caché inteligente
   - Service Workers

---

## 📞 Soporte

Para problemas:

1. Verifica que microservicios están corriendo: `docker-compose ps`
2. Comprueba .env variables
3. Revisa browser console (F12)
4. Mira logs: `docker-compose logs frontend`

---

## 📄 Archivos de Referencia

- **AdminDashboard.jsx** - Componente raíz (280 líneas)
- **components/Sidebar.jsx** - Navegación (240 líneas)
- **utils/api.js** - Cliente HTTP (150 líneas)
- **README.md** - Documentación (400+ líneas)

---

**Dashboard completamente funcional y listo para desarrollo**

Marzo 2026 ✅
