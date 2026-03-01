# PROYECTO: ASESORAMIENTO PARA PUBLICACIÓN WEB
## Empresa: MilfShakes - Tienda de Moda Online

**Alumno:** [Tu nombre]  
**Asignatura:** Implantación de Aplicaciones Web (IAW)  
**Fecha:** Marzo 2026

---

## 1. ANÁLISIS DE ARQUITECTURA (2 puntos)

### 1.1 Modelo Cliente-Servidor

El modelo cliente-servidor es una arquitectura de red en la que se diferencian claramente dos roles:

- **Cliente**: Es el navegador web del usuario final (Chrome, Firefox, etc.) que ejecuta en el equipo del usuario. El cliente realiza peticiones HTTP al servidor y recibe respuestas que procesa para mostrar contenido.

- **Servidor Web**: Es el equipo remoto que aloja los archivos y aplicaciones de la tienda. Escucha constantemente en el puerto 80 (HTTP) o 443 (HTTPS) las peticiones de los clientes, las procesa y devuelve las respuestas.

### 1.2 Componentes Necesarios para MilfShakes

Para servir la web de MilfShakes se requieren los siguientes componentes:

#### **A) Servidor Web**
- Responsable de recibir peticiones HTTP/HTTPS y entregar contenido estático (imágenes, CSS, JavaScript)
- En MilfShakes: Actúa como proxy inverso (reverse proxy) hacia la plataforma Shopify
- Proporciona seguridad mediante certificados SSL/TLS

#### **B) Servidor de Aplicaciones**
- Ejecuta código del lado del servidor (PHP, Python, Node.js, etc.)
- Procesa lógica de negocio: carrito de compra, pedidos, usuarios
- MilfShakes usa Shopify (plataforma SaaS) que maneja esto internamente

#### **C) Base de Datos**
- Almacena información: productos, categorías, usuarios, pedidos, inventario
- Debe ser segura y respaldada regularmente
- MilfShakes: Base de datos en los servidores de Shopify

#### **D) Certificado SSL/TLS**
- Cifra la comunicación entre cliente y servidor
- Esencial para transacciones de pago (PCI DSS compliance)
- MilfShakes usa HTTPS en todo el sitio (milfshakes.es)

#### **E) Sistema de Archivos**
- Almacena imágenes de productos, documentos, archivos estáticos
- Debe tener suficiente capacidad de almacenamiento
- Mejor rendimiento con CDN para distribución global

#### **F) DNS**
- Traduce el nombre de dominio (milfshakes.es) a dirección IP
- Permite que los usuarios accedan usando el nombre legible
- Debe ser redundante y confiable

### 1.3 Flujo de Comunicación

```
Usuario abre navegador
         ↓
Escribe "milfshakes.es"
         ↓
Navegador hace consulta DNS → Obtiene IP del servidor
         ↓
Navegador envía petición HTTP/HTTPS al servidor
         ↓
Servidor procesa la petición
         ↓
Servidor devuelve respuesta (HTML + CSS + JS)
         ↓
Navegador renderiza el contenido
```

### 1.4 Arquitectura basada en microservicios

Para una escalabilidad aún mayor y una web reactiva, se propone migrar a una
arquitectura de microservicios. Cada funcionalidad importante de la tienda se
convierte en un servicio independiente que se comunica mediante API REST o
GraphQL. En lugar de un único servidor monolítico, la infraestructura constaría
de:

- **Frontend React/Vue/Angular**: aplicación SPA (single page app) que consume
  las APIs de los microservicios y utiliza WebSockets o Server-Sent Events para
  reactividad en tiempo real (actualización de stock, estado del carrito,
  notificaciones).
- **Servicio de catálogo**: expone endpoints para listar, buscar y filtrar
  productos. Se conecta a su propia base de datos (podría ser MongoDB o
  PostgreSQL) y cachea resultados en Redis.
- **Servicio de autenticación/usuarios**: gestiona registro, login, JWT, perfiles
  y permisos. Utiliza su propia base de datos y puede delegar 2FA.
- **Servicio de carrito y pedidos**: guarda el estado del carrito en Redis y
  procesa órdenes, comunicándose con pasarelas de pago y con el servicio de
  inventario.
- **Servicio de inventario/stock**: mantiene cantidades en tiempo real y ofrece
  eventos (pub/sub) cuando cambian los niveles.
- **Servicio de pagos**: integra Stripe/PayPal, envía tokens y recibe notificaciones
  (webhooks) de transacciones.
