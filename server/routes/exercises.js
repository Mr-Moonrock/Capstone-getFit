const router = require('express').Router();
const pool = require('../db');
require('dotenv').config();

// get all workouts by body part 
router.post('/', async (req, res) => {
  try {
    const { bodyPart } = req.body;

    const exercises = await pool.query(`
      SELECT * FROM exercises WHERE body_part = $1`,
      [bodyPart]
    );
    res.json(exercises.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});


module.exports = router;