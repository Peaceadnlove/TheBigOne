require('dotenv').config();
require('./keep_alive');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Auto-create required directories ──
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const db = require('./database');
const V = require('./views');

// ── SQLite session store (persists across restarts) ──
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 3000;

let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_VOTRE_CLE_ICI') {
  try { stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); } catch(e) {}
}

// Brevo email
async function sendEmail(to, subject, html) {
  if (!process.env.BREVO_API_KEY) return;
  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'PêchePro', email: process.env.BREVO_FROM_EMAIL || 'noreply@pechepro.fr' },
        to: [{ email: to }],
        subject, htmlContent: html
      })
    });
  } catch(e) { console.log('Email error:', e.message); }
}

function emailOrderConfirm(order, items) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:16px;overflow:hidden">
    <div style="background:#00ff87;padding:2rem;text-align:center">
      <h1 style="color:#000;margin:0;font-size:1.5rem">🎣 PêchePro</h1>
      <p style="color:#000;margin:.5rem 0 0;font-size:.9rem">Commande confirmée !</p>
    </div>
    <div style="padding:2rem">
      <h2 style="color:#00ff87">Merci ${order.name.split(' ')[0]} ! 🎉</h2>
      <p style="color:#aaa">Ta commande <strong style="color:#fff">#${order.id}</strong> a bien été reçue.</p>
      <div style="background:#111;border-radius:12px;padding:1.25rem;margin:1.5rem 0">
        ${items.map(i => `<div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid #222"><span style="color:#aaa">${i.name} x${i.quantity}</span><span style="color:#00ff87;font-weight:700">${(i.price*i.quantity).toFixed(2)} CHF</span></div>`).join('')}
        ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:.4rem 0"><span style="color:#aaa">Réduction</span><span style="color:#00ff87">-${order.discount.toFixed(2)} CHF</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;padding:.75rem 0 0;font-weight:700;font-size:1.1rem"><span>Total</span><span style="color:#00ff87">${order.total.toFixed(2)} CHF</span></div>
      </div>
      <p style="color:#aaa;font-size:.875rem">Tu recevras un email dès que ta commande est expédiée avec ton numéro de suivi.</p>
      <div style="text-align:center;margin-top:2rem">
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/compte" style="background:#00ff87;color:#000;padding:.8rem 2rem;border-radius:10px;text-decoration:none;font-weight:700">Voir ma commande →</a>
      </div>
    </div>
    <div style="padding:1rem 2rem;text-align:center;color:#444;font-size:.75rem;border-top:1px solid #222">PêchePro — Fait avec passion 🎣</div>
  </div>`;
}

function emailShipped(order) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:16px;overflow:hidden">
    <div style="background:#0096ff;padding:2rem;text-align:center">
      <h1 style="color:#fff;margin:0">📦 Commande expédiée !</h1>
    </div>
    <div style="padding:2rem">
      <h2 style="color:#0096ff">C'est parti ${order.name.split(' ')[0]} !</h2>
      <p style="color:#aaa">Ta commande <strong style="color:#fff">#${order.id}</strong> est en route.</p>
      ${order.tracking_number ? `<div style="background:#111;border-radius:12px;padding:1.25rem;margin:1.5rem 0;text-align:center"><p style="color:#aaa;margin:0 0 .5rem">Numéro de suivi</p><p style="font-size:1.5rem;font-weight:700;color:#0096ff;margin:0;letter-spacing:.1em">${order.tracking_number}</p></div>` : ''}
      <div style="text-align:center;margin-top:2rem">
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/commande/${order.id}" style="background:#0096ff;color:#fff;padding:.8rem 2rem;border-radius:10px;text-decoration:none;font-weight:700">Suivre ma commande →</a>
      </div>
    </div>
  </div>`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).substr(2,6) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: __dirname }),
  secret: process.env.SESSION_SECRET || 'pechepro_secret_2024',
  resave: false, saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(async (req, res, next) => {
  if (req.session.user) {
    await db.run2('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?', [req.session.user.id]).catch(()=>{});
  }
  next();
});

function setFlash(req, msg, type = 'success') {
  req.session.flash = req.session.flash || [];
  req.session.flash.push({ msg, type });
}
function requireAuth(req, res, next) {
  if (!req.session.user) { setFlash(req, 'Connecte-toi pour continuer', 'error'); return res.redirect('/login'); }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/admin/login');
  next();
}
async function getCartItems(req) {
  const cart = req.session.cart || {};
  const items = [];
  for (const [id, qty] of Object.entries(cart)) {
    const p = await db.get2('SELECT * FROM products WHERE id = ?', [parseInt(id)]);
    if (p) items.push({ ...p, qty });
  }
  return items;
}
async function getContent() {
  const rows = await db.all2('SELECT key, value FROM site_content');
  return Object.fromEntries((rows || []).map(r => [r.key, r.value]));
}
function generateReferralCode() {
  return 'PECHE' + Math.random().toString(36).substr(2, 6).toUpperCase();
}