- **Servicio de notificaciones**: envía correos electrónicos y mensajes push al
  frontend o a los usuarios.
- **API Gateway / Reverse Proxy**: Nginx o Kong como punto de entrada común que
  enruta peticiones al microservicio correspondiente y aplica políticas de
  seguridad (rate limiting, autenticación).

Cada microservicio puede desarrollarse en el lenguaje que más convenga
(Node.js, Go, Python, etc.) y se despliega en contenedores Docker. La base de
datos puede ser compartida por zonas (por ejemplo, un cluster de PostgreSQL
para catálogo y otro para usuarios) o utilizar bases de datos especializadas
(según la naturaleza del servicio).

La arquitectura es nativamente **reactiva**, ya que el frontend se actualiza
mediante WebSockets o GraphQL subscriptions cuando los microservicios emiten
cambios.

Los microservicios se orquestan mediante Kubernetes (EKS, GKE, AKS) o Docker
Swarm; la orquestación maneja:

- despliegue automático de contenedores
- escalado horizontal según carga (pod autoscaling)
- balanceo de carga interno
- configuración (ConfigMaps y Secrets)
- descubrimiento de servicios (DNS interno)
- reinicios automáticos y manejo de fallos

Esta arquitectura permite sustituir o escalar de forma independiente cada
servicio sin afectar el resto del sistema, además de facilitar el desarrollo
en paralelo por equipos distintos.

---

## 2. TIPOLOGÍA DE WEB (3 puntos)

### 2.1 Análisis de Necesidades

MilfShakes requiere un **SITIO DINÁMICO** por las siguientes razones:

#### **Análisis de Características:**

| Funcionalidad | Tipo Requerido | Razón |
|---|---|---|
| Catálogo de productos | Dinámico | 50+ productos que cambian con drops exclusivos |
| Búsqueda de productos | Dinámico | Necesita consultar BD en tiempo real |
| Carrito de compra | Dinámico | Debe guardar estado por usuario y sesión |
| Sistema de pedidos | Dinámico | Registra transacciones, usuarios, direcciones |
| Gestión de inventario | Dinámico | Actualiza stock en tiempo real |
| Cuentas de usuario | Dinámico | Almacena perfiles, historial, preferencias |
| Integración de pagos | Dinámico | Procesa múltiples métodos (PayPal, Visa, etc.) |
| Newsletter | Dinámico | Gestiona suscriptores en BD |
| Reseñas y comentarios | Dinámico | Almacena opiniones de usuarios |
| Bandas de promoción | Dinámico | Mensajes personalizados según el carrito |

### 2.2 Justificación de Sitio Dinámico

**¿Por qué NO puede ser estático?**

- Un sitio estático mostraría los mismos productos a todos los usuarios
- No podría procesar compras en tiempo real
- Sería imposible mantener un inventario preciso
- No habría autenticación de usuarios
- Las promociones siempre serían las mismas

**Ventajas del sitio dinámico para MilfShakes:**

✅ Personalización según perfil de usuario  
✅ Gestión completa de catálogo desde administrador  
✅ Procesamiento seguro de pagos  
✅ Historial de compras y recomendaciones  
✅ Estadísticas de ventas en tiempo real  
✅ Actualizaciones inmediatas del inventario  
✅ Interacción con usuarios (comentarios, favoritos)  

### 2.3 Tecnología Seleccionada

MilfShakes actualmente usa **Shopify** (SaaS - Software as a Service), que es una plataforma dinámica especializada en e-commerce. Shopify maneja:

- Servidor web y aplicaciones
- Base de datos
- Seguridad y certificados SSL
- Escalabilidad automática
- Backup y recuperación

---

## 3. SELECCIÓN TECNOLÓGICA (2 puntos)

### 3.1 Opciones de Software de Servidor

Para alojar MilfShakes se evalúan tres opciones principales:

#### **OPCIÓN 1: APACHE HTTP SERVER**

**Características:**
- Open source, gratuito
- Muy modular (mod_php, mod_ssl, etc.)
- Soporta múltiples lenguajes (PHP, Python, Perl)
- Compatible con .htaccess (reescritura de URLs)
- Funcionamiento por procesos (consume más memoria)

**Ventajas:**
- Documentación muy extensa
- Compatible con la mayoría de hosting compartido
- Flexible para diferentes configuraciones

