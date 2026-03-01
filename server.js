const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data', 'database.sqlite');
const app = express();
const port = process.env.PORT || 3000;

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static
app.use('/static', express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sessions
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.join(__dirname, 'data') }),
  secret: 'milfshakes-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// DB helper
function openDb() {
  return new sqlite3.Database(DB_PATH);
}

// Middleware: attach cart from session
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = {};
  res.locals.cart = req.session.cart;
  next();
});

// Routes
app.get('/', (req, res) => {
  const db = openDb();
  db.all('SELECT id, name, price, image, short_desc FROM products WHERE active=1', (err, rows) => {
    db.close();
    if (err) return res.status(500).send('DB error');
    res.render('index', { products: rows });
  });
});

app.get('/product/:id', (req, res) => {
  const id = req.params.id;
  const db = openDb();
  db.get('SELECT * FROM products WHERE id=?', [id], (err, row) => {
    db.close();
    if (err) return res.status(500).send('DB error');
    if (!row) return res.status(404).send('Producto no encontrado');
    res.render('product', { product: row });
  });
});

app.post('/cart/add', (req, res) => {
  const { product_id, quantity } = req.body;
  const qty = parseInt(quantity || 1, 10);
  if (!product_id) return res.status(400).json({ success: false });
  // add to session cart
  const cart = req.session.cart;
  if (!cart[product_id]) cart[product_id] = 0;
  cart[product_id] += qty;
  req.session.save(() => {
    res.json({ success: true, cart });
  });
});

app.get('/cart', (req, res) => {
  const cart = req.session.cart || {};
  const ids = Object.keys(cart);
  if (ids.length === 0) return res.render('cart', { items: [], total: 0 });
  const db = openDb();
  const placeholders = ids.map(() => '?').join(',');
  db.all(`SELECT id, name, price, image FROM products WHERE id IN (${placeholders})`, ids, (err, rows) => {
    db.close();
    if (err) return res.status(500).send('DB error');
    let total = 0;
    const items = rows.map(r => {
      const qty = cart[r.id] || 0;
      total += qty * r.price;
      return { ...r, qty, subtotal: qty * r.price };
    });
    res.render('cart', { items, total });
  });
});

app.post('/checkout', (req, res) => {
  // Mock checkout: clear cart
  req.session.cart = {};
  req.session.save(() => res.render('checkout'));
});

// Simple API to list products (json)
app.get('/api/products', (req, res) => {
  const db = openDb();
  db.all('SELECT * FROM products WHERE active=1', (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: true });
    res.json(rows);
  });
});

// Start
app.listen(port, () => console.log(`MilfShakes demo listening on http://localhost:${port}`));
