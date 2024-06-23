import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import AjBW from '../../Dashboard/AjBW';
import Login from '../Login';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('AjBW Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    const useNavigate = require('react-router-dom').useNavigate;
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();
  });

  it('should redirect to /login if no user is present', async () => {
    render(
      <MemoryRouter initialEntries={['/ajbw']}>
        <UserContext.Provider value={{ currentUser: null }}>
          <Routes>
            <Route path="/ajbw" element={<AjBW />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display AjBW and Ideal Body Weight values from fetched data', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockAjbwData = {
      userAjbwData: { ajbw: 75, ibw_robinson: 70 }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAjbwData)
      })
    );

    render(
      <MemoryRouter initialEntries={['/ajbw']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/ajbw" element={<AjBW />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/AjBW: 75/i)).toBeInTheDocument();
      expect(screen.getByText(/Ideal Body Weight: 70/i)).toBeInTheDocument();
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
      <MemoryRouter initialEntries={['/ajbw']}>
        <UserContext.Provider value={{ currentUser: mockUser }}>
          <Routes>
            <Route path="/ajbw" element={<AjBW />} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error getting AjBW values');
    });

    global.fetch.mockRestore();
    console.error.mockRestore();
  });
});