**Desventajas:**
- Menor rendimiento que Nginx bajo alta carga
- Consume más recursos del servidor
- Más lento sirviendo contenido estático

**Rendimiento:**
- ~500 conexiones simultáneas en servidor medio
- Latencia típica: 100-200ms

---

#### **OPCIÓN 2: NGINX**

**Características:**
- Open source, gratuito
- Arquitectura basada en eventos (event-driven)
- Muy eficiente con recursos
- Excelente para contenido estático
- Proxy inverso

**Ventajas:**
- Mejor rendimiento bajo alta carga
- Menor consumo de memoria y CPU
- Ideal para muchas conexiones simultáneas
- Gestión eficiente de contenido estático
- Rápida entrega de recursos

**Desventajas:**
- Necesita servidor de aplicaciones separado (PHP-FPM, Node.js)
- Configuración más compleja
- Menos módulos que Apache

**Rendimiento:**
- ~10,000+ conexiones simultáneas posible
- Latencia típica: 20-50ms para contenido estático

---

#### **OPCIÓN 3: IIS (Internet Information Services)**

**Características:**
- Propietario de Microsoft
- Integrado con ecosistema Windows
- Soporta ASP.NET, C#, Visual Basic.NET
- Interfaz gráfica de administración
- Licencia Windows requerida

**Ventajas:**
- Integración con tecnologías Microsoft
- Interfaz administrativa amigable
- Soporte técnico de Microsoft
- Bueno para aplicaciones .NET

**Desventajas:**
- Requiere licencias caras (Windows Server, IIS)
- Menos flexible que Apache/Nginx
- Menor comunidad open source
- Más pesado en consumo de recursos
- Menos prevalente en hosting compartido

**Rendimiento:**
- ~2,000-5,000 conexiones simultáneas
- Latencia: 50-150ms

---

### 3.2 RECOMENDACIÓN PARA MILFSHAKES: NGINX + PHP-FPM

**Selección: NGINX**

```
┌─────────────────────────────────────────┐
│  CRITERIOS DE SELECCIÓN                 │
├─────────────────────────────────────────┤
│ ✓ Tráfico esperado: ALTO (moda online) │
│ ✓ Necesita escalabilidad futura          │
│ ✓ Múltiples métodos de pago              │
│ ✓ Muchas imágenes de productos           │
│ ✓ Soporte internacional                  │
│ ✓ Experiencia de usuario rápida          │
└─────────────────────────────────────────┘
```

**Justificación:**

1. **Rendimiento Superior**: Nginx puede manejar 10x más conexiones simultáneas que Apache
   - Una tienda de moda puede recibir picos de tráfico durante drops exclusivos
   - Black Friday, ofertas especiales → miles de usuarios concurrentes

2. **Eficiencia de Contenido Estático**: MilfShakes tiene muchas imágenes
   - Hoodies, pants, jackets, accesorios → cada producto 5-10 imágenes
   - CSS, JavaScript, iconos → todos servidos por Nginx
   - Nginx es 4x más rápido sirviendo estáticos

3. **Menor Consumo de Recursos**: En espacio de datos limitado
   - Costos de hosting más bajos
   - Menor necesidad de actualización de hardware

4. **Proxy Inverso**: Si trabaja con Shopify
   - Nginx puede actuar como proxy hacia los servidores de Shopify
   - Cachea contenido estático localmente
   - Mejora velocidad de carga

**Arquitectura Recomendada:**

```
┌─────────────┐
│  CLIENTE    │ (Navegador del usuario)
└────────┬────┘
         │ HTTP/HTTPS (Puerto 443)
         ↓
┌─────────────────────┐
│ NGINX (Front-end)   │ (Servidor web, proxy inverso, cache)
└────────┬────────────┘
         │
    ┌────┴─────┐
    ↓          ↓
┌────────┐  ┌──────────────┐
│ Cache  │  │ Shopify API  │
│ Local  │  │ (Backend)    │
└────────┘  └──────────────┘
```

---

## 4. FUNCIONAMIENTO DEL PROTOCOLO HTTP (2 puntos)

### 4.1 ¿Qué es HTTP?

**HTTP (HyperText Transfer Protocol)** es el protocolo de comunicación entre navegadores (clientes) y servidores web. Define cómo se envían peticiones y respuestas.

**Características:**
- Protocolo sin estado (stateless) - cada petición es independiente
- Basado en texto (legible)
- Usa puertos: 80 (HTTP) o 443 (HTTPS cifrado)
- Versiones: HTTP/1.1, HTTP/2, HTTP/3

