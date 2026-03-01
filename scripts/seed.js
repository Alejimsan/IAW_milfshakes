const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      short_desc TEXT,
      description TEXT,
      price REAL,
      image TEXT,
      active INTEGER DEFAULT 1
    )
  `);

  const stmt = db.prepare('INSERT OR REPLACE INTO products (id,name,short_desc,description,price,image,active) VALUES (?,?,?,?,?,?,?)');

  const sample = [
    ['p1','Camiseta Classic','Camiseta 100% algodón','Camiseta cómoda y fresca.',19.99,'https://via.placeholder.com/300x300?text=Camiseta+1',1],
    ['p2','Sudadera Cozy','Sudadera con capucha','Sudadera suave, ideal para invierno.',49.99,'https://via.placeholder.com/300x300?text=Sudadera',1],
    ['p3','Pantalón Street','Pantalón estilo urbano','Pantalón con corte moderno.',39.99,'https://via.placeholder.com/300x300?text=Pantalon',1]
  ];

  sample.forEach(s => stmt.run(s));
  stmt.finalize();

  console.log('Seed completado. DB en:', DB_PATH);
});

db.close();
