require('dotenv').config({ path: 'D:/Capstone-Project/GetFit/Server/.env' });
const request = require('supertest');
const bcrypt = require('bcrypt');
const express = require('express');
const authRoutes = require('../auth'); 
const pool = require('../../db');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

jest.mock('../../db', () => {
  return {
    query: jest.fn()
  };
});

jest.mock('../../utils/jwtGenerator', () => jest.fn());
const jwtGenerator = require('../../utils/jwtGenerator');
const mockBcryptCompare = jest.spyOn(bcrypt, 'compare');

describe('POST /auth/register', () => {
  let server;
  let PORT;

  beforeAll((done) => {
    server = app.listen(0, () => {
      PORT = server.address().port;
      console.log(`Test server running on port ${PORT}`);
      done();
    }).on('error', (err) => {
      console.error('Test server failed to start:', err);
      done(err);
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(() => {
        console.log('Test server closed');
        done();
      });
    } else {
      done();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should check for existing user with SELECT query', async () => {
    const userData = {
      username: 'newuser',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    const existingUser = {
      user_id: 1,
      user_username: 'newuser',
      user_password: 'hashedPassword', 
      user_firstName: 'John',
      user_lastName: 'Doe',
      user_email: 'john.doe@example.com'
    };
    
    pool.query.mockResolvedValueOnce({ rows: [existingUser] });

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(pool.query).toHaveBeenCalledWith(`SELECT * FROM users WHERE user_username = $1`, [userData.username]
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual({});
  });

  test('should insert new user with INSERT query', async () => {
    const userData = {
      username: 'newuser',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    pool.query.mockResolvedValueOnce({ rows: [] });

    jest.spyOn(bcrypt, 'hash').mockImplementation(async (password, saltRounds) => {
      return `$2b$12$mockHashedPassword`; 
    });
  
    const hashedPassword = await bcrypt.hash(userData.password, 12);
  
    const newUser = {
      user_id: 1,
      user_username: userData.username,
      user_password: hashedPassword,
      user_firstName: userData.firstName,
      user_lastName: userData.lastName,
      user_email: userData.email
    };

    pool.query.mockResolvedValueOnce({ rows: [newUser] });
  
    const jwtGenerator = require('../../utils/jwtGenerator');
    jwtGenerator.mockReturnValue('mockedToken');
  
    const response = await request(app)
      .post('/auth/register')
      .send(userData);
  
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      `SELECT * FROM users WHERE user_username = $1`, [userData.username]
    );
    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      `INSERT INTO users (user_username, user_password, user_firstName, user_lastName, user_email) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
      [userData.username, hashedPassword, userData.firstName, userData.lastName, userData.email]
    );
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ jwtToken: 'mockedToken' });
  });
});

describe('POST /auth/login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should log in successfully with correct credentials', async () => {
    const mockUser = {
      user_id: 1,
      user_username: 'testuser',
      user_password: '$2b$12$mockHashedPassword' 
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    mockBcryptCompare.mockResolvedValueOnce(true);

    jest.mock('../../utils/jwtGenerator');
    const jwtGenerator = require('../../utils/jwtGenerator');
    jwtGenerator.mockReturnValue('mockedToken');

    const loginData = {
      username: 'testuser',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(pool.query).toHaveBeenCalledWith(`SELECT user_id, user_username, user_password FROM users WHERE user_username = $1`, ['testuser']
    );

    expect(mockBcryptCompare).toHaveBeenCalledWith('password123', '$2b$12$mockHashedPassword');
    expect(jwtGenerator).toHaveBeenCalledWith(1, 'testuser');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ jwtToken: 'mockedToken' });
  });

  test('should return 401 for invalid credentials', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const loginData = {
      username: 'invaliduser',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(pool.query).toHaveBeenCalledWith(`SELECT user_id, user_username, user_password FROM users WHERE user_username = $1`, ['invaliduser']
    );

    expect(mockBcryptCompare).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.text).toBe('{"message":"Invalid Credential"}');
  });

  test('should return 401 for invalid password', async () => {
    const mockUser = {
      user_id: 1,
      user_username: 'testuser',
      user_password: '$2b$12$mockHashedPassword' 
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    mockBcryptCompare.mockResolvedValueOnce(false);

    const loginData = {
      username: 'testuser',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(pool.query).toHaveBeenCalledWith(`SELECT user_id, user_username, user_password FROM users WHERE user_username = $1`, ['testuser']
    );

    expect(mockBcryptCompare).toHaveBeenCalledWith('wrongpassword', '$2b$12$mockHashedPassword');
    expect(response.status).toBe(401);
    expect(response.text).toBe('{"message":"Invalid Credential"}');
  });

  test('should return 500 for server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const loginData = {
      username: 'testuser',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(pool.query).toHaveBeenCalledWith(`SELECT user_id, user_username, user_password FROM users WHERE user_username = $1`, ['testuser']
    );

    expect(mockBcryptCompare).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});