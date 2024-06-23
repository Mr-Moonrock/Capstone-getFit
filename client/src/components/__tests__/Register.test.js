import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Register from '../Register';

jest.mock('../../images/logoImage.jpg', () => 'mockedImagePath');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Register component', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders headings correctly', () => {
    renderWithRouter(<Register />);
    expect(screen.getByRole('heading', { level: 2, name: /Get Fit/i})).toBeInTheDocument();
  })

  test('Does images render', () => {
    renderWithRouter(<Register />)
    const logoImage = screen.getByAltText('logoImage');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mockedImagePath')
  });

  test('renders the form elements', () => {
    renderWithRouter(<Register />);
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('first name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('last name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e-mail')).toBeInTheDocument();
  });

  test('renders paragraphs correctly', () => {
    renderWithRouter(<Register />);
    expect(screen.getByText(/Already a member\?/i)).toBeInTheDocument();
  });

  test('handles user input', () => {
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('first name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('e-mail'), { target: { value: 'john@example.com' } });
    
    expect(screen.getByPlaceholderText('username').value).toBe('testuser');
    expect(screen.getByPlaceholderText('password').value).toBe('password');
    expect(screen.getByPlaceholderText('first name').value).toBe('John');
    expect(screen.getByPlaceholderText('last name').value).toBe('Doe');
    expect(screen.getByPlaceholderText('e-mail').value).toBe('john@example.com');
  });

  test('handles form submission', async () => {
    axios.post.mockResolvedValue({ data: { jwtToken: 'test-token' } });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('first name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('e-mail'), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/auth/register', {
        username: 'testuser',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  test('navigates to login on successful registration', async () => {
    axios.post.mockResolvedValue({ data: { jwtToken: 'test-token' } });

    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('first name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('e-mail'), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });
});