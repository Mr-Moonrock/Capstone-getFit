import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../Login';
import { UserContext } from '../../UserContext';

jest.mock('../../images/logoImage.jpg', () => 'mockedImagePath');
jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Login component', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'setItem');
    mockNavigate.mockReset();  
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui, { contextValue } = {}) => {
    return render(
      <UserContext.Provider value={contextValue}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </UserContext.Provider>
    );
  };

  test('renders login form when currentUser is null', () => {
    renderWithRouter(<Login />, { contextValue: { currentUser: null, setCurrentUser: jest.fn() } });
    expect(screen.getByRole('heading', { level: 2, name: /Get Fit/i})).toBeInTheDocument();
    const logoImage = screen.getByAltText('logoImage');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mockedImagePath');
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
  });

  test('calls navigate to /dashboard on successful login', async () => {
    const setCurrentUser = jest.fn();
    axios.post.mockResolvedValueOnce({
      data: { jwtToken: 'testToken' },
    });
    axios.post.mockResolvedValueOnce({
      data: { user_username: 'testuser', user_id: '123' },
    });

    renderWithRouter(<Login />, { contextValue: { currentUser: null, setCurrentUser } });

    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(setCurrentUser).toHaveBeenCalledWith({
        username: 'testuser',
        id: '123',
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('displays error message on failed login', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid username or password'));

    renderWithRouter(<Login />, { contextValue: { currentUser: null, setCurrentUser: jest.fn() } });

    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
