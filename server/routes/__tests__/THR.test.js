const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bmiRoutes = require('../bmi'); 
const pool = require('../../db'); 

jest.mock('../../db'); 

const app = express();
app.use(bodyParser.json());
app.use('/bmi', bmiRoutes); 

describe('POST /thr/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and insert thr data when no existing record', async () => {
    const userId = '123';
    const thrMax = 180;
    const thrMin = 120;
    const thrExpectedResponse = { user_id: userId, thr_max: thrMax, thr_min: thrMin}

    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    pool.query.mockResolvedValueOnce({ rows: [thrExpectedResponse], rowCount: 1 });
    
    const response = await request(app)
      .post(`/bmi/thr/${userId}`)
      .send({ thrMax, thrMin });
    
    expect(response.status).toBe(200);
    expect(response.body.userThrData).toEqual(thrExpectedResponse);
    expect(pool.query).toHaveBeenCalledWith(`
    SELECT * FROM THR WHERE user_id = $1`, [userId]
    );
    // expect(pool.query).toHaveBeenCalledWith(
    //   `INSERT INTO THR (user_id, thr_max, thr_min, created_at, updated_at) 
    //   VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, [userId, thrMax, thrMin]
    // );
  });

  test('should return 400 if thrMax or thrMin is missing', async () => {
    const userId = '123';
    const thrMax = 180;

    const response = await request(app)
      .post(`/bmi/thr/${userId}`)
      .send({ thrMax }); 

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'THR data is missing' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('should return 500 if there is a database error (THR)', async () => {
    const userId = '123';
    const thrMax = 180;
    const thrMin = 120;

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/bmi/thr/${userId}`)
      .send({ thrMax, thrMin });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });

  test('should return 404 if userId is missing', async () => {
    const thrMax = 180;
    const thrMin = 120;

    const response = await request(app)
      .post(`/bmi/thr/`) 
      .send({ thrMax, thrMin });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

describe('GET /thr/:userId', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and THR data', async () => {
    const userId = '123';
    const mockTHRData = { thr_max: 180, thr_min: 120 }; 

    pool.query.mockResolvedValueOnce({
      rows: [mockTHRData]
    });

    const response = await request(app)
      .get(`/bmi/thr/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.userThrData).toEqual(mockTHRData);
  });

  test('should return 404 if userId is missing', async () => {
    const response = await request(app)
      .get('/bmi/thr/');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  test('should return 400 if THR data not found', async () => {
    const userId = '999'; 

    pool.query.mockResolvedValueOnce({
      rows: []
    });

    const response = await request(app)
      .get(`/bmi/thr/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'THR data not found' });
  });

  test('should return 500 on server error', async () => {
    const userId = '123';
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/bmi/thr/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});