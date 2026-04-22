const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'shop.db'));

// Active le WAL mode pour de meilleures performances
db.pragma('journal_mode = WAL');

// ── Wrappers Promise pour compatibilité avec index.js ──
// better-sqlite3 est synchrone, on wrappe pour garder l'API async existante
db.get2 = (sql, params = []) => {
  try {
    return Promise.resolve(db.prepare(sql).get(...params));
  } catch (e) {
    return Promise.reject(e);
  }
};

db.all2 = (sql, params = []) => {
  try {
    return Promise.resolve(db.prepare(sql).all(...params));
  } catch (e) {
    return Promise.reject(e);
  }
};

db.run2 = (sql, params = []) => {
  try {
    const info = db.prepare(sql).run(...params);
    return Promise.resolve({ lastID: info.lastInsertRowid, changes: info.changes });
  } catch (e) {
    return Promise.reject(e);
  }
};

// ── Création des tables ──
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  role TEXT DEFAULT 'user', last_seen DATETIME,
  points INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, description TEXT, price REAL NOT NULL,
  original_price REAL DEFAULT 0, stock INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Accessoires', image TEXT DEFAULT '/img/default.jpg',
  images TEXT DEFAULT '[]',
  featured INTEGER DEFAULT 0, active INTEGER DEFAULT 1,
  flash_sale INTEGER DEFAULT 0, flash_price REAL DEFAULT 0, flash_end DATETIME,
  weight REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER, email TEXT NOT NULL, name TEXT NOT NULL,
  total REAL NOT NULL, status TEXT DEFAULT 'en_attente',
  stripe_session_id TEXT, promo_code TEXT, discount REAL DEFAULT 0,
  notes TEXT, tracking_number TEXT, shipping_method TEXT,
  address TEXT, city TEXT, zip TEXT, country TEXT, phone TEXT,
  points_earned INTEGER DEFAULT 0, points_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
  name TEXT NOT NULL, price REAL NOT NULL, quantity INTEGER NOT NULL
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS site_content (key TEXT PRIMARY KEY, value TEXT NOT NULL)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER, user_name TEXT NOT NULL, user_email TEXT NOT NULL,
  subject TEXT NOT NULL, message TEXT NOT NULL,
  status TEXT DEFAULT 'ouvert', admin_reply TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS promo_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, type TEXT DEFAULT 'percent',
  value REAL NOT NULL, uses_left INTEGER DEFAULT -1,
  active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL, user_id INTEGER NOT NULL,
  user_name TEXT NOT NULL, rating INTEGER NOT NULL,
  comment TEXT, approved INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, label TEXT DEFAULT 'Maison',
  firstname TEXT, lastname TEXT, address TEXT, zip TEXT,
  city TEXT, country TEXT DEFAULT 'Suisse', phone TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS stock_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
  email TEXT NOT NULL, notified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS points_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, points INTEGER NOT NULL,
  reason TEXT, order_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL, url TEXT NOT NULL,
  position INTEGER DEFAULT 0
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER, action TEXT NOT NULL, details TEXT,
  ip TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL, active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

// ── Migrations — colonnes ajoutées après la création initiale ──
// better-sqlite3 lance une exception si la colonne existe déjà, on ignore
const migrations = [
  `ALTER TABLE products ADD COLUMN flash_sale INTEGER DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN flash_price REAL DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN flash_end DATETIME`,
  `ALTER TABLE products ADD COLUMN original_price REAL DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN weight REAL DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]'`,
  `ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN referral_code TEXT`,
  `ALTER TABLE users ADD COLUMN referred_by INTEGER`,
  `ALTER TABLE orders ADD COLUMN tracking_number TEXT`,
  `ALTER TABLE orders ADD COLUMN shipping_method TEXT`,
  `ALTER TABLE orders ADD COLUMN address TEXT`,
  `ALTER TABLE orders ADD COLUMN city TEXT`,
  `ALTER TABLE orders ADD COLUMN zip TEXT`,
  `ALTER TABLE orders ADD COLUMN country TEXT`,
  `ALTER TABLE orders ADD COLUMN phone TEXT`,
  `ALTER TABLE orders ADD COLUMN points_earned INTEGER DEFAULT 0`,
  `ALTER TABLE orders ADD COLUMN points_used INTEGER DEFAULT 0`,
];

for (const sql of migrations) {
  try { db.prepare(sql).run(); } catch (_) { /* colonne déjà présente */ }
}

function generateReferralCode(name) {
  const base = name.replace(/\s+/g, '').toUpperCase().substring(0, 4);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return base + rand;
}

