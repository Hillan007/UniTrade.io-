const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Registration API
app.post('/register', (req, res) => {
    console.log("Request received:", req.body);

    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Password hashing error:", err);
            return res.status(500).json({ error: "Password hashing failed!" });
        }

        db.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            function (err) {
                if (err) {
                    console.error("Database error:", err.message);
                    return res.status(500).json({ error: "Registration failed!" });
                }
                console.log("User registered with ID:", this.lastID);
                res.json({ message: "Registration successful!", userId: this.lastID });
            }
        );
    });
});

// Create tables and seed initial data
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      name TEXT,
      description TEXT,
      price INTEGER,
      image TEXT
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      FOREIGN KEY (item_id) REFERENCES items(id)
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      purchase_date TEXT,
      FOREIGN KEY (item_id) REFERENCES items(id)
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
  `);

  // Seed initial items if the table is empty
  db.get("SELECT COUNT(*) as count FROM items", (err, row) => {
    if (row.count === 0) {
      const items = [
        ['furniture', 'Elegant Wooden Dining Table', 'Timeless design and modern craftsmanship', 12000, '/Images/dining table.jpeg'],
        ['furniture', 'Cozy Comfort Armchair', 'Style and comfort for your living space', 5500, '/Images/armchair.jpeg'],
        ['furniture', 'Modern Bookshelf', 'Sleek storage for your books', 8000, '/Images/bookshelf.jpeg'],
        ['electronics', 'Laptop', 'Latest tech with top updates', 45000, '/Images/laptop.jpeg'],
        ['electronics', 'Stylish Desk Lamp', 'Perfect lighting for study or work', 2500, '/Images/desk lamp.jpeg'],
        ['electronics', 'Wireless Headphones', 'High-quality sound on the go', 3800, '/Images/headphones.jpeg'],
        ['clothing', 'Leather Jacket', 'Stylish and durable outerwear', 4200, '/Images/jacket.jpeg'],
        ['clothing', 'Trendy Sneakers', 'Comfortable and fashionable', 3000, '/Images/sneakers.jpeg'],
        ['foodstuffs', 'Premium Coffee', 'Rich and aromatic blend', 800, '/Images/coffee.jpeg'],
        ['foodstuffs', 'Snack Pack', 'Assorted treats for study breaks', 1200, '/Images/snacks.jpeg']
      ];
      const stmt = db.prepare("INSERT INTO items (category, name, description, price, image) VALUES (?, ?, ?, ?, ?)");
      items.forEach(item => stmt.run(item));
      stmt.finalize();
      console.log('Initial items seeded');
    }
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Unitrade API!');
});

app.get('/api/items', (req, res) => {
  db.all("SELECT * FROM items", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/cart', (req, res) => {
  const { item_id } = req.body;
  db.run("INSERT INTO cart (item_id) VALUES (?)", [item_id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ id: this.lastID });
  });
});

app.get('/api/cart', (req, res) => {
  db.all("SELECT cart.id, items.name, items.price FROM cart JOIN items ON cart.item_id = items.id", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cart WHERE id = ?", [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

app.post('/api/purchase', (req, res) => {
  db.all("SELECT item_id FROM cart", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    const date = new Date().toISOString();
    const stmt = db.prepare("INSERT INTO purchases (item_id, purchase_date) VALUES (?, ?)");
    rows.forEach(row => stmt.run([row.item_id, date]));
    stmt.finalize();
    db.run("DELETE FROM cart", (err) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: 'Purchase successful' });
    });
  });
});

app.get('/api/purchases', (req, res) => {
  db.all("SELECT purchases.id, items.name, items.price, purchases.purchase_date FROM purchases JOIN items ON purchases.item_id = items.id", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



