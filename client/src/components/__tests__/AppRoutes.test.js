import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserContext } from '../../UserContext'; 
import '@testing-library/jest-dom/extend-expect';
import AppRoutes from '../../routes-nav/AppRoutes';
import { MemoryRouter } from 'react-router-dom';


jest.mock('../../images/logoImage.jpg', () => 'mockedImagePath');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('AppRoutes Component', () => {

  test('renders Homepage when user is not logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Improve Yourself\./i)).toBeInTheDocument();
    expect(screen.getByText(/Create Your Workout Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate Your BMI/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Your Workout Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Your Lifestyle\./i)).toBeInTheDocument();
  });

  test('renders Dashboard component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Daily Motivation/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Heart Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Adjustable Body Weight/i)).toBeInTheDocument();
    expect(screen.getByText(/Basal Metabolic Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Fat-Free Mass Index/i)).toBeInTheDocument();
  });

  test('renders Cardio Info component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/cardioInfo']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/What is Cardio\??/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardio Information/i)).toBeInTheDocument();
    expect(screen.getByText(/The Benefits of Cardio/i)).toBeInTheDocument();
  });

  test('renders Cardio component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/cardio']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Cardiovascular system/i)).toBeInTheDocument();
  });

  test('renders Arms component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/arms']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/triceps/i)).toBeInTheDocument();
    expect(screen.getByText(/biceps/i)).toBeInTheDocument();
  });

  test('renders Back component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/back']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/upper back/i)).toBeInTheDocument();
    expect(screen.getByText(/lats/i)).toBeInTheDocument();
    expect(screen.getByText(/spine/i)).toBeInTheDocument();
    expect(screen.getByText(/traps/i)).toBeInTheDocument();
  });

  test('renders Legs component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/legs']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/quads/i)).toBeInTheDocument();
    expect(screen.getByText(/abductors/i)).toBeInTheDocument();
    expect(screen.getByText(/adductors/i)).toBeInTheDocument();
    expect(screen.getByText(/glutes/i)).toBeInTheDocument();
    expect(screen.getByText(/hamstrings/i)).toBeInTheDocument();
  });

  test('renders Neck component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/neck']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/levator scapulae/i)).toBeInTheDocument();
  });

  test('renders Abs component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/Abs']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/abs/i)).toBeInTheDocument();
  });

  test('renders Shoulders component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/shoulders']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/delts/i)).toBeInTheDocument();
  });

  test('renders Chest component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/chest']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/pectorals/i)).toBeInTheDocument();
    expect(screen.getByText(/serratus anterior/i)).toBeInTheDocument();
  });

  test('renders Lifestyle Changes component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/lifestyleChanges']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Eat a healthy diet/i)).toBeInTheDocument();
    expect(screen.getByText(/Be physically active/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintain a healthy weight and body fat percentage/i)).toBeInTheDocument();
    expect(screen.getByText(/Drink alcohol in moderation/i)).toBeInTheDocument();
    expect(screen.getByText(/Get adequate sleep/i)).toBeInTheDocument();
    expect(screen.getByText(/Reduce stress and anxiety/i)).toBeInTheDocument();
  });

  test('renders Lifestyle Changes component when user is not logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <MemoryRouter initialEntries={['/lifestyleChanges']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Eat a healthy diet/i)).toBeInTheDocument();
    expect(screen.getByText(/Be physically active/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintain a healthy weight and body fat percentage/i)).toBeInTheDocument();
    expect(screen.getByText(/Drink alcohol in moderation/i)).toBeInTheDocument();
    expect(screen.getByText(/Get adequate sleep/i)).toBeInTheDocument();
    expect(screen.getByText(/Reduce stress and anxiety/i)).toBeInTheDocument();
  });

  test('renders BMI Info component when user is logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/bmiInfo']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/BMI Category and Table/i)).toBeInTheDocument();
    expect(screen.getByText(/How to measure for the calculation\??/i)).toBeInTheDocument();
    expect(screen.getByText(/Body Compositon/i)).toBeInTheDocument();
  });

  test('renders Bmi Info component when user is not logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <MemoryRouter initialEntries={['/bmiInfo']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/BMI Category and Table/i)).toBeInTheDocument();
    expect(screen.getByText(/How to measure for the calculation\??/i)).toBeInTheDocument();
    expect(screen.getByText(/Body Compositon/i)).toBeInTheDocument();
  });

  test('renders Login component when user is not logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Get Fit/i})).toBeInTheDocument();
    const logoImage = screen.getByAltText('logoImage');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mockedImagePath')
  });

  test('renders Register component when user is not logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <MemoryRouter initialEntries={['/register']}>
          <AppRoutes />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Get Fit/i})).toBeInTheDocument();
    const logoImage = screen.getByAltText('logoImage');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mockedImagePath')
  });

});