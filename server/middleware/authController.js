const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAuthStatus = (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ authenticated: true, user });
  } catch (err) {
    console.error('Error checking authentication status', err)
    res.staus(500).json({ error: 'Internal Server Error'})
  }
}

module.exports = { getAuthStatus }