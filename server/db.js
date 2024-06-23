require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBDATABASE,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    release();
  }
});

module.exports = pool;