// ── DB MIGRATIONS NOUVELLES TABLES ──
async function runMigrations() {
  const newTables = [
    `CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, content TEXT NOT NULL, excerpt TEXT DEFAULT '',
      image_url TEXT DEFAULT '', author TEXT DEFAULT 'Admin',
      published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS forum_threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL,
      category TEXT DEFAULT 'Général', views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS forum_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id INTEGER NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ];
  const userCols = [
    'ALTER TABLE users ADD COLUMN premium INTEGER DEFAULT 0',
    'ALTER TABLE users ADD COLUMN premium_until DATETIME',
  ];
  for (const sql of newTables) await db.run2(sql).catch(()=>{});
  for (const sql of userCols) await db.run2(sql).catch(()=>{});
  console.log('✅ Migrations OK');
}
runMigrations();

// ── HOMEPAGE ──
app.get('/', async (req, res) => {
  try {
    const products = await db.all2('SELECT * FROM products WHERE active = 1');
    const content = await getContent();
    const flashSales = await db.all2("SELECT * FROM products WHERE flash_sale = 1 AND active = 1 AND (flash_end IS NULL OR flash_end > datetime('now'))");
    res.send(V.home(req, req.session.user, products, content, flashSales));
  } catch(e) { console.error(e); res.send('Erreur serveur'); }
});

// ── CATALOGUE ──
app.get('/catalogue', async (req, res) => {
  try {
    const { cat, search, min, max, sort } = req.query;
    let query = 'SELECT * FROM products WHERE active = 1';
    const params = [];
    if (cat) { query += ' AND category = ?'; params.push(cat); }
    if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (min) { query += ' AND price >= ?'; params.push(parseFloat(min)); }
    if (max) { query += ' AND price <= ?'; params.push(parseFloat(max)); }
    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else if (sort === 'newest') query += ' ORDER BY created_at DESC';
    else query += ' ORDER BY featured DESC, name ASC';
    const products = await db.all2(query, params);
    const wishlist = req.session.user ? (await db.all2('SELECT product_id FROM wishlist WHERE user_id = ?', [req.session.user.id])).map(w => w.product_id) : [];
    res.send(V.catalogue(req, req.session.user, products, cat, search, min, max, sort, wishlist));
  } catch(e) { console.error(e); res.send('Erreur serveur'); }
});

// ── PRODUIT ──
app.get('/produit/:id', async (req, res) => {
  try {
    const p = await db.get2('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!p) return res.redirect('/catalogue');
    p.images = JSON.parse(p.images || '[]');
    const reviews = await db.all2('SELECT * FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY created_at DESC', [req.params.id]);
    const avgRating = reviews.length ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1) : null;
    const related = await db.all2('SELECT * FROM products WHERE category = ? AND id != ? AND active = 1 LIMIT 4', [p.category, p.id]);
    const inWishlist = req.session.user ? !!(await db.get2('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.session.user.id, p.id])) : false;
    const alertExists = req.session.user && p.stock === 0 ? !!(await db.get2('SELECT id FROM stock_alerts WHERE email = ? AND product_id = ?', [req.session.user.email, p.id])) : false;
    res.send(V.product(req, req.session.user, p, reviews, avgRating, related, inWishlist, alertExists));
  } catch(e) { console.error(e); res.redirect('/catalogue'); }
});

// ── AVIS ──
app.post('/produit/:id/avis', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await db.get2('SELECT id FROM reviews WHERE product_id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    if (existing) { setFlash(req, 'Tu as déjà laissé un avis', 'error'); return res.redirect(`/produit/${req.params.id}`); }
    await db.run2('INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.session.user.id, req.session.user.name, parseInt(rating), comment || '']);
    setFlash(req, 'Avis soumis — en attente de modération 👍');
    res.redirect(`/produit/${req.params.id}`);
  } catch(e) { res.redirect(`/produit/${req.params.id}`); }
});

// ── WISHLIST ──
app.post('/wishlist/toggle', requireAuth, async (req, res) => {
  try {
    const { product_id } = req.body;
    const existing = await db.get2('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.session.user.id, product_id]);
    if (existing) {
      await db.run2('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.session.user.id, product_id]);
    } else {
      await db.run2('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.session.user.id, product_id]);
    }
    res.redirect('back');
  } catch(e) { res.redirect('back'); }
});

app.get('/wishlist', requireAuth, async (req, res) => {
  try {
    const items = await db.all2(`SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE w.user_id = ? AND p.active = 1`, [req.session.user.id]);
    res.send(V.wishlist(req, req.session.user, items));
  } catch(e) { res.redirect('/compte'); }
});

// ── ALERTE STOCK ──
app.post('/alerte-stock', requireAuth, async (req, res) => {
  try {
    const { product_id } = req.body;
    await db.run2('INSERT OR IGNORE INTO stock_alerts (user_id, email, product_id) VALUES (?, ?, ?)',
      [req.session.user.id, req.session.user.email, product_id]);
    setFlash(req, 'Tu seras alerté dès que le produit est de nouveau disponible 🔔');
    res.redirect('back');
  } catch(e) { res.redirect('back'); }
});

// ── NEWSLETTER ──
app.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    await db.run2('INSERT OR IGNORE INTO newsletter (email) VALUES (?)', [email.trim().toLowerCase()]);
    setFlash(req, 'Inscription à la newsletter confirmée ! 📧');
    res.redirect('back');
  } catch(e) { res.redirect('back'); }
});

// ── PARRAINAGE ──
app.get('/parrainage', requireAuth, async (req, res) => {
  try {
    const user = await db.get2('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    if (!user.referral_code) {
      const code = generateReferralCode();
      await db.run2('UPDATE users SET referral_code = ? WHERE id = ?', [code, user.id]);
      user.referral_code = code;
    }
    const referrals = await db.all2('SELECT name, created_at FROM users WHERE referred_by = ?', [user.id]);
    const pointsHistory = await db.all2('SELECT * FROM points_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [user.id]);
    res.send(V.parrainage(req, req.session.user, user, referrals, pointsHistory));
  } catch(e) { res.redirect('/compte'); }
});

// ── FACTURE ──
app.get('/facture/:id', async (req, res) => {
  try {
    const order = await db.get2('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).send('Introuvable');
    const user = req.session.user;
    if (!user || (user.id !== order.user_id && user.role !== 'admin')) return res.redirect('/login');
    const items = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.send(V.facture(order, items));
  } catch(e) { res.redirect('/'); }
});

// ── SUIVI COMMANDE ──
app.get('/commande/:id', requireAuth, async (req, res) => {
  try {
    const order = await db.get2('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    if (!order) return res.redirect('/compte');
    const items = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.send(V.suiviCommande(req, req.session.user, order, items));
  } catch(e) { res.redirect('/compte'); }
});

// ── AUTH ──
app.get('/login', (req, res) => { if (req.session.user) return res.redirect('/'); res.send(V.login(req)); });
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get2('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      setFlash(req, 'Email ou mot de passe incorrect', 'error');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.redirect(user.role === 'admin' ? '/admin' : '/');
  } catch(e) { res.redirect('/login'); }
});

app.get('/register', (req, res) => { if (req.session.user) return res.redirect('/'); res.send(V.register(req)); });
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, referral } = req.body;
    if (!name || !email || !password || password.length < 6) {
      setFlash(req, 'Tous les champs requis (mot de passe min. 6 caractères)', 'error');
      return res.redirect('/register');
    }
    if (await db.get2('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()])) {
      setFlash(req, 'Email déjà utilisé', 'error');
      return res.redirect('/register');
    }
    const hash = bcrypt.hashSync(password, 10);
    const refCode = generateReferralCode();
    let referredBy = null;
    if (referral) {
      const referrer = await db.get2('SELECT id FROM users WHERE referral_code = ?', [referral.toUpperCase().trim()]);
      if (referrer) {
        referredBy = referrer.id;
        await db.run2('UPDATE users SET points = points + 50 WHERE id = ?', [referrer.id]);
        await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [referrer.id, 50, 'Parrainage réussi']);
      }
    }
    const result = await db.run2('INSERT INTO users (name, email, password, referral_code, referred_by) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hash, refCode, referredBy]);
    await db.run2('UPDATE users SET points = 10 WHERE id = ?', [result.lastID]);
    await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [result.lastID, 10, 'Bienvenue sur PêchePro !']);
    req.session.user = { id: result.lastID, name: name.trim(), email: email.trim().toLowerCase(), role: 'user' };
    if (req.body.newsletter) await db.run2('INSERT OR IGNORE INTO newsletter (email) VALUES (?)', [email.trim().toLowerCase()]).catch(()=>{});
    setFlash(req, `Bienvenue ${name} ! 🎣 Tu as reçu 10 points de bienvenue !`);
    res.redirect('/');
  } catch(e) { console.error(e); res.redirect('/register'); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

// ── COMPTE ──
app.get('/compte', requireAuth, async (req, res) => {
  try {
    const user = await db.get2('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    if (!user) { req.session.destroy(); return res.redirect('/login'); }
    // Sync session points
    req.session.user.points = user.points;
    const orders = await db.all2('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [user.id]);
    const tickets = await db.all2('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC', [user.id]);
    const addresses = await db.all2('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [user.id]);
    const wishlistCount = (await db.get2('SELECT COUNT(*) as c FROM wishlist WHERE user_id = ?', [user.id])).c;
    res.send(V.compte(req, user, orders, tickets, addresses, wishlistCount));
  } catch(e) { console.error(e); res.redirect('/'); }
});

// ── ADRESSES ──
app.post('/compte/adresse', requireAuth, async (req, res) => {
  try {
    const { label, firstname, lastname, phone, address, zip, city, country, is_default } = req.body;
    if (is_default) await db.run2('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.session.user.id]);
    await db.run2('INSERT INTO addresses (user_id, label, firstname, lastname, phone, address, zip, city, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.session.user.id, label || 'Maison', firstname, lastname, phone, address, zip, city, country || 'Suisse', is_default ? 1 : 0]);
    setFlash(req, 'Adresse ajoutée !');
    res.redirect('/compte');
  } catch(e) { res.redirect('/compte'); }
});

app.post('/compte/adresse/:id/supprimer', requireAuth, async (req, res) => {
  try {
    await db.run2('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    setFlash(req, 'Adresse supprimée');
    res.redirect('/compte');
  } catch(e) { res.redirect('/compte'); }
});

// ── PANIER ──
app.get('/panier', async (req, res) => {
  try { res.send(V.panier(req, req.session.user, await getCartItems(req))); }
  catch(e) { res.redirect('/'); }
});
app.post('/panier/ajouter', async (req, res) => {
  try {
    const { product_id, qty = 1 } = req.body;
    const p = await db.get2('SELECT * FROM products WHERE id = ? AND active = 1', [parseInt(product_id)]);
    if (!p || p.stock < 1) { setFlash(req, 'Produit indisponible', 'error'); return res.redirect('back'); }
    const cart = req.session.cart || {};
    cart[product_id] = Math.min((cart[product_id] || 0) + parseInt(qty), p.stock);
    req.session.cart = cart;
    setFlash(req, `${p.name} ajouté ! 🛒`);
    res.redirect('/panier');
  } catch(e) { res.redirect('/catalogue'); }
});
app.post('/panier/update', (req, res) => {
  const { product_id, qty } = req.body;
  const cart = req.session.cart || {};
  const q = parseInt(qty);
  if (q < 1) delete cart[product_id];
  else cart[product_id] = q;
  req.session.cart = cart;
  res.redirect('/panier');
});
app.post('/panier/supprimer', (req, res) => {
  const cart = req.session.cart || {};
  delete cart[req.body.product_id];
  req.session.cart = cart;
  res.redirect('/panier');
});

// ── PROMO ──
app.post('/panier/promo', async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await db.get2('SELECT * FROM promo_codes WHERE code = ? AND active = 1', [code.toUpperCase().trim()]);
    if (!promo) { setFlash(req, 'Code invalide ou expiré', 'error'); return res.redirect('/panier'); }
    if (promo.uses_left === 0) { setFlash(req, 'Code épuisé', 'error'); return res.redirect('/panier'); }
    req.session.promo = { code: promo.code, type: promo.type, value: promo.value, id: promo.id };
    setFlash(req, `Code "${promo.code}" appliqué ! 🎉`);
    res.redirect('/panier');
  } catch(e) { res.redirect('/panier'); }
});
app.post('/panier/promo/supprimer', (req, res) => { req.session.promo = null; res.redirect('/panier'); });

// ── UTILISER POINTS ──
app.post('/panier/points', requireAuth, async (req, res) => {
  try {
    const user = await db.get2('SELECT points FROM users WHERE id = ?', [req.session.user.id]);
    if (user.points >= 100) {
      req.session.usePoints = true;
      setFlash(req, `${user.points} points utilisés → -${(Math.floor(user.points/100)*5).toFixed(2)} CHF 🎯`);
    } else {
      setFlash(req, 'Il te faut au moins 100 points pour les utiliser', 'error');
    }
    res.redirect('/panier');
  } catch(e) { res.redirect('/panier'); }
});
app.post('/panier/points/annuler', (req, res) => { req.session.usePoints = false; res.redirect('/panier'); });

// ── CHECKOUT ──
app.get('/checkout', requireAuth, async (req, res) => {
  try {
    const items = await getCartItems(req);
    if (!items.length) return res.redirect('/panier');
    const promo = req.session.promo || null;
    const user = await db.get2('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    const addresses = await db.all2('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.session.user.id]);
    let total = items.reduce((s, i) => s + i.price * i.qty, 0);
    let discount = 0;
    if (promo) { discount = promo.type === 'percent' ? total * promo.value / 100 : promo.value; discount = Math.min(discount, total); }
    let pointsDiscount = 0;
    if (req.session.usePoints && user.points >= 100) { pointsDiscount = Math.floor(user.points / 100) * 5; }
    total = total - discount - pointsDiscount;
    res.send(V.checkout(req, req.session.user, items, promo, discount, total, addresses, user, pointsDiscount));
  } catch(e) { console.error(e); res.redirect('/panier'); }
});

app.post('/checkout', requireAuth, async (req, res) => {
  try {
    console.log('[CHECKOUT] session user:', req.session.user);
    const items = await getCartItems(req);
    if (!items.length) return res.redirect('/panier');
    const { firstname, lastname, email, phone, address, zip, city, country, delivery_note, shipping } = req.body;
    if (!firstname || !lastname || !address || !zip || !city || !phone) {
      setFlash(req, 'Veuillez remplir tous les champs obligatoires', 'error');
      return res.redirect('/checkout');
    }
    const promo = req.session.promo || null;
    const shippingCosts = { standard: 0, express: 4.99, overnight: 9.99 };
    const shippingCost = shippingCosts[shipping] || 0;
    const shippingLabel = { standard: 'Standard', express: 'Express', overnight: 'Nuit' }[shipping] || 'Standard';
    let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    let discount = 0;
    if (promo) { discount = promo.type === 'percent' ? subtotal * promo.value / 100 : promo.value; discount = Math.min(discount, subtotal); }
    if (!req.session.user || !req.session.user.id) {
      setFlash(req, 'Session expirée, reconnecte-toi', 'error');
      return res.redirect('/login');
    }
    const user = await db.get2('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    if (!user) {
      setFlash(req, 'Compte introuvable, reconnecte-toi', 'error');
      return res.redirect('/login');
    }
    console.log('[CHECKOUT] user from DB:', user.id, user.email);
    let pointsDiscount = 0;
    if (req.session.usePoints && user.points >= 100) { pointsDiscount = Math.floor(user.points / 100) * 5; }
    let total = subtotal - discount - pointsDiscount + shippingCost;
    const fullName = `${firstname} ${lastname}`;
    const notes = `Tel: ${phone} | ${shippingLabel} (+${shippingCost} CHF) | ${address}, ${zip} ${city}, ${country}${delivery_note ? ' | Note: ' + delivery_note : ''}`;

    if (!stripe) {
      // Points utilisés (avant calcul gagnés pour ne pas compter deux fois)
      const pointsUsed = (req.session.usePoints && user.points >= 100) ? user.points : 0;
      // Points gagnés = 1 par CHF payé (après réductions)
      const pointsEarned = Math.floor(total);

      const result = await db.run2(
        'INSERT INTO orders (user_id, email, name, total, status, stripe_session_id, promo_code, discount, notes, shipping_method, points_earned, points_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, email, fullName, total, 'payé', 'demo_' + Date.now(), promo?.code || null, discount + pointsDiscount, notes, shippingLabel, pointsEarned, pointsUsed]
      );

      // Insérer articles ET décrémenter stock
      for (const i of items) {
        await db.run2('INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)', [result.lastID, i.id, i.name, i.price, i.qty]);
        await db.run2('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', [i.qty, i.id]);
      }

      // Décrémenter utilisations promo
      if (promo && promo.uses_left > 0) await db.run2('UPDATE promo_codes SET uses_left = uses_left - 1 WHERE id = ?', [promo.id]);

      // 1. Déduire les points utilisés EN PREMIER
      if (pointsUsed > 0) {
        await db.run2('UPDATE users SET points = MAX(0, points - ?) WHERE id = ?', [pointsUsed, user.id]);
        await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [user.id, -pointsUsed, 'Points utilisés — commande #' + result.lastID]);
      }

      // 2. Créditer les points gagnés APRÈS
      await db.run2('UPDATE users SET points = points + ? WHERE id = ?', [pointsEarned, user.id]);
      await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [user.id, pointsEarned, `Achat — commande #${result.lastID}`]);

      // 3. Synchroniser la session
      const updatedUser = await db.get2('SELECT points FROM users WHERE id = ?', [user.id]);
      if (req.session.user) req.session.user.points = updatedUser.points;

      req.session.cart = {}; req.session.promo = null; req.session.usePoints = false;
      const order = await db.get2('SELECT * FROM orders WHERE id = ?', [result.lastID]);
      const orderItems = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [result.lastID]);
      await sendEmail(email, `Commande #${result.lastID} confirmée — PêchePro`, emailOrderConfirm(order, orderItems));
      return res.redirect('/success?order_id=' + result.lastID);
    }

    const lineItems = items.map(i => ({ price_data: { currency: 'chf', product_data: { name: i.name }, unit_amount: Math.round(i.price * 100) }, quantity: i.qty }));
    if (shippingCost > 0) lineItems.push({ price_data: { currency: 'chf', product_data: { name: `Livraison ${shippingLabel}` }, unit_amount: Math.round(shippingCost * 100) }, quantity: 1 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      discounts: promo && discount > 0 ? [{ coupon: (await stripe.coupons.create({ amount_off: Math.round((discount + pointsDiscount) * 100), currency: 'chf', duration: 'once', name: promo?.code || 'Points' })).id }] : [],
      success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout`,
      metadata: {
        user_id: user.id.toString(), cart: JSON.stringify(Object.fromEntries(items.map(i => [i.id, i.qty]))),
        promo: JSON.stringify(promo), fullName, email, notes, total: total.toString(),
        discount: (discount + pointsDiscount).toString(), shippingLabel, usePoints: req.session.usePoints ? user.points.toString() : '0'
      }
    });
    res.redirect(session.url);
  } catch(e) { console.error('[CHECKOUT ERROR]', e); setFlash(req, 'Erreur: ' + e.message, 'error'); res.redirect('/checkout'); }
});

// ── SUCCESS ──
app.get('/success', async (req, res) => {
  try {
    let order, items;
    if (req.query.order_id) {
      order = await db.get2('SELECT * FROM orders WHERE id = ?', [req.query.order_id]);
      items = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    } else if (req.query.session_id && stripe) {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      if (session.payment_status !== 'paid') return res.redirect('/panier');
      const existing = await db.get2('SELECT * FROM orders WHERE stripe_session_id = ?', [session.id]);
      if (existing) { order = existing; items = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [order.id]); }
      else {
        const meta = session.metadata || {};
        const cartData = JSON.parse(meta.cart || '{}');
        const promo = JSON.parse(meta.promo || 'null');
        const orderItems = [];
        for (const [pid, qty] of Object.entries(cartData)) {
          const p = await db.get2('SELECT * FROM products WHERE id = ?', [parseInt(pid)]);
          if (p) orderItems.push({ ...p, qty: parseInt(qty) });
        }
        const stripeTotal = parseFloat(meta.total||0);
        const stripePointsEarned = Math.floor(stripeTotal);
        const stripePointsUsed = parseInt(meta.usePoints||0);

        const result = await db.run2(
          'INSERT INTO orders (user_id, email, name, total, status, stripe_session_id, promo_code, discount, notes, shipping_method, points_earned, points_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [parseInt(meta.user_id)||null, meta.email||session.customer_email, meta.fullName||session.customer_details?.name||'Client', stripeTotal, 'payé', session.id, promo?.code||null, parseFloat(meta.discount||0), meta.notes||'', meta.shippingLabel||'', stripePointsEarned, stripePointsUsed]
        );
        order = await db.get2('SELECT * FROM orders WHERE id = ?', [result.lastID]);
        for (const i of orderItems) {
          await db.run2('INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)', [order.id, i.id, i.name, i.price, i.qty]);
          await db.run2('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', [i.qty, i.id]);
        }
        items = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        if (meta.user_id) {
          const uid = parseInt(meta.user_id);
          // 1. Déduire les points utilisés EN PREMIER
          if (stripePointsUsed > 0) {
            await db.run2('UPDATE users SET points = MAX(0, points - ?) WHERE id = ?', [stripePointsUsed, uid]);
            await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [uid, -stripePointsUsed, 'Points utilisés — commande #' + order.id]);
          }
          // 2. Créditer les points gagnés APRÈS
          await db.run2('UPDATE users SET points = points + ? WHERE id = ?', [stripePointsEarned, uid]);
          await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [uid, stripePointsEarned, 'Achat — commande #' + order.id]);
          // 3. Sync session
          const updatedUser = await db.get2('SELECT points FROM users WHERE id = ?', [uid]);
          if (req.session.user && req.session.user.id === uid) req.session.user.points = updatedUser.points;
        }
        await sendEmail(meta.email||session.customer_email, 'Commande #' + order.id + ' confirmée — PêchePro', emailOrderConfirm(order, items)).catch(()=>{});
        req.session.cart = {}; req.session.promo = null; req.session.usePoints = false;
        if (!req.session.user && meta.user_id) {
          const u = await db.get2('SELECT id, name, email, role FROM users WHERE id = ?', [parseInt(meta.user_id)]);
          if (u) req.session.user = { id: u.id, name: u.name, email: u.email, role: u.role };
        }
      }
    } else return res.redirect('/');
    if (!req.session.user && order && order.user_id) {
      const u = await db.get2('SELECT id, name, email, role FROM users WHERE id = ?', [order.user_id]);
      if (u) req.session.user = { id: u.id, name: u.name, email: u.email, role: u.role };
    }
    res.send(V.success(req, req.session.user, order, items));
  } catch(e) { console.error(e); res.redirect('/'); }
});

// ── TICKETS ──
app.get('/tickets', requireAuth, async (req, res) => {
  try {
    const tickets = await db.all2('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id]);
    res.send(V.tickets(req, req.session.user, tickets));
  } catch(e) { res.redirect('/compte'); }
});
app.get('/tickets/:id', requireAuth, async (req, res) => {
  try {
    const ticket = await db.get2('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    if (!ticket) return res.redirect('/tickets');
    const tickets = await db.all2('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id]);
    res.send(V.ticketChat(req, req.session.user, ticket, tickets));
  } catch(e) { res.redirect('/tickets'); }
});
app.post('/tickets', requireAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) { setFlash(req, 'Sujet et message requis', 'error'); return res.redirect('/tickets'); }
    const result = await db.run2('INSERT INTO tickets (user_id, user_name, user_email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [req.session.user.id, req.session.user.name, req.session.user.email, subject, message]);
    res.redirect('/tickets/' + result.lastID);
  } catch(e) { res.redirect('/tickets'); }
});
app.post('/tickets/:id/reply', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await db.get2('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
    if (!ticket || ticket.status === 'résolu') return res.redirect('/tickets/' + req.params.id);
    const newMsg = ticket.message + `\n\n[${req.session.user.name} — ${new Date().toLocaleString('fr-FR')}]\n${message}`;
    await db.run2('UPDATE tickets SET message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newMsg, req.params.id]);
    res.redirect('/tickets/' + req.params.id);
  } catch(e) { res.redirect('/tickets'); }
});

// ── ADMIN LOGIN ──
app.get('/admin/login', (req, res) => { if (req.session.user?.role === 'admin') return res.redirect('/admin'); res.send(V.adminLogin(null)); });
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get2('SELECT * FROM users WHERE email = ? AND role = ?', [email.trim().toLowerCase(), 'admin']);
    if (!user || !bcrypt.compareSync(password, user.password)) return res.send(V.adminLogin('Email ou mot de passe incorrect'));
    req.session.user = { id: user.id, name: user.name, email: user.email, role: 'admin' };
    res.redirect('/admin');
  } catch(e) { res.redirect('/admin/login'); }
});

// ── ADMIN DASHBOARD ──
app.get('/admin', requireAdmin, async (req, res) => {
  try {
    const totalOrders = (await db.get2('SELECT COUNT(*) as c FROM orders')).c;
    const totalRevenue = (await db.get2("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status != 'en_attente'")).s;
    const totalUsers = (await db.get2('SELECT COUNT(*) as c FROM users')).c;
    const totalProducts = (await db.get2('SELECT COUNT(*) as c FROM products')).c;
    const openTickets = (await db.get2("SELECT COUNT(*) as c FROM tickets WHERE status = 'ouvert'")).c;
    const newsletterCount = (await db.get2('SELECT COUNT(*) as c FROM newsletter WHERE active = 1')).c;
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      const total = (await db.get2("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE DATE(created_at) = ? AND status != 'en_attente'", [dateStr])).s;
      revenueByDay.push({ date: label, total });
    }
    const topProducts = await db.all2(`SELECT p.name, COALESCE(SUM(oi.quantity),0) as total_sold FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id ORDER BY total_sold DESC LIMIT 5`);
    const recentOrders = await db.all2('SELECT * FROM orders ORDER BY created_at DESC LIMIT 8');
    const topClients = await db.all2(`SELECT u.name, u.email, u.points, COUNT(o.id) as nb_orders, COALESCE(SUM(o.total),0) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.role = 'user' GROUP BY u.id ORDER BY total_spent DESC LIMIT 5`);
    const revenueByCategory = await db.all2(`SELECT p.category, COALESCE(SUM(oi.quantity * oi.price),0) as revenue FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category ORDER BY revenue DESC`);
    res.send(V.adminDashboard({ totalOrders, totalRevenue, totalUsers, totalProducts, openTickets, newsletterCount, revenueByDay }, recentOrders, topProducts, topClients, revenueByCategory));
  } catch(e) { console.error(e); res.redirect('/admin/login'); }
});

// ── ADMIN COMMANDES ──
app.get('/admin/commandes', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC';
    const orders = await db.all2(query, params);
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminCommandes(orders, msg, status));
  } catch(e) { res.redirect('/admin'); }
});
app.get('/admin/commandes/:id', requireAdmin, async (req, res) => {
  try {
    const order = await db.get2('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.redirect('/admin/commandes');
    const items = await db.all2('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminCommande(order, items, msg));
  } catch(e) { res.redirect('/admin/commandes'); }
});
app.post('/admin/commandes/:id/statut', requireAdmin, async (req, res) => {
  try {
    const { status, notes, tracking_number } = req.body;
    if (!['en_attente','payé','expédié','annulé'].includes(status)) return res.redirect('/admin/commandes');
    await db.run2('UPDATE orders SET status = ?, notes = ?, tracking_number = ? WHERE id = ?', [status, notes || '', tracking_number || '', req.params.id]);
    if (status === 'expédié') {
      const order = await db.get2('SELECT * FROM orders WHERE id = ?', [req.params.id]);
      await sendEmail(order.email, `Ta commande #${order.id} est expédiée ! — PêchePro`, emailShipped({ ...order, tracking_number }));
    }
    req.session.adminFlash = `Statut mis à jour : ${status}`;
    res.redirect(`/admin/commandes/${req.params.id}`);
  } catch(e) { res.redirect('/admin/commandes'); }
});

