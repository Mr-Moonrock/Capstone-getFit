const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwtGenerator = require('../utils/jwtGenerator');
const authorize = require('../middleware/authorize');
const { getAuthStatus } = require('../middleware/authController');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'D:/Capstone-Project/GetFit/Server/.env' });

router.use(express.json());

router.post('/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    const user = await pool.query(`SELECT * FROM users WHERE user_username = $1`, [username]
    );
     
    if (user.rows.length > 0) {
      return res.status(401).send('User already registered')
    }
    
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
    `INSERT INTO users (user_username, user_password, user_firstName, user_lastName, user_email) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
    [username, hashedPassword, firstName, lastName, email]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id)

    return res.status(200).json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error')
    }
  });


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('LOGIN REQ.BODY:', req.body);

  try {
    const user = await pool.query(`SELECT user_id, user_username, user_password FROM users WHERE user_username = $1`, [username]
    );
    
    if (user.rows.length === 0) {
      return res.status(401).json({message: 'Invalid Credential'});
    }

    const validPassword = await bcrypt.compare(
      password, 
      user.rows[0].user_password);

    if (!validPassword) {
      return res.status(401).json({message: 'Invalid Credential'})
    }

    const jwtToken = jwtGenerator(user.rows[0].user_id, user.rows[0].user_username);
    return res.json({ jwtToken })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
});

router.post('/verify', authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});

router.post('/decode', (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is missing'});
  }

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return res.status(400).json({ success: false, message: 'Token is invalid' });
    }
    res.status(200).json({ success: true, decodedToken })
  } catch (err) {
    console.error('Error decoding token:', err);
    res.status(500).json({ success: false, message: 'Failed to decode token' })
  }
})

router.post('/user', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) {
      return res.status(401).json({message: 'Authorization denied'});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const user = await pool.query(`
      SELECT user_id, user_username FROM users WHERE user_id = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching user data', err)
    res.status(500).json({message: 'Server error' })
  }
})

router.post('/status', authorize, getAuthStatus )
module.exports = router;