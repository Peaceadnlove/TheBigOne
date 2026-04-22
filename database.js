const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = {
  get2: async (sql, params = []) => {
    const res = await pool.query(sql.replace(/\?/g, (val, i) => `$${i + 1}`), params);
    return res.rows[0];
  },
  all2: async (sql, params = []) => {
    const res = await pool.query(sql.replace(/\?/g, (val, i) => `$${i + 1}`), params);
    return res.rows;
  },
  run2: async (sql, params = []) => {
    // Pour les INSERT, on ajoute RETURNING id pour récupérer le dernier ID
    const res = await pool.query(sql.replace(/\?/g, (val, i) => `$${i + 1}`), params);
    return { lastID: res.rows[0] ? res.rows[0].id : null, changes: res.rowCount };
  }
};

module.exports = db;