// ── ADMIN PRODUITS ──
app.get('/admin/produits', requireAdmin, async (req, res) => {
  try {
    const products = await db.all2('SELECT * FROM products ORDER BY category, name');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminProduits(products, msg));
  } catch(e) { res.redirect('/admin'); }
});
app.get('/admin/produits/nouveau', requireAdmin, (req, res) => res.send(V.adminProduitForm(null, null)));
app.post('/admin/produits/nouveau', requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, stock, category, featured, image_url, active, flash_sale, flash_sale_end } = req.body;
    if (!name || !price) return res.redirect('/admin/produits/nouveau');
    const mainImage = req.files && req.files[0] ? `/uploads/${req.files[0].filename}` : (image_url || '/img/default.jpg');
    const extraImages = req.files ? req.files.slice(1).map(f => `/uploads/${f.filename}`) : [];
    await db.run2('INSERT INTO products (name, description, price, stock, category, image, images, featured, active, flash_sale, flash_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), description?.trim() || '', parseFloat(price), parseInt(stock) || 0, category || 'Accessoires', mainImage, JSON.stringify(extraImages), parseInt(featured) || 0, active === '0' ? 0 : 1, flash_sale ? 1 : 0, flash_sale_end || null]);
    req.session.adminFlash = `Produit "${name}" créé !`;
    res.redirect('/admin/produits');
  } catch(e) { console.error(e); res.redirect('/admin/produits'); }
});
app.get('/admin/produits/:id/edit', requireAdmin, async (req, res) => {
  try {
    const p = await db.get2('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!p) return res.redirect('/admin/produits');
    p.images = JSON.parse(p.images || '[]');
    res.send(V.adminProduitForm(p, null));
  } catch(e) { res.redirect('/admin/produits'); }
});
app.post('/admin/produits/:id/edit', requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, stock, category, featured, image_url, active, flash_sale, flash_sale_end } = req.body;
    const existing = await db.get2('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.redirect('/admin/produits');
    const mainImage = req.files && req.files[0] ? `/uploads/${req.files[0].filename}` : (image_url || existing.image);
    const existingImages = JSON.parse(existing.images || '[]');
    const newImages = req.files ? req.files.slice(1).map(f => `/uploads/${f.filename}`) : [];
    const allImages = [...existingImages, ...newImages];
    await db.run2('UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image=?, images=?, featured=?, active=?, flash_sale=?, flash_end=? WHERE id=?',
      [name.trim(), description?.trim() || '', parseFloat(price), parseInt(stock) || 0, category || 'Accessoires', mainImage, JSON.stringify(allImages), parseInt(featured) || 0, active === '0' ? 0 : 1, flash_sale ? 1 : 0, flash_sale_end || null, req.params.id]);
    req.session.adminFlash = `Produit "${name}" modifié !`;
    res.redirect('/admin/produits');
  } catch(e) { res.redirect('/admin/produits'); }
});
app.post('/admin/produits/:id/supprimer', requireAdmin, async (req, res) => {
  try {
    await db.run2('DELETE FROM products WHERE id = ?', [req.params.id]);
    req.session.adminFlash = 'Produit supprimé';
    res.redirect('/admin/produits');
  } catch(e) { res.redirect('/admin/produits'); }
});
app.post('/admin/produits/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const p = await db.get2('SELECT active, name FROM products WHERE id = ?', [req.params.id]);
    await db.run2('UPDATE products SET active = ? WHERE id = ?', [p.active === 0 ? 1 : 0, req.params.id]);
    req.session.adminFlash = `"${p.name}" ${p.active === 0 ? 'activé ✅' : 'désactivé ❌'}`;
    res.redirect('/admin/produits');
  } catch(e) { res.redirect('/admin/produits'); }
});

