const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bmiRoutes = require('../bmi'); 
const pool = require('../../db'); 

jest.mock('../../db'); 

const app = express();
app.use(bodyParser.json());
app.use('/bmi', bmiRoutes); 

describe('POST /bodyInfo/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should return 200 and update existing user body info for bmr form', async () => {
    const userId = 'user123';
    const requestData = { weight: 80 };
    const mockExistingData = { user_id: userId, user_weight: 70 }; 
    const mockUpdatedData = { user_id: userId, user_weight: 80 }; 
  
    pool.query
      .mockResolvedValueOnce({ rows: [mockExistingData] }) 
      .mockResolvedValueOnce({ rows: [mockUpdatedData] }); 
  
    const response = await request(app)
      .post(`/bmi/bodyInfo/${userId}`)
      .send({ formName: 'bmr', ...requestData });
  
    expect(response.status).toBe(200);
    expect(response.body.user_weight).toBe(80);
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  test('should return 200 and insert new user body info for bodyfat form', async () => {
    const userId = 'user123';
    const requestData = {
      age: 30,
      height: 170,
      gender: 'male',
      waist: 32,
      neck: 20,
      hip: 40,
    };
    const mockResponse = {
      rows: [{ user_age: 30, user_height: 170, user_gender: 'male', user_waist: 32, user_neck: 20, user_hip: 40 }],
    };
    pool.query
      .mockResolvedValueOnce({ rows: [] }) 
      .mockResolvedValueOnce(mockResponse); 

    const response = await request(app)
      .post(`/bmi/bodyInfo/${userId}`)
      .send({ formName: 'bodyfat', ...requestData });

    expect(response.status).toBe(200);
    expect(response.body.user_age).toBe(30);
    expect(response.body.user_height).toBe(170);
    expect(response.body.user_gender).toBe('male');
    expect(pool.query).toHaveBeenCalledTimes(2); 
  });

  test('should return 200 and update existing user body info for thr form', async () => {
    const userId = 'user123';
    const requestData = { fitnessLevel: 'beginner' };
    const mockExistingData = { user_id: userId, user_fitness_level: 'intermediate' }; 
    const mockUpdatedData = { user_id: userId, user_fitness_level: 'beginner' }; 

    pool.query
      .mockResolvedValueOnce({ rows: [mockExistingData] }) 
      .mockResolvedValueOnce({ rows: [mockUpdatedData] }); 

    const response = await request(app)
      .post(`/bmi/bodyInfo/${userId}`)
      .send({ formName: 'thr', ...requestData });

    expect(response.status).toBe(200);
    expect(response.body.user_fitness_level).toBe('beginner');
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  test('should return 500 if there is a database error', async () => {
    const userId = 'user123';
    const formName = 'bodyfat';
    const bodyInfoData = { age: 25, height: 75 };

    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post(`/bmi/bodyInfo/${userId}`)
      .send({ formName, ...bodyInfoData });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });

  test('should return 404 if userId is missing', async () => {
    const formName = 'bodyfat';
    const bodyInfoData = { age: 25, weight: 75 };

    const response = await request(app)
      .post('/bmi/bodyInfo/')
      .send({ formName, ...bodyInfoData });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

describe('GET /bodyInfo/:userId', () => {
  beforeEach(() => {
    pool.query.mockClear();
  });
  
  afterAll(async () => {
    await pool.end();
  });
  
  test('should return 200 and user body info data', async () => {
    const userId = '123';
    const mockBodyInfoData = {
      user_age: 25,
      user_weight: 75,
      user_height: 180,
      user_gender: 'male',
      user_waist: 32,
      user_neck: 15,
      user_hip: 40,
      user_fitness_level: 'intermediate',
      user_bodyfat: 12.5,
    };

    pool.query.mockResolvedValueOnce({ rows: [mockBodyInfoData] });

    const response = await request(app)
      .get(`/bmi/bodyInfo/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.userBodyInfoData).toEqual(mockBodyInfoData);

    expect(pool.query).toHaveBeenCalledWith(
      `SELECT user_age, user_weight, user_height, user_gender, user_waist, user_neck, user_hip, user_fitness_level, user_bodyfat 
      FROM user_body_info 
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1`, 
      [userId]
    );
  });
  
  test('should return 404 if userId is missing', async () => {
    const response = await request(app)
      .get('/bmi/bodyInfo/')

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
  
  test('should return 400 if user body info data not found', async () => {
    const userId = '999';

    pool.query.mockResolvedValueOnce({
      rows: []
    });

    const response = await request(app)
      .get(`/bmi/bodyInfo/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'User Body Info not found' });
  });
  
  test('should return 500 on server error', async () => {
    const userId = '123';
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get(`/bmi/bodyInfo/${userId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });  
});