const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bmiRoutes = require('../bmi'); 
const pool = require('../../db'); 

jest.mock('../../db'); 

const app = express();
app.use(bodyParser.json());
app.use('/bmi', bmiRoutes); 

describe('POST /ajbw/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should insert AjBW data and return the inserted row', async () => {
    const userId = '123';
    const ajbw = 26.4;
    const ibwRobinson = 20;
    const ajbwExpectedResponse = {
        user_id: userId,
        ajbw: ajbw,
        ibw_robinson: ibwRobinson,
  };
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    pool.query.mockResolvedValueOnce({ rows: [ajbwExpectedResponse], rowCount: 1 });
  

    const response = await request(app)
        .post(`/bmi/ajbw/${userId}`)
        .send({ ajbw, ibwRobinson });

    expect(response.status).toBe(200);
    expect(response.body.userAjbwData).toEqual(ajbwExpectedResponse);
    expect(pool.query).toHaveBeenNthCalledWith(
      1, 
      `SELECT * FROM ajbw WHERE user_id = $1`,
      [userId]
      );
    // expect(pool.query).toHaveBeenCalledWith(
    //   2,
    //   `INSERT INTO ajbw (user_id, ajbw, ibw_robinson, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, [userId, ajbw, ibwRobinson]
    //   );
});

  test('should return 500 if there is a database error', async () => {
    const userId = '123';
    const ajbw = 26.4;
    const ibwRobinson = 20;

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/bmi/ajbw/${userId}`)
      .send({ ajbw, ibwRobinson });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });

  test('should return 400 if userId is missing', async () => {
    const ajbw = 26.4;
    const ibwRobinson = 20;

    const response = await request(app)
      .post(`/bmi/ajbw/`) 
      .send({ ajbw, ibwRobinson });

    expect(response.status).toBe(404); 
  });

  test('should return 400 if ajbw is missing', async () => {
    const userId = '123';
    const ibwRobinson = 20;

    const response = await request(app)
      .post(`/bmi/ajbw/${userId}`)
      .send({ ibwRobinson });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'AjBW data is missing' });
  });

  test('should return 400 if ibwRobinson is missing', async () => {
    const userId = '123';
    const ajbw = 26.4;

    const response = await request(app)
      .post(`/bmi/ajbw/${userId}`)
      .send({ ajbw });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'AjBW data is missing' });
  });
});

describe('GET /bmi/ajbw/:userId', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and AjBW data', async () => {
    const userId = '123';
    const mockAjbwData = {
      ajbw: 70,
      ibw_robinson: 65
    };

    pool.query.mockResolvedValueOnce({
      rows: [mockAjbwData]
    });

    const response = await request(app)
      .get(`/bmi/ajbw/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.userAjbwData).toEqual(mockAjbwData);
  });

  test('should return 404 if userId is missing', async () => {
    const response = await request(app)
      .get('/bmi/ajbw/')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  test('should return 400 if AjBW data not found', async () => {
    const userId = '999';

    pool.query.mockResolvedValueOnce({
      rows: []
    });

    const response = await request(app)
      .get(`/bmi/ajbw/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'AjBW data not found' });
  });

  test('should return 500 on server error', async () => {
    const userId = '123';
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/bmi/ajbw/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});