# INFOGRAFÍAS Y RESÚMENES VISUALES
## Proyecto IAW - MilfShakes

---

## 1. RESUMEN EJECUTIVO VISUAL

```
╔════════════════════════════════════════════════════════════════════╗
║                     MILFSHAKES - SOLUCIÓN WEB                     ║
╚════════════════════════════════════════════════════════════════════╝

ANÁLISIS DE REQUISITOS:

📊 ARQUITECTURA CLIENTE-SERVIDOR
├─ Cliente: Navegador web (Chrome, Firefox, Safari)
├─ Servidor: Nginx + PHP-FPM (aplicaciones dinámicas)
├─ BD: MySQL (gestión de datos)
├─ Protocolo: HTTPS/TLS (cifrado)
└─ CDN: Cloudflare (distribución contenido)

🔄 TIPOLOGÍA: DINÁMICO
✅ Carrito de compra
✅ Autenticación de usuarios
✅ Procesamiento de pagos
✅ Inventario en tiempo real
✅ Personalización por usuario

🖥️ SERVIDOR WEB SELECCIONADO: NGINX
✓ 10,000+ conexiones simultáneas
✓ 20-50ms de latencia
✓ 10-20% consumo CPU
✓ Bajo consumo RAM
✓ Gratuito y open source

📶 PROTOCOLO HTTP/HTTPS
✓ Obligatorio: HTTPS en todo
✓ Certificado SSL Let's Encrypt
✓ Headers de seguridad
✓ Flujo completo en 10 pasos

🔐 SEGURIDAD
✓ Firewall (UFW)
✓ WAF (Cloudflare)
✓ Backup 3-2-1
✓ Certificados SSL
✓ Autenticación 2FA
```

---

## 2. COMPARATIVA VISUAL - SERVIDORES WEB

```
CONEXIONES SIMULTÁNEAS (Mayor = Mejor)
Apache   : ▓▓ 500
IIS      : ▓▓▓▓ 2,000-5,000
Nginx    : ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 10,000+ ⭐

LATENCIA EN RESPUESTA (Menor = Mejor)
Nginx    : ▓▓ 20-50ms ⚡
IIS      : ▓▓▓▓▓ 50-150ms
Apache   : ▓▓▓▓▓▓▓▓ 100-200ms

CONSUMO CPU (Menor = Mejor)
Nginx    : ▓▓▓ 10-20% ⭐
IIS      : ▓▓▓▓▓▓ 40-60%
Apache   : ▓▓▓▓▓▓▓▓ 60-80%

COSTE ANUAL (Menor = Mejor)
Nginx    : 0€ ⭐
Apache   : 0€ ⭐
IIS      : 500-2,000€ ❌
```

---

## 3. FLUJO HTTP EN 10 PASOS

```
1️⃣  Usuario: https://milfshakes.es/camisetas
2️⃣  DNS: ¿IP de milfshakes.es?
3️⃣  TCP: Conexión establecida (puerto 443)
4️⃣  TLS: Certificado validado
5️⃣  HTTP: GET /camisetas
        Host: milfshakes.es
        Cookie: sessionid=...
6️⃣  Servidor: Valida sesión
7️⃣  BD: SELECT * FROM productos
8️⃣  Servidor: Genera HTML dinámico
9️⃣  HTTP: 200 OK [HTML + CSS + JS]
🔟 Navegador: Renderiza página + descarga recursos
```

---

## 4. CHECKLIST DE LANZAMIENTO

```
PRE-LANZAMIENTO (Semana 1-2):
☐ Dominio registrado (milfshakes.es)
☐ Hosting contratado (Nginx + PHP 8.1+)
☐ Certificado SSL (Let's Encrypt)
☐ BD creada (MySQL 8.0+)
☐ Backups configurados

SEGURIDAD (Semana 2-3):
☐ Firewall (UFW activo)
☐ Fail2Ban (protección SSH)
☐ Headers HTTP seguros
☐ HTTPS obligatorio
☐ WAF (Cloudflare)

TESTING (Semana 3-4):
☐ Funcionalidad (compra productos)
☐ Seguridad (SSL Labs A+)
☐ Rendimiento (latencia < 200ms)
☐ Backup/Restauración funciona

LANZAMIENTO:
☐ DNS apuntando al nuevo servidor
☐ Monitoreo activo
☐ Equipo de guardia 24/7
☐ Comunicación a usuarios
```

---

## 5. COSTES ANUALES

```
Hosting Nginx:         600€  (50€/mes)
Dominio:                 12€  (1€/mes)
Certificado SSL:          0€  (Let's Encrypt)
Backup Cloud:           240€  (20€/mes)
Monitoreo:              360€  (30€/mes)
CDN/WAF:               120€  (10€/mes)
─────────────────────────────
TOTAL ANUAL:         1,332€
TOTAL MENSUAL:         111€
```

---

## 6. MATRIZ DE RIESGOS

```
RIESGO                  IMPACT    MITIGACIÓN
Caída servidor          Crítico   Failover automático
Ataque DDoS             Crítico   Cloudflare WAF
Pérdida de datos        Crítico   Backup 3-2-1
Vulnerabilidad XSS      Alto      Sanitización input
Falta HTTPS             Crítico   Certificado + HSTS
Performance lento       Medio     Cachés + CDN
```

---

## 7. PREGUNTAS FRECUENTES

**¿Por qué Nginx y no Apache?**
✓ 20x más conexiones simultáneas (10,000+ vs 500)
✓ 4x más rápido con archivos estáticos
✓ 60-80% menos RAM

**¿Es obligatorio HTTPS?**
SÍ - PCI DSS, GDPR, SEO, confianza usuario

**¿Cada cuánto hacer backups?**
✓ Diaria automática (BD + archivos)
✓ Semanal completa
✓ Mensual archivada (offsite)

**¿Qué hacer si cae el servidor?**
✓ Failover automático (2-5 min)
✓ Monitoreo alerta al equipo
✓ Restauración desde backup