### 4.2 Flujo Completo de una Petición en MilfShakes

#### **PASO 1: El usuario escribe la URL**
```
Usuario escribe: https://milfshakes.es/collections/camisetas
```

#### **PASO 2: Resolución DNS**
```
Navegador: "¿Cuál es la IP de milfshakes.es?"
           ↓
Servidor DNS: "La IP es: 104.21.XX.XX"
           ↓
Navegador obtiene la dirección IP del servidor
```

#### **PASO 3: Establecimiento de conexión (TCP Handshake)**
```
Cliente  →  SYN  →  Servidor
Cliente  ←  SYN-ACK  ←  Servidor
Cliente  →  ACK  →  Servidor
```
Se establecer conexión TCP en el puerto 443

#### **PASO 4: Cifrado TLS/SSL**
```
Cliente y Servidor intercambian certificados y claves de cifrado
Toda comunicación posterior está cifrada
```

#### **PASO 5: Petición HTTP**
```
PETICIÓN (REQUEST):
═════════════════════════════════════
GET /collections/camisetas HTTP/1.1
Host: milfshakes.es
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Accept-Language: es-ES,es;q=0.9
Connection: keep-alive
Cookie: sessionid=abc123def456; userid=789

[CUERPO VACÍO en petición GET]
═════════════════════════════════════
```

**Componentes:**
- **Línea de petición**: GET /collections/camisetas HTTP/1.1
  - GET = método HTTP (también POST, PUT, DELETE)
  - /collections/camisetas = ruta solicitada
  - HTTP/1.1 = versión del protocolo

- **Headers (Encabezados)**: Información adicional
  - Host: a qué servidor
  - User-Agent: qué navegador
  - Accept: qué tipo de contenido acepta
  - Cookie: información de sesión del usuario

- **Cuerpo**: En GET está vacío. En POST contiene datos

#### **PASO 6: Procesamiento en el Servidor**

```
SERVIDOR RECIBE:
1. Analiza la petición
2. Busca la ruta: /collections/camisetas
3. Comprueba si sigue en sesión (cookie)
4. Consulta BD: SELECT * FROM productos WHERE categoria='camisetas'
5. Genera respuesta HTML (estructura) + CSS (estilos) + JS (interactividad)
6. Comprueba credenciales de seguridad
7. Añade headers de seguridad
```

#### **PASO 7: Respuesta HTTP**

```
RESPUESTA (RESPONSE):
═════════════════════════════════════
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 45678
Set-Cookie: sessionid=abc123def456; Path=/
Cache-Control: public, max-age=3600
Strict-Transport-Security: max-age=31536000
X-Frame-Options: DENY

<!DOCTYPE html>
<html lang="es">
<head>
    <title>Camisetas - MilfShakes</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <header>...</header>
    <main>
        <h1>Colección de Camisetas</h1>
        <div class="productos">
            <img src="/img/camiseta1.jpg" alt="Camiseta 1">
            <span>Precio: 29,99€</span>
            ...
        </div>
    </main>
    <script src="/js/app.js"></script>
</body>
</html>
═════════════════════════════════════
```

**Códigos de estado HTTP:**
- **200 OK**: Petición exitosa
- **301/302**: Redirección
- **400 Bad Request**: Petición mal formada
- **401 Unauthorized**: Sin autenticación
- **403 Forbidden**: Sin permiso
- **404 Not Found**: Recurso no existe
- **500 Internal Server Error**: Error servidor
- **503 Service Unavailable**: Servidor no disponible

#### **PASO 8: Descarga de Recursos**

El navegador recibe HTML y nota que necesita más archivos:

```
GET /css/styles.css
GET /img/camiseta1.jpg
GET /img/camiseta2.jpg
GET /js/app.js
... (múltiples peticiones paralelas)
```

Cada recurso genera su propia petición y respuesta HTTP.

#### **PASO 9: Renderizado en el Navegador**

```
Cliente renderiza:
1. Estructura HTML
2. Aplica estilos CSS
3. Ejecuta JavaScript (interactividad, carrito, búsqueda)
```

#### **PASO 10: Interacción del Usuario**

Cuando el usuario:
- Busca productos → Petición GET con parámetros: `/search?q=hoodie`
- Añade al carrito → Petición POST con datos de producto
- Realiza compra → Petición POST con datos de pago (cifrados)
- Se autentica → Petición POST con usuario/contraseña

