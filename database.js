const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL manquant dans les variables d\'environnement !');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Timeout de connexion pour éviter les blocages silencieux
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10
});

// Test de connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Impossible de se connecter à Supabase :', err.message);
  } else {
    console.log('✅ Connecté à Supabase (PostgreSQL)');
    release();
  }
});

// Convertit les ? en $1, $2, $3... (style PostgreSQL)
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
      // Toujours retourner un tableau, jamais undefined
      return res.rows || [];
    } catch (e) {
      console.error('DB all2 error:', e.message, '| SQL:', sql);
      return [];
    }
  },

  run2: async (sql, params = []) => {
    try {
      let pgSql = toPostgres(sql);
      // Pour les INSERT, ajouter RETURNING id pour récupérer le dernier ID
      if (/^\s*INSERT/i.test(pgSql) && !/RETURNING/i.test(pgSql)) {
        pgSql += ' RETURNING id';
      }
      const res = await pool.query(pgSql, params);
      return {
        lastID: res.rows[0] ? res.rows[0].id : null,
        changes: res.rowCount
      };
    } catch (e) {
      console.error('DB run2 error:', e.message, '| SQL:', sql);
      throw e; // On relance pour que l'appelant puisse gérer (ex: email déjà utilisé)
    }
  },

  // Accès direct au pool si besoin
  pool
};

module.exports = db;