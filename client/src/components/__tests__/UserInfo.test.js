import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import UserInfo from '../../Dashboard/UserInfo';
import Login from '../Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('UserInfo Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    const useNavigate = require('react-router-dom').useNavigate;
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();
  });

  it('should redirect to /login if no user is present', async () => {
    render(
      <MemoryRouter initialEntries={['/userinfo']}>
        <UserContext.Provider value={{ currentUser: null }}>
          <Routes>
            <Route path="/userinfo" element={<UserInfo />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display User Info values from fetched data', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockUserInfoData = {
      userBodyInfoData: { 
        user_age: 35, 
        user_weight: 230,
        user_height: 75,
        user_waist: 36,
        user_neck: 20,
        user_hip: 33,
        user_fitness_level: 'intermediate' }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUserInfoData)
      })
    );

    render(
      <MemoryRouter initialEntries={['/userinfo']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/userinfo" element={<UserInfo />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Age: 35/i)).toBeInTheDocument();
      expect(screen.getByText(/Weight: 230/i)).toBeInTheDocument();
      expect(screen.getByText(/Height: 75/i)).toBeInTheDocument();
      expect(screen.getByText(/Waist: 36/i)).toBeInTheDocument();
      expect(screen.getByText(/Neck: 20/i)).toBeInTheDocument();
      expect(screen.getByText(/Hip: 33/i)).toBeInTheDocument();
      expect(screen.getByText(/Fitness Level: intermediate/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  it('should display error message if data fetching fails', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('API Error'))
    );

    console.error = jest.fn();

    render(
      <MemoryRouter initialEntries={['/userinfo']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/userinfo" element={<UserInfo />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error getting User Info');
    });

    global.fetch.mockRestore();
    console.error.mockRestore();
  });
});