**Ejemplo: Agregar producto al carrito**

```
PETICIÓN:
POST /cart/add HTTP/1.1
Host: milfshakes.es
Content-Type: application/json
Authorization: Bearer token123

{
    "product_id": "blue-hoodie",
    "quantity": 1,
    "size": "M",
    "color": "blue"
}

RESPUESTA:
HTTP/1.1 200 OK
Content-Type: application/json

{
    "success": true,
    "cartTotal": 59.69,
    "itemsInCart": 1
}
```

### 4.3 Diferencia entre HTTP y HTTPS

| Característica | HTTP | HTTPS |
|---|---|---|
| Cifrado | NO | Sí (TLS/SSL) |
| Puerto | 80 | 443 |
| Seguridad | Baja - datos visibles | Alta - datos encriptados |
| Certificado | No necesita | Necesita certificado válido |
| Velocidad | Ligeramente más rápido | Más lento (cifrado) |
| SEO | Penalizaciones | Mejor ranking |

**Para MilfShakes: Obligatorio HTTPS** (maneja pagos y datos personales)

### 4.4 Diagrama del Flujo Completo

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                      │
├──────────────────────────────────────────────────────────────┤
│ 1. Usuario escribe: https://milfshakes.es/collections/...   │
│ 2. Presiona Enter                                            │
│                         ↓                                     │
│ 3. Consulta DNS para obtener IP                             │
│                         ↓                                     │
│ 4. Establece conexión TCP (SYN/SYN-ACK/ACK)                │
│                         ↓                                     │
│ 5. Negocia cifrado TLS/SSL                                  │
│                         ↓                                     │
│ 6. Envía PETICIÓN HTTP GET                                  │
└──────────────────────────────────────────────────────────────┘
                          ↓
                    Red Internet (cifrado)
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                 SERVIDOR (Nginx + PHP-FPM)                   │
├──────────────────────────────────────────────────────────────┤
│ 7. Recibe petición HTTP                                     │
│                         ↓                                     │
│ 8. Valida certificado SSL                                   │
│                         ↓                                     │
│ 9. Procesa URL: /collections/camisetas                      │
│                         ↓                                     │
│ 10. Verifica autenticación (cookies/sesión)                 │
│                         ↓                                     │
│ 11. Consulta base de datos:                                 │
│     SELECT * FROM productos WHERE categoria='camisetas'    │
│                         ↓                                     │
│ 12. Genera HTML dinámico con resultados                    │
│                         ↓                                     │
│ 13. Añade headers de seguridad                              │
│                         ↓                                     │
│ 14. Envía RESPUESTA HTTP (200 OK + HTML + CSS + JS)        │
└──────────────────────────────────────────────────────────────┘
                          ↓
                    Red Internet (cifrado)
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                  NAVEGADOR (Renderizado)                     │
├──────────────────────────────────────────────────────────────┤
│ 15. Recibe respuesta HTTP                                    │
│                         ↓                                     │
│ 16. Analiza HTML                                             │
│                         ↓                                     │
│ 17. Descarga recursos: CSS, imágenes, JS                    │
│     Peticiones HTTP paralelas para cada recurso             │
│                         ↓                                     │
│ 18. Renderiza página:                                        │
│     - HTML = estructura                                      │
│     - CSS = estilos visuales                                 │
│     - JS = interactividad (carrito, búsqueda, etc)         │
│                         ↓                                     │
│ 19. Página visible para el usuario                           │
│                         ↓                                     │
│ 20. Usuario interactúa (busca, compra, etc)                 │
│     Se generan más peticiones HTTP                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. SEGURIDAD Y MANTENIMIENTO (Sin valoración específica)

### 5.1 Medidas de Seguridad

#### **A) Certificados SSL/TLS**

```
✓ IMPLEMENTAR:
  - Certificado SSL/TLS válido (HTTPS obligatorio)
  - Certificado de al menos 2048 bits
  - Renovación automática cada 90 días
  - Usar Let's Encrypt (gratuito) o DigiCert Premium
  - HSTS (HTTP Strict Transport Security)
    Fuerza HTTPS en todas las conexiones
```

#### **B) Firewall y Protección DDoS**

```
✓ IMPLEMENTAR:
  - Firewall de aplicación web (WAF)
  - Protección contra ataques DDoS
  - Bloqueo de IP maliciosas
  - Rate limiting para prevenir fuerza bruta
  - Cloudflare o Akamai como protección
```

