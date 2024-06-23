import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import THR from '../../Dashboard/THR';
import Login from '../Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('THR Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    const useNavigate = require('react-router-dom').useNavigate;
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();
  });

  it('should redirect to /login if no user is present', async () => {
    render(
      <MemoryRouter initialEntries={['/thr']}>
        <UserContext.Provider value={{ currentUser: null }}>
          <Routes>
            <Route path="/thr" element={<THR />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display THR Min and Max values from fetched data', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockTHRData = {
      userThrData: { thr_min: 65, thr_max: 170 }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTHRData)
      })
    );

    render(
      <MemoryRouter initialEntries={['/thr']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/thr" element={<THR />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/THR Max: 170/i)).toBeInTheDocument();
      expect(screen.getByText(/THR Min: 65/i)).toBeInTheDocument();
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
      <MemoryRouter initialEntries={['/thr']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/thr" element={<THR />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error getting thr values');
    });

    global.fetch.mockRestore();
    console.error.mockRestore();
  });

});