require('dotenv').config(); 
const { Pool } = require('pg');

const useSSL = process.env.USE_SSL === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false
});

console.log('Database', DATABASE_URL);

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to the database');
    client.query('SELECT NOW()', (err, res) => {
      release();
      if (err) {
        console.error('Database query error:', err.stack);
      } else {
        console.log('Database query result:', res.rows);
      }
    });
  }
});

module.exports = pool;
