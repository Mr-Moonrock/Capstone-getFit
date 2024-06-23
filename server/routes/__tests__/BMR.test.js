const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bmiRoutes = require('../bmi'); 
const pool = require('../../db'); 


jest.mock('../../db'); 

const app = express();
app.use(bodyParser.json());
app.use('/bmi', bmiRoutes); 

describe('POST /bmi/bmr/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should insert BMR data and return the inserted row', async () => {
    const userId = '123';
    const bmrData = 1800;
    const bmrExpectedResponse = { user_id: userId, bmr: bmrData };

    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    pool.query.mockResolvedValueOnce({ rows: [bmrExpectedResponse], rowCount: 1 });

    const response = await request(app)
        .post(`/bmi/bmr/${userId}`)
        .send({ bmrData });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(bmrExpectedResponse);
    // expect(pool.query).toHaveBeenCalledWith(
    //   1,
    //   `SELECT * FROM bmr WHERE user_id = $1`, 
    //   [userId]
    // );
    // expect(pool.query).toHaveBeenCalledWith(
    //   2,
    //   `INSERT INTO bmr (user_id, bmr, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, 
    //   [userId, bmrData]);
});

  test('should return 404 if userId is missing (BMR)', async () => {
    const bmrData = 1800;

    const response = await request(app)
      .post(`/bmi/bmr/`)
      .send({ bmrData });

    expect(response.status).toBe(404); 
    expect(response.body).toEqual({});
  });

  test('should return 500 if there is a database error (BMR)', async () => {
    const userId = '123';
    const bmrData = 1800;

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/bmi/bmr/${userId}`)
      .send({ bmrData });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});

describe('GET /bmi/bmr/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and BMR data', async () => {
    const userId = '123';
    const mockBMRData = { bmr: 1800 };

    pool.query.mockResolvedValueOnce({
      rows: [mockBMRData]
    });

    const response = await request(app)
      .get(`/bmi/bmr/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.userBmrData).toEqual(mockBMRData);
  });

  test('should return 404 if userId is missing', async () => {
    const response = await request(app)
      .get('/bmi/bmr/');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  test('should return 400 if BMR data not found', async () => {
    const userId = '999'; 

    pool.query.mockResolvedValueOnce({
      rows: []
    });

    const response = await request(app)
      .get(`/bmi/bmr/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'BMR data not found' });
  });

  test('should return 500 on server error', async () => {
    const userId = '123';
    
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/bmi/bmr/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
  });