// ── ADMIN USERS ──
app.get('/admin/utilisateurs', requireAdmin, async (req, res) => {
  try {
    const users = await db.all2('SELECT id, name, email, role, points, last_seen, created_at FROM users ORDER BY created_at DESC');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminUsers(users, msg));
  } catch(e) { res.redirect('/admin'); }
});
app.post('/admin/users/:id/supprimer', requireAdmin, async (req, res) => {
  try {
    const user = await db.get2('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user || user.role === 'admin') { req.session.adminFlash = 'Impossible'; return res.redirect('/admin/utilisateurs'); }
    await db.run2('DELETE FROM users WHERE id = ?', [req.params.id]);
    req.session.adminFlash = `"${user.name}" supprimé`;
    res.redirect('/admin/utilisateurs');
  } catch(e) { res.redirect('/admin/utilisateurs'); }
});
app.post('/admin/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user','admin'].includes(role)) return res.redirect('/admin/utilisateurs');
    await db.run2('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    req.session.adminFlash = 'Rôle mis à jour';
    res.redirect('/admin/utilisateurs');
  } catch(e) { res.redirect('/admin/utilisateurs'); }
});
app.post('/admin/users/:id/points', requireAdmin, async (req, res) => {
  try {
    const { points, reason } = req.body;
    const p = parseInt(points);
    await db.run2('UPDATE users SET points = points + ? WHERE id = ?', [p, req.params.id]);
    await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?, ?, ?)', [req.params.id, p, reason || 'Ajout manuel admin']);
    req.session.adminFlash = `${p} points ajoutés`;
    res.redirect('/admin/utilisateurs');
  } catch(e) { res.redirect('/admin/utilisateurs'); }
});