#### **C) Autenticación y Autorización**

```
✓ IMPLEMENTAR:
  - Autenticación de dos factores (2FA) para administradores
  - Contraseñas hash (bcrypt, Argon2) - NUNCA en texto plano
  - Control de acceso basado en roles (RBAC)
  - Sesiones seguras con tokens JWT o sesiones cifradas
  - Logout automático después de 30 minutos de inactividad
```

**Ejemplo de Hash Seguro:**
```
Contraseña original: "miAdmin2024!"
Hash bcrypt: $2y$12$R9h7cIPz0gi.URNNV3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUe
```

#### **D) Protección de Datos Sensibles**

```
✓ IMPLEMENTAR:
  - Cumplimiento GDPR (protección de datos personales)
  - Cifrado de información de tarjetas (PCI DSS Compliance)
  - No almacenar datos de tarjeta - usar gateway de pago
  - Enmascaramiento de datos en logs
  - Tokens de transacción únicos
```

**Información Nunca Debe Guardarse:**
```
❌ Números de tarjeta completos
❌ CVV/CVC
❌ PIN de tarjeta
✓ Últimos 4 dígitos (solo para referencia)
✓ Token de pago de tercero (Stripe, PayPal)
```

#### **E) Validación de Entrada (XSS, SQL Injection)**

```
✓ IMPLEMENTAR:
  - Validar todas las entradas de usuario
  - Sanitizar datos antes de guardar en BD
  - Usar prepared statements en SQL
  - Content Security Policy (CSP) headers
  - Escapar salida HTML
```

**Ejemplo de SQL Injection:**
```
❌ INSEGURO:
   query = "SELECT * FROM usuarios WHERE email='" + userInput + "'"
   Si usuario escribe: ' OR '1'='1
   Resultado: SELECT * FROM usuarios WHERE email='' OR '1'='1'
   (Devuelve TODOS los usuarios)

✓ SEGURO (Prepared Statement):
   query = "SELECT * FROM usuarios WHERE email=?"
   query.execute(userInput)
   Parámetro tratado como dato, no código
```

#### **F) Headers de Seguridad HTTP**

```
✓ IMPLEMENTAR en respuestas HTTP:

Strict-Transport-Security: max-age=31536000; includeSubDomains
  → Fuerza HTTPS durante 1 año

X-Content-Type-Options: nosniff
  → Evita detección tipo MIME

X-Frame-Options: DENY
  → Previene clickjacking (embeber en frame)

X-XSS-Protection: 1; mode=block
  → Protección contra XSS

Content-Security-Policy: default-src 'self'
  → Solo permite scripts/estilos del dominio

Referrer-Policy: strict-origin-when-cross-origin
  → Limita información de referrer
```

#### **G) Control de Acceso y Privilegios**

```
ESTRUCTURA DE ROLES:

┌─────────────────┐
│ Admin System    │ → Acceso a todo, incluida BD y servidor
│                 │
├─────────────────┤
│ Admin Content   │ → Gestoa productos, categorías, contenido
│                 │
├─────────────────┤
│ Staff Support   │ → Lee información de pedidos, clientes
│                 │ → No puede modificar productos
│                 │
├─────────────────┤
│ Usuario Cliente │ → Compra, consulta orden, perfil
│                 │ → No puede ver datos de otros usuarios
└─────────────────┘

El principio de minimo privilegio:
- Cada usuario solo tiene acceso a lo que necesita
```

### 5.2 Mantenimiento Preventivo

#### **A) Actualizaciones de Sistema**

```
CALENDARIO DE ACTUALIZACIONES:

Cada SEMANA:
├─ Parches de seguridad críticos (0-day vulnerabilities)
├─ Revisar logs de error
├─ Verificar espacio en disco
└─ Comprobar uptime del servidor

Cada MES:
├─ Actualizar Nginx versión menor
├─ Actualizar librerías PHP/Node.js
├─ Revisar performance
├─ Auditoría de accesos
└─ Test de backup

Cada TRIMESTRE:
├─ Actualizar sistema operativo
├─ Revisar configuración de seguridad
├─ Penetration testing
├─ Análisis de vulnerabilidades
└─ Optimización de BD

Cada AÑO:
├─ Renovación certificado SSL (antes de expirar)
├─ Auditoría de seguridad externa
├─ Revisión de contratación de servicios
└─ Planificación de crecimiento
```

#### **B) Copias de Seguridad (Backups)**

