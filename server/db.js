require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBDATABASE,
});

console.log('Pool', pool);

// pool.connect((err, client, release) => {
//   if (err) {
//     console.error('Error acquiring client', err.stack);
//   } else {
//     release();
//   }
// });

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err.stack);
//   } else {
//     console.log('Database connected:', res.rows);
//   }
// });

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