// ── MOT DE PASSE OUBLIÉ ──
app.get('/forgot-password', (req, res) => {
  res.send(V.forgotPassword(req));
});
app.post('/forgot-password', async (req, res) => {
  try {
    const { email, name_confirm, new_password, confirm_password } = req.body;
    if (!email) { setFlash(req, 'Email requis', 'error'); return res.redirect('/forgot-password'); }
    const user = await db.get2('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    // Message identique qu'il existe ou non (sécurité)
    if (!user) { setFlash(req, 'Aucun compte trouvé ou nom incorrect', 'error'); return res.redirect('/forgot-password'); }
    // Vérifier que le nom correspond (protection basique)
    if (!name_confirm || user.name.toLowerCase().trim() !== name_confirm.toLowerCase().trim()) {
      setFlash(req, 'Aucun compte trouvé ou nom incorrect', 'error'); return res.redirect('/forgot-password');
    }
    if (!new_password || new_password.length < 6) { setFlash(req, 'Mot de passe min. 6 caractères', 'error'); return res.redirect('/forgot-password'); }
    if (new_password !== confirm_password) { setFlash(req, 'Les mots de passe ne correspondent pas', 'error'); return res.redirect('/forgot-password'); }
    const hash = bcrypt.hashSync(new_password, 10);
    await db.run2('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
    setFlash(req, 'Mot de passe mis à jour ! Connecte-toi 🎉');
    res.redirect('/login');
  } catch(e) { console.error(e); res.redirect('/forgot-password'); }
});

// ── ADMIN CHANGER MDP MEMBRE ──
app.post('/admin/users/:id/password', requireAdmin, async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6) { req.session.adminFlash = 'Mot de passe min. 6 caractères'; return res.redirect('/admin/utilisateurs'); }
    const hash = bcrypt.hashSync(new_password, 10);
    const user = await db.get2('SELECT name FROM users WHERE id = ?', [req.params.id]);
    await db.run2('UPDATE users SET password = ? WHERE id = ?', [hash, req.params.id]);
    req.session.adminFlash = `Mot de passe de "${user.name}" modifié`;
    res.redirect('/admin/utilisateurs');
  } catch(e) { res.redirect('/admin/utilisateurs'); }
});

