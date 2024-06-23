const router = require('express').Router();
const authorize = require('../middleware/authorize');
const pool = require('../db')

router.post('/', authorize, async (req, res) => {
  try {
    const user = await pool.query(`
    SELECT user_username FROM users WHERE user_id = $1`,
      [req.user.id]
    );

    // res.json(user.rows[0]);
    res.json({ username: req.user.username });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error')
  }
});

module.exports = router;