```
ESTRATEGIA 3-2-1:
┌─────────────────────────────────────┐
│ 3 copias de los datos               │
├─────────────────────────────────────┤
│ 2 en medios diferentes              │
├─────────────────────────────────────┤
│ 1 copy fuera del sitio (offsite)    │
└─────────────────────────────────────┘

IMPLEMENTACIÓN:

DIARIA (cada 24 horas):
├─ Base de datos (backup completo)
├─ Archivos modificados (incremental)
├─ Almacenamiento: Servidor local + NAS
└─ Prueba: Al menos 1 restore por mes

SEMANAL (cada domingo):
├─ Backup completo (todos los datos)
├─ Almacenamiento: Cloud (AWS S3, Azure, Google Cloud)
└─ Retención: 4 semanas

MENSUAL (último día del mes):
├─ Backup completo archivado
├─ Almacenamiento: Ubicación externa (bóveda)
└─ Retención: 12 meses

PROCEDIMIENTO DE BACKUP PARA MILFSHAKES:

1. Base de Datos:
   mysqldump -u user -p milfshakes_db > /backups/db_$(date +%Y%m%d_%H%M%S).sql
   Compresión: gzip db_*.sql

2. Archivos (imágenes, documentos):
   rsync -avz /var/www/milfshakes/ /backups/files/
   O tarball: tar -czf files_$(date +%Y%m%d).tar.gz /var/www/milfshakes/

3. Configuración:
   rsync -avz /etc/nginx/ /backups/config/nginx/
   rsync -avz /etc/php/ /backups/config/php/

4. Verificación de integridad:
   md5sum -c backup.md5 # Verificar no corrupción

5. Almacenamiento externo:
   aws s3 cp /backups/db_20260301.sql.gz s3://milfshakes-backup/db/
```

#### **C) Monitoreo y Alertas**

```
✓ HERRAMIENTAS RECOMENDADAS:
  - Nagios: Monitoreo de servicios
  - Prometheus: Métricas del sistema
  - ELK Stack (Elasticsearch, Logstash, Kibana): Logs
  - New Relic: Monitoreo de aplicación
  - Uptime Robot: Comprobación de disponibilidad

✓ MÉTRICAS A MONITOREAR:
  - CPU: < 80% normal
  - Memoria RAM: < 85% normal
  - Disco: < 80% lleno
  - Conexiones BD: < 80% max
  - Errores HTTP 5xx: < 0.1%
  - Tiempo respuesta: < 200ms (objetivo)
  - Disponibilidad: > 99.95% (SLA)

✓ ALERTAS AUTOMÁTICAS:
  - Si CPU > 85% → Notificación en tiempo real
  - Si disco > 90% → Alerta crítica
  - Si servicio cae → Reinicio automático + notificación
  - Si tiempo respuesta > 500ms → Investigar causas
```

**Ejemplo de configuración de alerta:**

```
[Nginx Service Alert]
Service: nginx
Threshold: CPU > 85% for 5 minutes
Action: 
  1. Notificar a administrador por email/SMS
  2. Ejecutar auto-scaler (aumentar recursos)
  3. Registrar en logs
  4. Si persiste > 15 min: Llamada telefónica
```

#### **D) Rotación de Logs**

```
✓ IMPLEMENTAR Logrotate:

/var/log/nginx/*.log {
    daily                    # Rotar diariamente
    rotate 30               # Mantener 30 versiones
    compress                # Comprimir logs viejos
    delaycompress          # No comprimir log actual
    notifempty             # No rotar si está vacío
    create 0644 www-data www-data
    missingok
    sharedscripts
    postrotate
        nginx -s reload
    endscript
}

Logs viejos: /var/log/nginx/access.log.1.gz, log.2.gz, etc
```

#### **E) Auditoría y Compliance**

```
✓ AUDITORÍA DE SEGURIDAD:

PCI DSS (para transacciones de pago):
├─ Escaneo de vulnerabilidades trimestral
├─ Penetration testing anual
├─ Validación de cifrado de datos
└─ Logs de transacciones durante 1 año

GDPR (privacidad de datos UE):
├─ Política de privacidad publicada
├─ Consentimiento de cookies y marketing
├─ Derecho al olvido (borrado de datos)
├─ Data Breach Notification en 72 horas
└─ DPA con proveedores (Shopify, etc)

LOGS DE AUDITORÍA A MANTENER:
  - Quién accedió y cuándo
  - Qué cambios se hicieron (productos, precios)
  - Intentos de acceso fallidos
  - Cambios de configuración
  - Escalaciones de privilegios
  Retención: Mínimo 1 año
```