// ── ADMIN NEWSLETTER ──
app.get('/admin/newsletter', requireAdmin, async (req, res) => {
  try {
    const subscribers = await db.all2('SELECT * FROM newsletter WHERE active = 1 ORDER BY created_at DESC');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminNewsletter(subscribers, msg));
  } catch(e) { res.redirect('/admin'); }
});
app.post('/admin/newsletter/envoyer', requireAdmin, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const subscribers = await db.all2('SELECT email FROM newsletter WHERE active = 1');
    let sent = 0;
    for (const sub of subscribers) {
      await sendEmail(sub.email, subject, `<div style="font-family:Arial;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:16px;padding:2rem">
        <h2 style="color:#00ff87">🎣 PêchePro</h2>
        <div style="color:#ccc;line-height:1.7">${message.replace(/\n/g,'<br>')}</div>
        <hr style="border-color:#222;margin:1.5rem 0">
        <p style="font-size:.75rem;color:#444">Pour vous désabonner, ignorez simplement cet email.</p>
      </div>`);
      sent++;
    }
    req.session.adminFlash = `Newsletter envoyée à ${sent} abonnés !`;
    res.redirect('/admin/newsletter');
  } catch(e) { res.redirect('/admin/newsletter'); }
});

// ── ADMIN TICKETS ──
app.get('/admin/tickets', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC';
    const tickets = await db.all2(query, params);
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminTickets(tickets, msg, status));
  } catch(e) { res.redirect('/admin'); }
});
app.get('/admin/tickets/:id', requireAdmin, async (req, res) => {
  try {
    const ticket = await db.get2('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    if (!ticket) return res.redirect('/admin/tickets');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminTicket(ticket, msg));
  } catch(e) { res.redirect('/admin/tickets'); }
});
app.post('/admin/tickets/:id/reply', requireAdmin, async (req, res) => {
  try {
    const { reply, status } = req.body;
    await db.run2('UPDATE tickets SET admin_reply = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [reply, status || 'en_cours', req.params.id]);
    req.session.adminFlash = 'Réponse envoyée !';
    res.redirect(`/admin/tickets/${req.params.id}`);
  } catch(e) { res.redirect('/admin/tickets'); }
});

// ── ADMIN PROMOS ──
app.get('/admin/promos', requireAdmin, async (req, res) => {
  try {
    const promos = await db.all2('SELECT * FROM promo_codes ORDER BY created_at DESC');
    const products = await db.all2('SELECT id, name, price FROM products WHERE active = 1 ORDER BY name');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminPromos(promos, msg, products, {}));
  } catch(e) { res.redirect('/admin'); }
});
app.post('/admin/promos/nouveau', requireAdmin, async (req, res) => {
  try {
    const { code, type, value, uses_left } = req.body;
    if (!code || !value) { req.session.adminFlash = 'Code et valeur requis'; return res.redirect('/admin/promos'); }
    await db.run2('INSERT INTO promo_codes (code, type, value, uses_left) VALUES (?, ?, ?, ?)',
      [code.toUpperCase().trim(), type || 'percent', parseFloat(value), parseInt(uses_left) || -1]);
    req.session.adminFlash = `Code "${code.toUpperCase()}" créé !`;
    res.redirect('/admin/promos');
  } catch(e) { req.session.adminFlash = 'Code déjà existant'; res.redirect('/admin/promos'); }
});
app.post('/admin/promos/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const promo = await db.get2('SELECT * FROM promo_codes WHERE id = ?', [req.params.id]);
    await db.run2('UPDATE promo_codes SET active = ? WHERE id = ?', [promo.active ? 0 : 1, req.params.id]);
    req.session.adminFlash = `Code ${promo.active ? 'désactivé' : 'activé'}`;
    res.redirect('/admin/promos');
  } catch(e) { res.redirect('/admin/promos'); }
});
app.post('/admin/promos/:id/supprimer', requireAdmin, async (req, res) => {
  try {
    await db.run2('DELETE FROM promo_codes WHERE id = ?', [req.params.id]);
    req.session.adminFlash = 'Code supprimé';
    res.redirect('/admin/promos');
  } catch(e) { res.redirect('/admin/promos'); }
});
app.post('/admin/sale/global', requireAdmin, async (req, res) => {
  try {
    if (req.body.reset) {
      await db.run2('UPDATE products SET price = CASE WHEN original_price > 0 THEN original_price ELSE price END, original_price = 0, flash_sale = 0 WHERE active = 1');
      req.session.adminFlash = '✅ Soldes annulés';
    } else {
      const percent = parseFloat(req.body.percent);
      if (!percent || percent <= 0 || percent >= 100) { req.session.adminFlash = 'Pourcentage invalide'; return res.redirect('/admin/promos'); }
      await db.run2('UPDATE products SET original_price = CASE WHEN original_price = 0 OR original_price IS NULL THEN price ELSE original_price END WHERE active = 1');
      await db.run2('UPDATE products SET price = ROUND(original_price * ?, 2) WHERE active = 1', [(100 - percent) / 100]);
      req.session.adminFlash = `🔥 Solde -${percent}% sur tous les produits !`;
    }
    res.redirect('/admin/promos');
  } catch(e) { console.error(e); res.redirect('/admin/promos'); }
});
app.post('/admin/sale/category', requireAdmin, async (req, res) => {
  try {
    const { category, percent } = req.body;
    const p = parseFloat(percent);
    if (!p || p <= 0 || p >= 100) { req.session.adminFlash = 'Pourcentage invalide'; return res.redirect('/admin/promos'); }
    await db.run2('UPDATE products SET original_price = CASE WHEN original_price = 0 OR original_price IS NULL THEN price ELSE original_price END WHERE category = ? AND active = 1', [category]);
    await db.run2('UPDATE products SET price = ROUND(original_price * ?, 2) WHERE category = ? AND active = 1', [(100 - p) / 100, category]);
    req.session.adminFlash = `🎯 Solde -${p}% sur "${category}" !`;
    res.redirect('/admin/promos');
  } catch(e) { res.redirect('/admin/promos'); }
});
app.post('/admin/sale/product', requireAdmin, async (req, res) => {
  try {
    const { product_id, new_price } = req.body;
    const price = parseFloat(new_price);
    const p = await db.get2('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!p || !price) return res.redirect('/admin/promos');
    await db.run2('UPDATE products SET original_price = CASE WHEN original_price = 0 OR original_price IS NULL THEN price ELSE original_price END, price = ? WHERE id = ?', [price, product_id]);
    req.session.adminFlash = `🏷️ Prix de "${p.name}" → ${price.toFixed(2)} CHF`;
    res.redirect('/admin/promos');
  } catch(e) { res.redirect('/admin/promos'); }
});

// ── ADMIN AVIS ──
app.get('/admin/avis', requireAdmin, async (req, res) => {
  try {
    const reviews = await db.all2(`SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id ORDER BY r.created_at DESC`);
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminAvis(reviews, msg));
  } catch(e) { res.redirect('/admin'); }
});
app.post('/admin/avis/:id/approuver', requireAdmin, async (req, res) => {
  try { await db.run2('UPDATE reviews SET approved = 1 WHERE id = ?', [req.params.id]); req.session.adminFlash = 'Avis approuvé !'; res.redirect('/admin/avis'); } catch(e) { res.redirect('/admin/avis'); }
});
app.post('/admin/avis/:id/supprimer', requireAdmin, async (req, res) => {
  try { await db.run2('DELETE FROM reviews WHERE id = ?', [req.params.id]); req.session.adminFlash = 'Avis supprimé'; res.redirect('/admin/avis'); } catch(e) { res.redirect('/admin/avis'); }
});

