# MilfShakes Demo (Proyecto funcional)

Este proyecto es una aplicación demo mínima que implementa un catálogo, carrito y checkout (simulado) usando Express + SQLite.

Requisitos:
- Node.js >= 16

Instalación y ejecución:

```bash
# En la carpeta del proyecto
npm install

# Generar la base de datos con productos de ejemplo
npm run seed

# Iniciar servidor
npm start

# Abrir en el navegador: http://localhost:3000
```

Notas:
- Es una demo educativa; no procesa pagos reales.
- La base de datos se crea en `data/database.sqlite`.
- Para sesiones persistentes se usa `connect-sqlite3`.

Archivos principales:
- `server.js` - servidor Express
- `scripts/seed.js` - script para crear DB y productos
- `views/` - plantillas EJS
- `public/` - assets estáticos (CSS)
