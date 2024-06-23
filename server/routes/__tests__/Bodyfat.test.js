const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bmiRoutes = require('../bmi'); 
const pool = require('../../db'); 

jest.mock('../../db'); 

const app = express();
app.use(bodyParser.json());
app.use('/bmi', bmiRoutes); 

describe('POST /bmi/bodyfat/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and insert bodyfat data when no existing record', async () => {
    const userId = '123';
    const navyBFP = 18.5;
    const bodyfatExpectedResponse = { user_id: userId, navy_bfp: navyBFP };

    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    pool.query.mockResolvedValueOnce({ rows: [bodyfatExpectedResponse], rowCount: 1 });

    const response = await request(app)
      .post(`/bmi/bodyfat/${userId}`)
      .send({ navyBFP });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userBodyfatData: bodyfatExpectedResponse });

    expect(pool.query).toHaveBeenNthCalledWith(
      1, 
      `SELECT * FROM bodyfat WHERE user_id = $1`, 
      [userId]
    );

    expect(pool.query).toHaveBeenNthCalledWith(
      2, 
      `INSERT INTO bodyfat (user_id, navy_bfp, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, 
      [userId, navyBFP]
    );
  });

  test('should return 200 and update bodyfat data when existing record found', async () => {
    const userId = '123';
    const navyBFP = 18.5;
    const bodyfatExistingResponse = { user_id: userId, navy_bfp: 20.0 };
    const bodyfatUpdatedResponse = { user_id: userId, navy_bfp: navyBFP };

    pool.query.mockResolvedValueOnce({ rows: [bodyfatExistingResponse], rowCount: 1 });
    pool.query.mockResolvedValueOnce({ rows: [bodyfatUpdatedResponse], rowCount: 1 });

    const response = await request(app)
      .post(`/bmi/bodyfat/${userId}`)
      .send({ navyBFP });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userBodyfatData: bodyfatUpdatedResponse });

    expect(pool.query).toHaveBeenNthCalledWith(
      1, 
      `SELECT * FROM bodyfat WHERE user_id = $1`, 
      [userId]
    );

    expect(pool.query).toHaveBeenNthCalledWith(
      2, 
      `UPDATE bodyfat SET navy_bfp = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *`, 
      [userId, navyBFP]
    );
  });

  test('should return 404 if userId is missing', async () => {
    const navyBFP = 18.5; 

    const response = await request(app)
      .post(`/bmi/bodyfat/`)
      .send({ navyBFP });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  test('should return 400 if navyBFP is missing', async () => {
    const userId = '123';

    const response = await request(app)
      .post(`/bmi/bodyfat/${userId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Navy BFP data is missing' });
  });

  test('should return 500 on server error', async () => {
    const userId = '123';
    const navyBFP = 18.5;

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/bmi/bodyfat/${userId}`)
      .send({ navyBFP });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});

describe('GET /bmi/bodyfat/:userId', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and bodyfat data', async () => {
    const userId = '123';
    const mockBodyfatData = { navy_bfp: 18.5 };

    pool.query.mockResolvedValueOnce({ rows: [mockBodyfatData] });

    const response = await request(app)
      .get(`/bmi/bodyfat/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.userBodyfatData).toEqual(mockBodyfatData);
    expect(pool.query).toHaveBeenCalledWith(`
    SELECT navy_BFP FROM bodyfat WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`, [userId]
    );
  });

  test('should return 404 if userId is missing', async () => {
    const response = await request(app)
      .get('/bmi/bodyfat/')
      .send();

    expect(response.status).toBe(404); 
    expect(response.body).toEqual({});
  });

  test('should return 400 if bodyfat data not found', async () => {
    const userId = '999';

    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .get(`/bmi/bodyfat/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bodyfat data not found' });
  });

  test('should return 500 on server error', async () => {
    const userId = '123';
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/bmi/bodyfat/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});