// ── ADMIN CONTENU ──
app.get('/admin/contenu', requireAdmin, async (req, res) => {
  try {
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminContenu(await getContent(), msg));
  } catch(e) { res.redirect('/admin'); }
});
app.post('/admin/contenu', requireAdmin, async (req, res) => {
  try {
    const fields = ['hero_title', 'hero_subtitle', 'hero_cta', 'about_text', 'banner_text', 'banner_active'];
    for (const f of fields) {
      if (req.body[f] !== undefined) await db.run2('INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)', [f, req.body[f]]);
    }
    await db.run2('INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)', ['banner_active', req.body.banner_active ? '1' : '0']);
    req.session.adminFlash = 'Contenu mis à jour !';
    res.redirect('/admin/contenu');
  } catch(e) { res.redirect('/admin/contenu'); }
});


// ── LEADERBOARD ──
app.get('/leaderboard', async (req, res) => {
  try {
    const top = await db.all2(`SELECT u.id, u.name, u.points, COUNT(o.id) as nb_orders, COALESCE(SUM(o.total),0) as total_spent
      FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.role='user' GROUP BY u.id ORDER BY u.points DESC LIMIT 20`);
    res.send(V.leaderboard(req, req.session.user, top));
  } catch(e) { console.error(e); res.redirect('/'); }
});

// ── BLOG ──
app.get('/blog', async (req, res) => {
  try {
    const posts = await db.all2('SELECT * FROM blog_posts WHERE published=1 ORDER BY created_at DESC');
    res.send(V.blog(req, req.session.user, posts));
  } catch(e) { res.redirect('/'); }
});
app.get('/blog/:id', async (req, res) => {
  try {
    const post = await db.get2('SELECT * FROM blog_posts WHERE id=? AND published=1', [req.params.id]);
    if (!post) return res.redirect('/blog');
    res.send(V.blogPost(req, req.session.user, post));
  } catch(e) { res.redirect('/blog'); }
});

// ── FORUM ──
app.get('/forum', async (req, res) => {
  try {
    const threads = await db.all2(`SELECT f.*, u.name as author_name,
      (SELECT COUNT(*) FROM forum_replies fr WHERE fr.thread_id=f.id) as reply_count
      FROM forum_threads f JOIN users u ON f.user_id=u.id ORDER BY f.created_at DESC`);
    res.send(V.forum(req, req.session.user, threads));
  } catch(e) { res.redirect('/'); }
});
app.get('/forum/:id', async (req, res) => {
  try {
    const thread = await db.get2('SELECT f.*,u.name as author_name FROM forum_threads f JOIN users u ON f.user_id=u.id WHERE f.id=?', [req.params.id]);
    if (!thread) return res.redirect('/forum');
    const replies = await db.all2('SELECT r.*,u.name as author_name FROM forum_replies r JOIN users u ON r.user_id=u.id WHERE r.thread_id=? ORDER BY r.created_at ASC', [req.params.id]);
    res.send(V.forumThread(req, req.session.user, thread, replies));
  } catch(e) { res.redirect('/forum'); }
});
app.post('/forum', requireAuth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) { setFlash(req, 'Titre et contenu requis', 'error'); return res.redirect('/forum'); }
    const result = await db.run2('INSERT INTO forum_threads (user_id, title, content, category) VALUES (?,?,?,?)',
      [req.session.user.id, title.trim(), content.trim(), category || 'Général']);
    res.redirect('/forum/' + result.lastID);
  } catch(e) { res.redirect('/forum'); }
});
app.post('/forum/:id/reply', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.redirect('/forum/' + req.params.id);
    await db.run2('INSERT INTO forum_replies (thread_id, user_id, content) VALUES (?,?,?)',
      [req.params.id, req.session.user.id, content.trim()]);
    await db.run2('UPDATE forum_threads SET updated_at=CURRENT_TIMESTAMP WHERE id=?', [req.params.id]);
    res.redirect('/forum/' + req.params.id);
  } catch(e) { res.redirect('/forum/' + req.params.id); }
});

// ── ABONNEMENT PREMIUM ──
app.get('/premium', async (req, res) => {
  try {
    const user = req.session.user ? await db.get2('SELECT * FROM users WHERE id=?', [req.session.user.id]) : null;
    res.send(V.premium(req, req.session.user, user));
  } catch(e) { res.redirect('/'); }
});
app.post('/premium/souscrire', requireAuth, async (req, res) => {
  try {
    const user = await db.get2('SELECT * FROM users WHERE id=?', [req.session.user.id]);
    if (user.premium) { setFlash(req, 'Tu es déjà membre Premium !', 'error'); return res.redirect('/premium'); }
    const expiry = new Date(); expiry.setMonth(expiry.getMonth() + 1);
    await db.run2('UPDATE users SET premium=1, premium_until=? WHERE id=?', [expiry.toISOString(), user.id]);
    await db.run2('INSERT INTO points_history (user_id, points, reason) VALUES (?,?,?)', [user.id, 200, 'Activation Premium 🌟']);
    await db.run2('UPDATE users SET points=points+200 WHERE id=?', [user.id]);
    setFlash(req, '🌟 Bienvenue dans le club Premium ! +200 points offerts');
    res.redirect('/compte');
  } catch(e) { res.redirect('/premium'); }
});

// ── ADMIN BLOG ──
app.get('/admin/blog', requireAdmin, async (req, res) => {
  try {
    const posts = await db.all2('SELECT * FROM blog_posts ORDER BY created_at DESC');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminBlog(posts, msg));
  } catch(e) { res.redirect('/admin'); }
});
app.post('/admin/blog/nouveau', requireAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, image_url, published } = req.body;
    if (!title || !content) { req.session.adminFlash = 'Titre et contenu requis'; return res.redirect('/admin/blog'); }
    await db.run2('INSERT INTO blog_posts (title, content, excerpt, image_url, published, author) VALUES (?,?,?,?,?,?)',
      [title.trim(), content.trim(), excerpt?.trim()||'', image_url||'', published?1:0, 'Admin']);
    req.session.adminFlash = `Article "${title}" créé !`;
    res.redirect('/admin/blog');
  } catch(e) { res.redirect('/admin/blog'); }
});
app.post('/admin/blog/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const p = await db.get2('SELECT published FROM blog_posts WHERE id=?', [req.params.id]);
    await db.run2('UPDATE blog_posts SET published=? WHERE id=?', [p.published?0:1, req.params.id]);
    req.session.adminFlash = p.published ? 'Article masqué' : 'Article publié !';
    res.redirect('/admin/blog');
  } catch(e) { res.redirect('/admin/blog'); }
});
app.post('/admin/blog/:id/supprimer', requireAdmin, async (req, res) => {
  try {
    await db.run2('DELETE FROM blog_posts WHERE id=?', [req.params.id]);
    req.session.adminFlash = 'Article supprimé';
    res.redirect('/admin/blog');
  } catch(e) { res.redirect('/admin/blog'); }
});


// ── DB MIGRATIONS — NOUVELLES TABLES ──
setTimeout(async () => {
  const sqls = [
    `CREATE TABLE IF NOT EXISTS product_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT,
      category TEXT DEFAULT 'Autre', status TEXT DEFAULT 'en_attente',
      votes INTEGER DEFAULT 0, admin_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS product_request_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL, user_id INTEGER NOT NULL,
      UNIQUE(request_id, user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, contact_name TEXT, email TEXT, phone TEXT,
      website TEXT, address TEXT, country TEXT DEFAULT 'France',
      payment_terms TEXT, delivery_days INTEGER DEFAULT 7,
      notes TEXT, active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS supplier_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
      purchase_price REAL DEFAULT 0, min_order INTEGER DEFAULT 1,
      lead_time INTEGER DEFAULT 7,
      UNIQUE(supplier_id, product_id)
    )`,
    'ALTER TABLE products ADD COLUMN purchase_price REAL DEFAULT 0',
    'ALTER TABLE products ADD COLUMN reorder_threshold INTEGER DEFAULT 5',
  ];
  for (const s of sqls) await db.run2(s).catch(()=>{});
  console.log('✅ Nouvelles tables créées');
}, 1500);

