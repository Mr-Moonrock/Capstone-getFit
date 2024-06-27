require('dotenv').config();
const express = require('express')
const pool = require('./db'); 
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json());

app.use('/authentication', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/auth', require('./routes/auth'));
app.use('/exercises', require('./routes/exercises'));
app.use('/bmi', require('./routes/bmi'));
app.use('/calendar', require('./routes/calendar'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is starting on port ${PORT}`);
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client:', err.stack);
    } else {
      client.query('SELECT NOW()', (err, res) => {
        release();
        if (err) {
          console.error('Database query error:', err.stack);
        } else {
          console.log('Database connected:', res.rows);
        }
      });
    }
  });
});

module.exports = app;