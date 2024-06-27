require('dotenv').config(); 
const { Pool } = require('pg');

const useSSL = process.env.USE_SSL === 'true';

const pool = new Pool({
  user: process.env.DB_USERNAME,
  passwaord: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});

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
