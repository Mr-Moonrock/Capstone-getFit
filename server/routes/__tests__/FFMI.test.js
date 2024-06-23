const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bmiRoutes = require('../bmi'); 
const pool = require('../../db'); 

jest.mock('../../db'); 

const app = express();
app.use(bodyParser.json());
app.use('/bmi', bmiRoutes); 

describe('POST /ffmi/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and insert FFMI data and return the inserted row', async () => {
    const userId = '123';
    const ffmi = 25.5;
    const fatFreeMass = 75.2;
    const totalBodyFat = 15.3;
    const ffmiExpectedResponse = { user_id: userId, ffmi: ffmi, fat_free_mass: fatFreeMass, total_body_fat: totalBodyFat };

    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    pool.query.mockResolvedValueOnce({ rows: [ffmiExpectedResponse], rowCount: 1 });

    const response = await request(app)
      .post(`/bmi/ffmi/${userId}`)
      .send({ ffmi, fatFreeMass, totalBodyFat });

    expect(response.status).toBe(200);
    expect(response.body.userFfmiData).toEqual(ffmiExpectedResponse);
    expect(pool.query).toHaveBeenNthCalledWith(
      1, 
      `SELECT * FROM ffmi WHERE user_id = $1`,
      [userId]
    );
    // expect(pool.query).toHaveBeenCalledWith(
    //   2,
    //   `INSERT INTO ffmi (user_id, ffmi, fat_free_mass, total_body_fat, created_at, updated_at) 
    //     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, 
    //     [userId, ffmi, fatFreeMass, totalBodyFat]
    //   );
  });
  
  test('should return 404 if userId is missing', async () => {
    const ffmi = 25.5;
    const fatFreeMass = 75.2;
    const totalBodyFat = 15.3;

    const response = await request(app)
      .post('/bmi/ffmi/')
      .send({ ffmi, fatFreeMass, totalBodyFat });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('should return 500 if there is a database error (FFMI)', async () => {
    const userId = '123';
    const ffmi = 25.5;
    const fatFreeMass = 75.2;
    const totalBodyFat = 15.3;

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/bmi/ffmi/${userId}`)
      .send({ ffmi, fatFreeMass, totalBodyFat });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });

  test('should return 400 if ffmi is missing', async () => {
    const userId = '123';
    const fatFreeMass = 75.2;
    const totalBodyFat = 15.3;

    const response = await request(app)
      .post(`/bmi/ffmi/${userId}`)
      .send({ fatFreeMass, totalBodyFat });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'FFMI data is missing' });
    expect(pool.query).not.toHaveBeenCalled();
  });
});

describe('GET /ffmi/:userId', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and FFMI data', async () => {
    const userId = '123';
    const mockFfmiData = { ffmi: 25, fat_free_mass: 65, total_body_fat: 15};

    pool.query.mockResolvedValueOnce({ rows: [mockFfmiData] });

    const response = await request(app)
      .get(`/bmi/ffmi/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.userFfmiData).toEqual(mockFfmiData);
    expect(pool.query).toHaveBeenCalledWith(`
      SELECT FFMI, fat_free_mass, total_body_fat FROM ffmi WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`, [userId]
    );
  });

  test('should return 404 if userId is missing', async () => {
    const response = await request(app).get('/bmi/ffmi/');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  test('should return 400 if FFMI data not found', async () => {
    const userId = '999';
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get(`/bmi/ffmi/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'FFMI data not found' });
  });

  test('should return 500 on server error', async () => {
    const userId = '123';
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/bmi/ffmi/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});