async function seed() {
  const admin = await db.get2('SELECT id FROM users WHERE email = ?', ['admin@admin.com']);
  if (!admin) {
    const hash = bcrypt.hashSync('admin123', 10);
    const code = generateReferralCode('Admin');
    await db.run2('INSERT INTO users (name, email, password, role, referral_code) VALUES (?, ?, ?, ?, ?)', ['Admin', 'admin@admin.com', hash, 'admin', code]);
    console.log('✅ Admin créé: admin@admin.com / admin123');
  }

  const count = await db.get2('SELECT COUNT(*) as c FROM products');
  if (count.c === 0) {
    const products = [
      ['Canne Spinning Pro 2.4m', 'Canne légère carbone haute modulus, idéale carnassiers. Action fast, sensibilité maximale.', 89.99, 15, 'Cannes', '/img/canne1.jpg', 1],
      ['Canne Télescopique Lake 3m', 'Polyvalente et transportable. Parfaite pour la pêche au coup en bord de lac.', 49.99, 22, 'Cannes', '/img/canne2.jpg', 0],
      ['Moulinet Daiwa Freams 2500', 'Moulinet spinning haut de gamme, roulement 6+1, récupération 90cm/tour.', 129.99, 8, 'Moulinets', '/img/moulinet1.jpg', 1],
      ['Moulinet Shimano Sienna 1000', 'Entrée de gamme fiable, idéal débutant. Anti-retour instantané.', 39.99, 30, 'Moulinets', '/img/moulinet2.jpg', 0],
      ['Leurre Shad 12cm — Pack 5', 'Shad souple imitation poisson. Idéal brochet et sandre. Pack de 5 coloris assortis.', 14.99, 50, 'Leurres', '/img/leurre1.jpg', 1],
      ['Popper Surface 7cm', 'Leurre dur topwater. Action explosive en surface. Coloris grenouille.', 12.99, 35, 'Leurres', '/img/leurre2.jpg', 0],
      ['Swimbait Articulé 18cm', 'Leurre dur articulé à nage réaliste. Pour gros brochets.', 22.99, 18, 'Leurres', '/img/leurre3.jpg', 1],
      ['Boîte à leurres XL 30 cases', 'Boîte rangement waterproof, 30 compartiments réglables.', 18.99, 40, 'Accessoires', '/img/boite.jpg', 0],
      ['Gilet de pêche 8 poches', 'Gilet multi-poches imperméable, léger, respirant. Tailles S à XXL.', 59.99, 12, 'Accessoires', '/img/gilet.jpg', 1],
      ['Hameçons Owner Treble — Pack 20', 'Hameçons triples ultra-aiguisés Owner. Calibre 4.', 8.99, 100, 'Accessoires', '/img/hamecons.jpg', 0],
      ['Fluorocarbone 0.28mm 150m', 'Fil fluorocarbone quasi-invisible. 150m, résistance 6.2kg.', 19.99, 45, 'Accessoires', '/img/fil.jpg', 0],
      ['Épuisette carbone télescopique', 'Épuisette carbone légère, manche 2m télescopique.', 34.99, 20, 'Accessoires', '/img/epuisette.jpg', 0],
    ];
    for (const p of products) {
      await db.run2('INSERT INTO products (name, description, price, stock, category, image, featured) VALUES (?, ?, ?, ?, ?, ?, ?)', p);
    }
    console.log('✅ 12 produits insérés');
  }

  const content = await db.get2('SELECT key FROM site_content WHERE key = ?', ['hero_title']);
  if (!content) {
    const items = [
      ['hero_title', 'La pêche, une passion qui se vit'],
      ['hero_subtitle', 'Matériel expert pour pêcheurs passionnés — Livraison rapide, qualité garantie'],
      ['hero_cta', 'Voir le catalogue'],
      ['about_text', 'Depuis 2010, nous équipons les pêcheurs passionnés avec le meilleur matériel.'],
      ['banner_text', '🎣 Livraison gratuite dès 50 CHF d\'achat !'],
      ['banner_active', '1'],
    ];
    for (const [k, v] of items) await db.run2('INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)', [k, v]);
    console.log('✅ Contenu inséré');
  }

  // Referral codes pour users existants sans code
  const usersWithoutCode = await db.all2('SELECT id, name FROM users WHERE referral_code IS NULL OR referral_code = ""');
  for (const u of usersWithoutCode) {
    const code = generateReferralCode(u.name);
    await db.run2('UPDATE users SET referral_code = ? WHERE id = ?', [code, u.id]).catch(() => {});
  }
}

db.generateReferralCode = generateReferralCode;
seed().catch(console.error);
module.exports = db;