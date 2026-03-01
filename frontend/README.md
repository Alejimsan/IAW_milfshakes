# 🎨 MilfShakes Admin Dashboard

Panel administrativo moderno y reactivo para la plataforma de microservicios de MilfShakes.

## 📋 Características

✅ **Dashboard Intuitivo**
- Resumen de ventas y métricas en tiempo real
- Gráficos interactivos (Recharts)
- Indicadores KPI destacados
- Estado de los microservicios

✅ **Gestión Completa**
- Productos (integrado con Strapi CMS)
- Pedidos y transacciones
- Usuarios y perfiles
- Monitoreo de servidor

✅ **Diseño Responsivo**
- Interfaz mobile-first
- Sidebar colapsable
- Temas personalizables
- Transiciones suaves

✅ **Integraciones**
- API Gateway (Express)
- Strapi CMS
- Todos los microservicios
- WebSockets (tiempo real)

---

## 🚀 Instalación Rápida

### Pre-requisitos
- Node.js 18+
- npm 9+
- Microservicios ejecutándose (docker-compose up)

### Pasos

```bash
# 1. Navegar a la carpeta
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_STRAPI_URL=http://localhost:1337
NODE_ENV=development
EOF

# 4. Iniciar en desarrollo
npm run dev

# La app se abrirá en http://localhost:5173
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── components/
│   ├── Sidebar.jsx              # Navegación lateral
│   ├── DashboardMetrics.jsx     # KPI cards
│   ├── SalesChart.jsx           # Gráficos de ventas
│   ├── OrdersList.jsx           # Tabla de pedidos
│   └── ServerStatus.jsx         # Estado de microservicios
├── utils/
│   └── api.js                   # Cliente HTTP (Axios)
├── AdminDashboard.jsx           # Componente principal
├── main.jsx                     # Entry point React
├── index.html                   # HTML base
├── index.css                    # Tailwind CSS
├── package.json                 # Dependencias
├── vite.config.js               # Config Vite
├── tailwind.config.js           # Config Tailwind
├── postcss.config.js            # Config PostCSS
└── README.md                    # Este archivo
```

---

## 🛠️ Tecnologías

| Tecnología | Uso | Versión |
|---|---|---|
| **React** | UI Framework | 18.2.0 |
| **Vite** | Build tool | 4.2.0 |
| **Tailwind CSS** | Estilos | 3.3.0 |
| **Recharts** | Gráficos | 2.5.0 |
| **Axios** | HTTP Client | 1.3.0 |
| **Lucide React** | Iconos | 0.263.1 |
| **Zustand** | State Management | 4.3.6 |

---

## 📊 Componentes Principales

### AdminDashboard.jsx
Componente raíz que organiza toda la interfaz.

**Props:** Ninguna (maneja estado interno)

**Estado:**
- `isSidebarOpen`: Visibilidad sidebar
- `activeSection`: Sección activa
- `dashboardData`: Datos del dashboard
- `loading`: Estado de carga

### DashboardMetrics
Muestra 4 KPI principales con tendencias.

```jsx
<DashboardMetrics metrics={{
  totalSales: 45230.50,
  totalOrders: 342,
  totalProducts: 127,
  activeUsers: 1245,
  // ... cambios porcentuales
}} />
```

### SalesChart
Gráfico combinado de barras y líneas.

```jsx
<SalesChart data={[
  { date: 'Mar 01', sales: 2400, revenue: 2400 },
  // ...
]} />
```

### OrdersList
Tabla interactiva de pedidos.

```jsx
<OrdersList orders={[
  {
    id: 'ORD-001',
    customer: 'Juan García',
    total: 125.50,
    status: 'completed',
    date: '2026-03-01'
  },
  // ...
]} />
```

### ServerStatus
Monitoreo de estado de microservicios.

```jsx
<ServerStatus servers={{
  apiGateway: { status: 'online', uptime: '99.95%', latency: 45 },
  // ...
}} />
```

---

## 🔗 Integración con APIs

### API Client (utils/api.js)

```javascript
import { catalogAPI, authAPI, ordersAPI } from './utils/api';

// Obtener productos
const products = await catalogAPI.getProducts({ limit: 10 });

// Iniciar sesión
const user = await authAPI.login('user@example.com', 'password');

// Obtener pedidos
const orders = await ordersAPI.getOrders({ status: 'pending' });
```

