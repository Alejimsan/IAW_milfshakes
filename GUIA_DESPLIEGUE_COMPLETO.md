# 🚀 Guía de Despliegue Completo: MilfShakes Microservicios + Strapi

Guía paso a paso para desplegar toda la arquitectura de microservicios de MilfShakes con Strapi CMS.

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Despliegue Local con Docker Compose](#despliegue-local)
3. [Despliegue en Vercel (Strapi)](#despliegue-vercel)
4. [Despliegue en Kubernetes](#despliegue-kubernetes)
5. [Integración entre Servicios](#integración)

---

## 🏗️ Arquitectura General

```
                     ┌─────────────────┐
                     │  Frontend React │
                     │   (SPA - 3000)  │
                     └────────┬────────┘
                              │ HTTPS
                              ↓
                     ┌─────────────────────┐
                     │   API Gateway       │
                     │  (Express - 3000)   │
                     └────────┬────────────┘
                              │
            ┌─────────────────┼──────────────────┐
            │                 │                  │
            ↓                 ↓                  ↓
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Catalog     │  │  Auth        │  │  CMS-Strapi  │
    │ (3001)       │  │  (3002)      │  │  (1337)      │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                  │
           └─────────────────┼──────────────────┘
                             │
                    ┌────────┴────────┐
                    ↓                 ↓
             ┌─────────────┐   ┌──────────────┐
             │ PostgreSQL  │   │ Redis Cache  │
             │  (5432)     │   │ (6379)       │
             └─────────────┘   └──────────────┘
```

---

## 🐳 Despliegue Local con Docker Compose

### Requisitos

- Docker Desktop 4.0+
- Docker Compose 2.0+
- 4GB RAM mínimo

### Paso 1: Clonar Repositorio

```bash
cd /path/to/MilfShake
git clone <repo-url> .
```

### Paso 2: Crear archivo .env

```bash
# En raíz del proyecto
cat > .env << EOF
# Database
DATABASE_HOST=postgres
DATABASE_USER=strapi
DATABASE_PASSWORD=strapi
DATABASE_NAME=strapi_milfshakes

# Services
NODE_ENV=development
JWT_SECRET=dev_secret_change_in_production
ADMIN_JWT_SECRET=dev_admin_secret_change_in_production
API_TOKEN_SALT=dev_api_salt_change_in_production

# Stripe (optional)
STRIPE_API_KEY=sk_test_your_key_here

# SMTP (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
EOF
```

### Paso 3: Iniciar Servicios

```bash
# Descargar imágenes y crear contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar servicios
docker-compose ps
```

### Paso 4: Acceder a Servicios

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| API Gateway | http://localhost:3000 | N/A |
| Strapi Admin | http://localhost:1337/admin | Crear en primer acceso |
| Postgres | localhost:5432 | strapi / strapi |
| Redis | localhost:6379 | N/A |
| Catalog API | http://localhost:3001 | Bearer token |
| Auth API | http://localhost:3002 | Bearer token |
| Cart API | http://localhost:3003 | Bearer token |

### Paso 5: Inicializar Strapi

1. Ir a http://localhost:1337/admin
2. Crear cuenta administrador
3. Crear colecciones de contenido (Products, Categories, etc.)
4. Publicar contenido

### Paso 6: Test de Conexión

```bash
# Test API Gateway
curl http://localhost:3000/health

# Test Strapi
curl http://localhost:1337/admin/health

# Test Catalog Service
curl http://localhost:3001/health

# Test Auth Service
curl http://localhost:3002/health
```

### Detener Servicios

```bash
# Parar contenedores (sin eliminar datos)
docker-compose stop

# Eliminar contenedores (mantiene volúmenes)
docker-compose down

# Eliminar todo incluyendo datos
docker-compose down -v
```

---

## 🌐 Despliegue en Vercel (Strapi CMS)

### Paso 1: Preparar Repositorio

```bash
# Crear rama para Vercel
git checkout -b vercel-strapi

# Solo subir carpeta cms-strapi
cd microservices/cms-strapi
```

### Paso 2: Crear Base de Datos PostgreSQL

Opciones (elegir una):

#### A. Vercel Postgres (Recomendado)

```bash
# Instalar CLI
npm install -g vercel

# Conectar y crear BD
vercel postgres connect
# Esto genera POSTGRES_URL_NON_POOLING automáticamente
```

#### B. Railway.app

1. Ir a https://railway.app
2. Crear nuevo proyecto
3. Agregar PostgreSQL
4. Copiar DATABASE_URL

#### C. Render.com

1. Ir a https://render.com
2. Crear instancia PostgreSQL
3. Copiar Connection String

### Paso 3: Configurar Vercel Project

```bash
vercel login
vercel link
```

### Paso 4: Agregar Variables de Entorno

```bash
# Via CLI
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add ADMIN_JWT_SECRET
vercel env add API_TOKEN_SALT
vercel env add NODE_ENV production

# O via Dashboard Vercel:
# Settings → Environment Variables → Add
```

**Variables necesarias:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<generar-random>
ADMIN_JWT_SECRET=<generar-random>
API_TOKEN_SALT=<generar-random>
NODE_ENV=production
```

### Paso 5: Deploy

```bash
# Via CLI
vercel deploy --prod

# O via Git push
git push origin vercel-strapi
# Vercel hace auto-deploy
```

### Paso 6: Verificar Despliegue

```bash
vercel logs <project-name>

# Test endpoint
curl https://milfshakes-cms.vercel.app/admin/health
```

### Variables de Entorno Seguras

```bash
# Generar secrets aleatorios seguros
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado: copia en:
# - JWT_SECRET
# - ADMIN_JWT_SECRET
# - API_TOKEN_SALT
```

### Con Vercel Postgres Integrado

```bash
vercel postgres create milfshakes
vercel env pull .env.local

# .env se autocrea con POSTGRES_URL_NON_POOLING
```

---

## ⚙️ Despliegue en Kubernetes

### Archivos YAML

Crear en `/k8s/`:

#### 1. Namespace

```bash
cat > k8s/namespace.yaml << 'EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: milfshakes
EOF
```

#### 2. ConfigMap (Configuración)

```bash
cat > k8s/configmap.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: milfshakes-config
  namespace: milfshakes
data:
  NODE_ENV: "production"
  DATABASE_HOST: "postgres"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "strapi_milfshakes"
EOF
```

#### 3. Secret (Credenciales)

```bash
cat > k8s/secret.yaml << 'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: milfshakes-secret
  namespace: milfshakes
type: Opaque
stringData:
  DATABASE_USERNAME: "strapi"
  DATABASE_PASSWORD: "your_secure_password"
  JWT_SECRET: "your_jwt_secret"
  ADMIN_JWT_SECRET: "your_admin_secret"
  API_TOKEN_SALT: "your_api_salt"
EOF
```

#### 4. PostgreSQL StatefulSet

```bash
cat > k8s/postgres.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: milfshakes
spec:
  ports:
  - port: 5432
  clusterIP: None
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: milfshakes
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: milfshakes-secret
              key: DATABASE_USERNAME
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: milfshakes-secret
              key: DATABASE_PASSWORD
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: milfshakes-config
              key: DATABASE_NAME
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
EOF
```

#### 5. Strapi Deployment

```bash
cat > k8s/strapi-deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: strapi
  namespace: milfshakes
spec:
  replicas: 2
  selector:
    matchLabels:
      app: strapi
  template:
    metadata:
      labels:
        app: strapi
    spec:
      containers:
      - name: strapi
        image: milfshakes/cms-strapi:latest
        ports:
        - containerPort: 1337
        env:
        - name: DATABASE_HOST
          valueFrom:
            configMapKeyRef:
              name: milfshakes-config
              key: DATABASE_HOST
        - name: DATABASE_USERNAME
          valueFrom:
            secretKeyRef:
              name: milfshakes-secret
              key: DATABASE_USERNAME
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: milfshakes-secret
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /admin/health
            port: 1337
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: strapi
  namespace: milfshakes
spec:
  selector:
    app: strapi
  ports:
  - port: 1337
    targetPort: 1337
  type: LoadBalancer
EOF
```

#### 6. Aplicar Configuración

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/strapi-deployment.yaml

# Verificar
kubectl get pods -n milfshakes
kubectl get svc -n milfshakes
```

---

## 🔗 Integración entre Servicios

### 1. Catalog Service consume Strapi

```javascript
// catalog-service/index.js
const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://cms-strapi:1337';

app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/products?populate=*`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Webhooks: Strapi → Inventory Service

**En Strapi (Admin Panel):**
1. Settings → Webhooks
2. Nuevo webhook:
   - Event: "entry.publish"
   - Model: "product"
   - URL: `http://inventory-service:3004/webhook/product-published`

```javascript
// inventory-service/index.js
app.post('/webhook/product-published', (req, res) => {
  const { data } = req.body;
  console.log('Producto publicado:', data.name);
  // Sincronizar con BD de inventario
  res.json({ received: true });
});
```

### 3. API Gateway enruta hacia Strapi

```javascript
// api-gateway/index.js
app.use('/cms', createProxyMiddleware({
  target: 'http://cms-strapi:1337',
  changeOrigin: true,
  pathRewrite: {
    '^/cms': '/api'
  }
}));

// Uso: GET /cms/products → llama a Strapi
```

### 4. Autenticación centralizada

```javascript
// middleware en API Gateway
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  // Verificar token con Auth Service
  axios.post('http://auth-service:3002/verify', { token })
    .then(() => next())
    .catch(() => res.status(401).json({ error: 'Invalid token' }));
};

app.use('/api', verifyJWT);
```

---

## 📊 Monitoreo y Logs

### Local (Docker Compose)

```bash
# Logs en tiempo real
docker-compose logs -f strapi

# Logs de servicio específico
docker-compose logs -f catalog-service

# Ver estadísticas
docker stats
```

### Vercel

```bash
# Ver logs de deployment
vercel logs cms-strapi --follow

# Errores
vercel logs cms-strapi --erroronly
```

### Kubernetes

```bash
# Logs de pod
kubectl logs -n milfshakes strapi-xxx -f

# Eventos de cluster
kubectl get events -n milfshakes

# Dashboard
kubectl proxy
# Ir a http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

---

## 🔒 Seguridad en Producción

### Checklist

- [ ] Cambiar todas las contraseñas por defecto
- [ ] Generar secrets seguros (32 caracteres mínimo)
- [ ] Habilitar HTTPS/TLS en todos los servicios
- [ ] Configurar CORS restrictivo
- [ ] Implementar rate limiting en API Gateway
- [ ] Configurar backups automáticos de BD
- [ ] Monitorear logs de seguridad
- [ ] Usar variables de entorno para secretos
- [ ] Encriptar datos sensibles en BD

---

## 📚 Referencias

- [Strapi Deployment](https://docs.strapi.io/cloud/getting-started)
- [Vercel Documentation](https://vercel.com/docs)
- [Kubernetes Guide](https://kubernetes.io/docs/)
- [Docker Compose](https://docs.docker.com/compose/)

---

**Última actualización:** Marzo 2026