// ── DEMANDES PRODUITS ──
app.get('/demandes', async (req, res) => {
  try {
    const requests = await db.all2(`
      SELECT r.*, u.name as author_name,
        (SELECT COUNT(*) FROM product_request_votes v WHERE v.request_id=r.id) as vote_count,
        ${req.session.user ? `(SELECT COUNT(*) FROM product_request_votes v2 WHERE v2.request_id=r.id AND v2.user_id=${req.session.user.id})` : '0'} as user_voted
      FROM product_requests r JOIN users u ON r.user_id=u.id
      WHERE r.status != 'refusé'
      ORDER BY vote_count DESC, r.created_at DESC`);
    res.send(V.demandesProduits(req, req.session.user, requests));
  } catch(e) { console.error(e); res.redirect('/'); }
});

app.post('/demandes', requireAuth, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title) { setFlash(req, 'Titre requis', 'error'); return res.redirect('/demandes'); }
    await db.run2('INSERT INTO product_requests (user_id, title, description, category) VALUES (?,?,?,?)',
      [req.session.user.id, title.trim(), description?.trim()||'', category||'Autre']);
    setFlash(req, 'Demande envoyée ! 🎉 La communauté peut maintenant voter.');
    res.redirect('/demandes');
  } catch(e) { res.redirect('/demandes'); }
});

app.post('/demandes/:id/vote', requireAuth, async (req, res) => {
  try {
    const existing = await db.get2('SELECT id FROM product_request_votes WHERE request_id=? AND user_id=?', [req.params.id, req.session.user.id]);
    if (existing) {
      await db.run2('DELETE FROM product_request_votes WHERE request_id=? AND user_id=?', [req.params.id, req.session.user.id]);
    } else {
      await db.run2('INSERT INTO product_request_votes (request_id, user_id) VALUES (?,?)', [req.params.id, req.session.user.id]);
    }
    res.redirect('/demandes');
  } catch(e) { res.redirect('/demandes'); }
});

// ── ADMIN FOURNISSEURS ──
app.get('/admin/fournisseurs', requireAdmin, async (req, res) => {
  try {
    const suppliers = await db.all2(`SELECT s.*,
      (SELECT COUNT(*) FROM supplier_products sp WHERE sp.supplier_id=s.id) as product_count
      FROM suppliers s ORDER BY s.name ASC`);
    const products = await db.all2('SELECT id, name, price, purchase_price, stock, reorder_threshold FROM products ORDER BY name');
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminFournisseurs(suppliers, products, msg));
  } catch(e) { res.redirect('/admin'); }
});

app.post('/admin/fournisseurs/nouveau', requireAdmin, async (req, res) => {
  try {
    const { name, contact_name, email, phone, website, address, country, payment_terms, delivery_days, notes } = req.body;
    if (!name) { req.session.adminFlash = 'Nom requis'; return res.redirect('/admin/fournisseurs'); }
    await db.run2('INSERT INTO suppliers (name,contact_name,email,phone,website,address,country,payment_terms,delivery_days,notes) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [name.trim(), contact_name||'', email||'', phone||'', website||'', address||'', country||'France', payment_terms||'', parseInt(delivery_days)||7, notes||'']);
    req.session.adminFlash = `Fournisseur "${name}" ajouté !`;
    res.redirect('/admin/fournisseurs');
  } catch(e) { res.redirect('/admin/fournisseurs'); }
});

app.post('/admin/fournisseurs/:id/supprimer', requireAdmin, async (req, res) => {
  try {
    const s = await db.get2('SELECT name FROM suppliers WHERE id=?', [req.params.id]);
    await db.run2('DELETE FROM supplier_products WHERE supplier_id=?', [req.params.id]);
    await db.run2('DELETE FROM suppliers WHERE id=?', [req.params.id]);
    req.session.adminFlash = `"${s.name}" supprimé`;
    res.redirect('/admin/fournisseurs');
  } catch(e) { res.redirect('/admin/fournisseurs'); }
});

app.post('/admin/fournisseurs/lier', requireAdmin, async (req, res) => {
  try {
    const { supplier_id, product_id, purchase_price, min_order, lead_time } = req.body;
    await db.run2('INSERT OR REPLACE INTO supplier_products (supplier_id,product_id,purchase_price,min_order,lead_time) VALUES (?,?,?,?,?)',
      [supplier_id, product_id, parseFloat(purchase_price)||0, parseInt(min_order)||1, parseInt(lead_time)||7]);
    await db.run2('UPDATE products SET purchase_price=? WHERE id=?', [parseFloat(purchase_price)||0, product_id]);
    req.session.adminFlash = 'Produit lié au fournisseur';
    res.redirect('/admin/fournisseurs');
  } catch(e) { res.redirect('/admin/fournisseurs'); }
});

// ── ADMIN STOCKS ──
app.get('/admin/stocks', requireAdmin, async (req, res) => {
  try {
    const products = await db.all2(`
      SELECT p.*, 
        (SELECT s.name FROM suppliers s JOIN supplier_products sp ON s.id=sp.supplier_id WHERE sp.product_id=p.id LIMIT 1) as supplier_name,
        (SELECT sp.purchase_price FROM supplier_products sp WHERE sp.product_id=p.id LIMIT 1) as buy_price
      FROM products p ORDER BY p.stock ASC`);
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminStocks(products, msg));
  } catch(e) { res.redirect('/admin'); }
});

app.post('/admin/stocks/:id/update', requireAdmin, async (req, res) => {
  try {
    const { stock, reorder_threshold } = req.body;
    await db.run2('UPDATE products SET stock=?, reorder_threshold=? WHERE id=?',
      [parseInt(stock)||0, parseInt(reorder_threshold)||5, req.params.id]);
    req.session.adminFlash = 'Stock mis à jour';
    res.redirect('/admin/stocks');
  } catch(e) { res.redirect('/admin/stocks'); }
});

// ── ADMIN FINANCES ──
app.get('/admin/finances', requireAdmin, async (req, res) => {
  try {
    const revenue = (await db.get2("SELECT COALESCE(SUM(total),0) as s FROM orders WHERE status='payé' OR status='expédié'")).s;
    const totalOrders = (await db.get2("SELECT COUNT(*) as c FROM orders WHERE status='payé' OR status='expédié'")).c;
    const avgOrder = totalOrders > 0 ? revenue / totalOrders : 0;
    const revenueByMonth = await db.all2(`
      SELECT strftime('%Y-%m', created_at) as month, 
        COALESCE(SUM(total),0) as revenue, COUNT(*) as orders
      FROM orders WHERE status='payé' OR status='expédié'
      GROUP BY month ORDER BY month DESC LIMIT 12`);
    const topProducts = await db.all2(`
      SELECT p.name, p.price, p.purchase_price, p.stock,
        COALESCE(SUM(oi.quantity),0) as sold,
        COALESCE(SUM(oi.quantity * oi.price),0) as revenue,
        COALESCE(SUM(oi.quantity * (oi.price - p.purchase_price)),0) as profit
      FROM products p LEFT JOIN order_items oi ON p.id=oi.product_id
      GROUP BY p.id ORDER BY profit DESC`);
    const requests = await db.all2(`
      SELECT r.*,
        (SELECT COUNT(*) FROM product_request_votes v WHERE v.request_id=r.id) as vote_count,
        u.name as author_name
      FROM product_requests r JOIN users u ON r.user_id=u.id ORDER BY vote_count DESC`);
    const msg = req.session.adminFlash; req.session.adminFlash = null;
    res.send(V.adminFinances({ revenue, totalOrders, avgOrder, revenueByMonth, topProducts }, requests, msg));
  } catch(e) { console.error(e); res.redirect('/admin'); }
});

app.post('/admin/demandes/:id/statut', requireAdmin, async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    await db.run2('UPDATE product_requests SET status=?, admin_note=? WHERE id=?', [status, admin_note||'', req.params.id]);
    req.session.adminFlash = 'Demande mise à jour';
    res.redirect('/admin/finances');
  } catch(e) { res.redirect('/admin/finances'); }
});

// ── Health check (pour Render keep-alive) ──
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║  🎣  PêchePro — Démarré !             ║
  ║  ➜  http://localhost:${PORT}           ║
  ╠═══════════════════════════════════════╣
  ║  Admin: admin@admin.com / admin123    ║
  ╚═══════════════════════════════════════╝
  `);
});