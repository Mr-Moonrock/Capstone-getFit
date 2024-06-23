import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import FFMI from '../../Dashboard/FFMI';
import Login from '../Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('FFMI Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    const useNavigate = require('react-router-dom').useNavigate;
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();
  });

  it('should redirect to /login if no user is present', async () => {
    render(
      <MemoryRouter initialEntries={['/ffmi']}>
        <UserContext.Provider value={{ currentUser: null }}>
          <Routes>
            <Route path="/ffmi" element={<FFMI />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display FFMI, Fat Free Mass and Total Body Fat values from fetched data', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockFfmiData = {
      userFfmiData: { ffmi: 58, fat_free_mass: 170, total_body_fat: 19 }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFfmiData)
      })
    );

    render(
      <MemoryRouter initialEntries={['/ffmi']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/ffmi" element={<FFMI />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/FFMI: 58/i)).toBeInTheDocument();
      expect(screen.getByText(/Fat Free Mass: 170/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Body Fat: 19/i)).toBeInTheDocument();
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
      <MemoryRouter initialEntries={['/ffmi']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/ffmi" element={<FFMI />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error getting FFMI values');
    });

    global.fetch.mockRestore();
    console.error.mockRestore();
  });
});