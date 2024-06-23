require('dotenv').config();
const pool = require('../db');
const authorize = require('../middleware/authorize');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post('/exercises', authenticateToken, async (req, res) => {
  try {
    const exercises = req.body; 

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ msg: 'Invalid or empty exercises array' });
    }

    for (const exercise of exercises) {
      const { userId, name, exerciseDate, exerciseDayOfWeek, exerciseStartTime, exerciseEndTime } = exercise;
      if (!userId || !name || !exerciseDate || !exerciseDayOfWeek || !exerciseStartTime || !exerciseEndTime) {

        return res.status(400).json({ msg: 'Missing fields in exercise' });
      }
    }
    const insertPromises = exercises.map(async (exercise) => {
      const { userId, name, exerciseDate, exerciseDayOfWeek, exerciseStartTime, exerciseEndTime } = exercise;

      const result = await pool.query(`
        INSERT INTO calendar (user_id, exercise_name, exercise_date, exercise_day_of_week, exercise_start_time, exercise_end_time)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, exercise_date, exercise_start_time) DO NOTHING
        RETURNING *`,
        [userId, name, exerciseDate, exerciseDayOfWeek, exerciseStartTime, exerciseEndTime]
      );
      return result.rows[0];
    });

    const newStoredExercises = (
      await Promise.all(insertPromises)).filter(row => row !== undefined
    );
    res.json(newStoredExercises);
  } catch (err) {
    console.error('Error in inserting exercises:', err.message);
    res.status(500).send('Server error');
  }
});

router.get('/sevenDay/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const nextSevenDays = new Date();
    nextSevenDays.setDate(nextSevenDays.getDate() + 7);

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    }

    const formattedDate = `${
      nextSevenDays.getMonth() + 1
    }/${nextSevenDays.getDate()}/${nextSevenDays.getFullYear()}`;

    const query = `
      SELECT exercise_name, 
        TO_CHAR(exercise_date, 'MM/DD/YYYY') AS formatted_date,
        TO_CHAR(exercise_start_time, 'HH12:MIam') AS start_time,
        TO_CHAR(exercise_end_time, 'HH12:MIpm') AS end_time
        FROM calendar
        WHERE exercise_date BETWEEN CURRENT_DATE AND $1
        AND user_id = $2`;

    const sevenDayExerciseForecast = await pool.query(query, [formattedDate, userId]);
    const formattedExercises = sevenDayExerciseForecast.rows.map((exercise) => ({
      userId: userId,
      exercise_name: exercise.exercise_name,
      time_range: `${exercise.start_time}-${exercise.end_time}`,
      formatted_date: exercise.formatted_date,
    }));

    res.json(formattedExercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
})

module.exports = router;
