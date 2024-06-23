const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const calendarRoutes = require('../calendar'); 
const pool = require('../../db'); 
const jwt = require('jsonwebtoken');

jest.mock('../../db');

const app = express();
app.use(bodyParser.json());
app.use('/calendar', calendarRoutes); 

describe('POST /calendar/:userId', () => {
  const token = jwt.sign({ userId: 'testUser' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  beforeEach(() => {
    pool.query.mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and insert exercises successfully', async () => {
    const exercises = [
      {
        userId: 'testUser',
        name: 'Running',
        exerciseDate: '2024-06-20',
        exerciseDayOfWeek: 'Monday',
        exerciseStartTime: '06:00:00',
        exerciseEndTime: '07:00:00'
      }
    ];

    pool.query.mockResolvedValueOnce({ rows: [exercises[0]] });

    const response = await request(app)
      .post('/calendar/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send(exercises);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([exercises[0]]);
  });

  test('should return 400 for invalid or empty exercises array', async () => {
    const response = await request(app)
      .post('/calendar/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send([]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: 'Invalid or empty exercises array' });
  });

  test('should return 400 for missing fields in exercise', async () => {
    const exercises = [
      {
        userId: 'testUser',
        name: 'Running',
        exerciseDate: '2024-06-20'
      }
    ];

    const response = await request(app)
      .post('/calendar/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send(exercises);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: 'Missing fields in exercise' });
  });

  // test('should return 403 for invalid authorization token', async () => {
  //   const invalidToken = jwt.sign({ userId: 'testUser' }, 'wrong_secret', { expiresIn: '1h' });

  //   const response = await request(app)
  //     .post('/exercises')
  //     .set('Authorization', `Bearer ${invalidToken}`)
  //     .send([]);

  //   expect(response.status).toBe(403);
  // });

  test('should return 500 on server error', async () => {
    const exercises = [
      {
        userId: 'testUser',
        name: 'Running',
        exerciseDate: '2024-06-20',
        exerciseDayOfWeek: 'Monday',
        exerciseStartTime: '06:00:00',
        exerciseEndTime: '07:00:00'
      }
    ];

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/calendar/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send(exercises);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});

describe('GET /sevenDay/:userId', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 and next seven days exercises', async () => {
    const userId = 'testUser';
    const mockExercises = [
      {
        exercise_name: 'Running',
        formatted_date: '06/19/2024',
        start_time: '06:00am',
        end_time: '07:00am'
      }
    ];

    pool.query.mockResolvedValueOnce({ rows: mockExercises });

    const response = await request(app)
      .get(`/calendar/sevenDay/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockExercises.map(exercise => ({
      userId: userId,
      exercise_name: exercise.exercise_name,
      time_range: `${exercise.start_time}-${exercise.end_time}`,
      formatted_date: exercise.formatted_date
    })));
  });

  test('should return 404 if userId is missing', async () => {
    const response = await request(app)
      .get('/calendar/sevenDay/');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  test('should return 500 on server error', async () => {
    const userId = 'testUser';
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/calendar/sevenDay/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});

