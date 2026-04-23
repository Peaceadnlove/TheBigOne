// database.js — version propre, sans conflits Git
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL manquant !');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Connexion Supabase échouée :', err.message);
  } else {
    console.log('✅ Connecté à Supabase');
    release();
  }
});

function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const db = {
  get2: async (sql, params = []) => {
    try {
      const res = await pool.query(toPostgres(sql), params);
      return res.rows[0] || null;
    } catch (e) {
      console.error('DB get2 error:', e.message, '| SQL:', sql);
      return null;
    }
  },
  all2: async (sql, params = []) => {
    try {
      const res = await pool.query(toPostgres(sql), params);
      return Array.isArray(res.rows) ? res.rows : [];
    } catch (e) {
      console.error('DB all2 error:', e.message, '| SQL:', sql);
      return [];
    }
  },
  run2: async (sql, params = []) => {
    try {
      let pgSql = toPostgres(sql);
      if (/^\s*INSERT/i.test(pgSql) && !/RETURNING/i.test(pgSql)) {
        pgSql += ' RETURNING id';
      }
      const res = await pool.query(pgSql, params);
      return { lastID: res.rows[0] ? res.rows[0].id : null, changes: res.rowCount };
    } catch (e) {
      console.error('DB run2 error:', e.message, '| SQL:', sql);
      throw e;
    }
  },
  pool
};

module.exports = db;