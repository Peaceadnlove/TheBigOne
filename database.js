const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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
    } catch (err) {
      console.error('Erreur DB (get2):', err);
      return null;
    }
  },
  all2: async (sql, params = []) => {
    try {
      const res = await pool.query(toPostgres(sql), params);
      // FORCE le retour d'un tableau vide si res.rows n'existe pas
      return Array.isArray(res.rows) ? res.rows : [];
    } catch (err) {
      console.error('Erreur DB (all2):', err);
      return []; // Retourne un tableau vide pour éviter le crash du .map()
    }
  },
  run2: async (sql, params = []) => {
    try {
      let pgSql = toPostgres(sql);
      if (/^\s*INSERT/i.test(pgSql) && !/RETURNING/i.test(pgSql)) {
        pgSql += ' RETURNING id';
      }
      const res = await pool.query(pgSql, params);
      return { 
        lastID: res.rows[0] ? res.rows[0].id : null, 
        changes: res.rowCount 
      };
    } catch (err) {
      console.error('Erreur DB (run2):', err);
      return { lastID: null, changes: 0 };
    }
  }
};

module.exports = db;