### Endpoints por Servicio

**Catalog Service (3001)**
```
GET  /catalog/products          # Listar productos
GET  /catalog/products/:id      # Obtener producto
GET  /catalog/categories        # Listar categorías
POST /catalog/search            # Buscar productos
```

**Auth Service (3002)**
```
POST /auth/login                # Iniciar sesión
POST /auth/register             # Registro
GET  /auth/me                   # Perfil actual
PUT  /auth/profile              # Actualizar perfil
```

**Orders Service (3003)**
```
GET  /orders                    # Listar pedidos
POST /orders                    # Crear pedido
GET  /orders/:id                # Obtener pedido
PUT  /orders/:id                # Actualizar pedido
POST /orders/:id/cancel         # Cancelar pedido
```

**CMS Strapi (1337)**
```
GET  /api/products              # Productos
GET  /api/categories            # Categorías
GET  /api/orders                # Pedidos
```

---

## 🎨 Personalización

### Colores Tailwind

Editar `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',      // Azul
      secondary: '#10b981',    // Verde
      // Añade tus colores
    }
  }
}
```

### Fuentes

```javascript
// En tailwind.config.js
theme: {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  }
}
```

### Temas Oscuros

Para implementar tema oscuro, añade a `AdminDashboard.jsx`:

```jsx
const [darkMode, setDarkMode] = useState(false);

return (
  <div className={darkMode ? 'dark' : ''}>
    {/* contenido */}
  </div>
);
```

---

## 🚀 Build para Producción

```bash
# Compilar
npm run build

# Salida en carpeta dist/
# Listos para desplegar

# Vista previa del build
npm run preview
```

### Optimizaciones de Build

```javascript
// vite.config.js
build: {
  outDir: 'dist',
  sourcemap: false,      // Sin sourcemaps en prod
  minify: 'terser',      // Minificación
  rollupOptions: {
    output: {
      manualChunks: {    // Code splitting
        vendor: ['react', 'axios']
      }
    }
  }
}
```

---

## 📡 Despliegue en Vercel

```bash
# 1. Conectar repo
vercel link

# 2. Configurar env vars
vercel env add VITE_API_URL
vercel env add VITE_STRAPI_URL

# 3. Deploy
vercel --prod

# El app estará en: https://[project].vercel.app
```

### Configuración vercel.json (en raíz del proyecto)

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_STRAPI_URL": "@strapi_url"
  }
}
```

---

## 🧪 Testing

### Instalar testing libraries

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Ejemplo de test

```javascript
// components/DashboardMetrics.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardMetrics from './DashboardMetrics';

describe('DashboardMetrics', () => {
  it('muestra las métricas correctamente', () => {
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
  });
});
```

---

## 🔐 Seguridad

### Almacenamiento de Tokens

```javascript
// Guardar token después de login
localStorage.setItem('authToken', response.data.token);

// El interceptor de Axios lo añade automáticamente
// a todos los requests en Authorization header
```

### CORS

Si obtienes errores de CORS, asegúrate en API Gateway:

```javascript
// api-gateway/index.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'react'"
```bash
npm install
```

### Errores de CORS
- Verifica que los microservicios incluyen headers CORS
- Comprueba VITE_API_URL en .env

### Gráficos no se muestran
- Recharts necesita ancho específico
- Envuelve en ResponsiveContainer

### Estado no se actualiza
- Usa `useEffect` para fetch de datos
- Verifica estado inicial en AdminDashboard

---

## 📈 Mejoras Futuras

- [ ] Autenticación 2FA
- [ ] Tema oscuro automático
- [ ] WebSockets para datos en tiempo real
- [ ] Exportar reportes (PDF, Excel)
- [ ] Gráficos personalizables
- [ ] Notificaciones push
- [ ] Caché offline (Service Workers)
- [ ] Internacionalización (i18n)

---

## 👥 Contribución

1. Fork el repo
2. Crea rama: `git checkout -b feature/nueva-feature`
3. Commit cambios: `git commit -m 'Add: nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Pull Request

---

## 📄 Licencia

MIT - Libre para uso personal y comercial

---

## 📞 Soporte

Para problemas o preguntas:
- Issues: GitHub Issues
- Email: admin@milfshakes.es
- Docs: [Documentación completa](./DOCS.md)

---

**Desarrollado con ❤️ para MilfShakes**
Marzo 2026