### 5.3 Plan de Disaster Recovery

```
OBJETIVO: Si el servidor cae, recuperación en máximo 4 horas

ESCENARIOS Y ACCIONES:

1. FALLO DE DISCO (más probable):
   ├─ Tiempo detección: < 5 minutos (alerta automática)
   ├─ Acción: Reemplazar disco con RAID-1 en espera
   ├─ Datos: Recuperados de backup
   └─ Tiempo restauración: 30-60 minutos

2. ATAQUE SEGURIDAD / Malware:
   ├─ Acción 1: Aislar servidor (apagar de la red)
   ├─ Acción 2: Crear máquina limpia de backup
   ├─ Acción 3: Restablecerla desde el ultimo backup seguro
   ├─ Acción 4: Escanear en busca de malware
   └─ Tiempo restauración: 2-4 horas

3. FALLO TOTAL DEL SERVIDOR:
   ├─ Mantener servidor redundante en paralelo
   ├─ Usar failover automático (DNS, Load Balancer)
   ├─ Restaurar desde backup en nuevo servidor
   └─ Tiempo restauración: < 15 minutos (con failover)

REDUNDANCIA RECOMENDADA:
  Servidor 1 (Principal) ← Traffic 90%
       ↓ Replicación en tiempo real
  Servidor 2 (Standby) ← Traffic 10%
       ↓ Si falla principal
  Failover automático a Servidor 2
  Tiempo downtime: < 5 minutos
```

### 5.4 Documentación y Procedimientos

```
✓ DOCUMENTAR Y MANTENER ACTUALIZADO:

1. Runbooks (Guías de procedimientos):
   ├─ Cómo iniciar/detener servicios
   ├─ Cómo realizar backup manual
   ├─ Cómo restaurar desde backup
   ├─ Cómo escalar privilegios
   └─ Cómo contactar a proveedores

2. Arquitectura del sistema:
   ├─ Diagrama de infraestructura
   ├─ Esquema de BD
   ├─ Flujo de datos
   └─ Integraciones externas

3. Credenciales (almacenar seguro):
   ├─ Gestor de contraseñas (1Password, Vault)
   ├─ NO en archivos de texto plano
   ├─ Rotación cada 90 días
   └─ Acceso limitado a administradores

4. Contactos de emergencia:
   ├─ Administrador principal
   ├─ Proveedor de hosting
   ├─ Servicio técnico
   └─ Equipo de seguridad
```

---

## RESUMEN DE RECOMENDACIONES

| Aspecto | Decisión |
|---|---|
| **Tipología** | Sitio Dinámico (e-commerce) |
| **Plataforma** | Shopify (SaaS) u otro CMS e-commerce |
| **Servidor Web** | Nginx (rendimiento y escalabilidad) |
| **Protocolo** | HTTPS obligatorio (PCI DSS) |
| **BD** | PostgreSQL o MySQL con backups automáticos |
| **Certificado SSL** | Let's Encrypt (renovación automática) |
| **Backup** | 3-2-1: Diario local + Semanal cloud + Mensual offsite |
| **Monitoreo** | Prometheus + Grafana + alertas automáticas |
| **Disponibilidad SLA** | 99.95% uptime (máximo 21.5 horas downtime/año) |
| **Equipo Requerido** | 1 Admin Sistemas + 1 Desarrollador Backend |

---

## CONCLUSIÓN

MilfShakes, como tienda de moda online con transacciones de pago, requiere **una infraestructura sólida, segura y escalable**. La combinación de **Nginx + PHP-FPM** proporciona el mejor balance de **rendimiento, seguridad y coste**. 

La implementación de **HTTPS, backups automáticos, monitoreo continuo y auditoría de seguridad** asegura que los datos de clientes y transacciones se protejan adecuadamente según regulaciones como PCI DSS y GDPR.

**Inversión recomendada:**
- Hosting: 50-100€/mes (con buena infraestructura)
- Certificado SSL: Gratuito (Let's Encrypt)
- Monitoreo: 30-50€/mes
- Backup externo: 20-30€/mes
- **Total: ~150€/mes** para un servicio de calidad empresarial

---

**Elaborado por:** [Tu nombre]  
**Revisado:** Marzo 2026  
**Próxima revisión:** Junio 2026
