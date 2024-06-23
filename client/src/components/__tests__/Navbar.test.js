import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '../../routes-nav/Navbar';
import { UserContext } from '../../UserContext'; 
import { ErrorBoundary } from 'react-error-boundary';
import Cardio from '../../userPages/exercises/Cardio';
import Arms from '../../userPages/exercises/Arms';
import Back from '../../userPages/exercises/Back';
import Legs from '../../userPages/exercises/Legs';
import Neck from '../../userPages/exercises/Neck';
import Abs from '../../userPages/exercises/Abs';
import Shoulders from '../../userPages/exercises/Shoulders';
import Chest from '../../userPages/exercises/Chest';
import Login from '../Login';
import Register from '../Register';
import BMI from '../BmiComponent/BMI';
import Calendar from '../../userPages/calendar/CalendarComp';
import LifestyleChanges from '../LifestyleChanges';
import Dashboard from '../../Dashboard/Dashboard';
import Homepage from '../Homepage';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Navbar Component', () => {
  const mockNavigate = require('react-router-dom').useNavigate;
  beforeEach(() => {
   
    mockNavigate.mockReset();
    mockNavigate.mockReturnValue(jest.fn());
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); 
  });

  test('renders login and register links when not logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <MemoryRouter initialEntries={['/']}>
          <Navbar />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders dashboard links when logged in', () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Navbar />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/BMI/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Lifestyle Changes/i)).toBeInTheDocument();
    expect(screen.getByText(/Exercises/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardio Info/i)).toBeInTheDocument();
  });

  test('renders Exercises dropdown menu', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Navbar />
        </MemoryRouter>
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Exercises' }));

    await waitFor(() => {
      expect(screen.getByText('Cardio')).toBeInTheDocument();
      expect(screen.getByText('Arms')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('Legs')).toBeInTheDocument();
      expect(screen.getByText('Neck')).toBeInTheDocument();
      expect(screen.getByText('Abs')).toBeInTheDocument();
      expect(screen.getByText('Shoulders')).toBeInTheDocument();
      expect(screen.getByText('Chest')).toBeInTheDocument();
    });
  });

  test('navigates to Cardio page when Cardio dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/cardio" element={<Cardio />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );

    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const cardioLink = screen.getByTestId('cardio-link');
    expect(cardioLink).toBeInTheDocument(); 
    fireEvent.click(cardioLink);

    await waitFor(() => {
      expect(screen.getByText(/cardiovascular system/i)).toBeInTheDocument();
    });
  });

  test('navigates to Arms page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/arms" element={<Arms />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const armsLink = screen.getByTestId('arms-link');
    expect(armsLink).toBeInTheDocument(); 
    fireEvent.click(armsLink);

    await waitFor(() => {
      expect(screen.getByText(/triceps/i)).toBeInTheDocument();
      expect(screen.getByText(/biceps/i)).toBeInTheDocument();
    });
  });

  test('navigates to Back page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/back" element={<Back />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const backLink = screen.getByTestId('back-link');
    expect(backLink).toBeInTheDocument(); 
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(screen.getByText(/upper back/i)).toBeInTheDocument();
      expect(screen.getByText(/lats/i)).toBeInTheDocument();
      expect(screen.getByText(/spine/i)).toBeInTheDocument();
      expect(screen.getByText(/traps/i)).toBeInTheDocument();
    });
  });

  test('navigates to Legs page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/legs" element={<Legs />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );

    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const legsLink = screen.getByTestId('legs-link');
    expect(legsLink).toBeInTheDocument(); 
    fireEvent.click(legsLink);

    await waitFor(() => {
      expect(screen.getByText(/quads/i)).toBeInTheDocument();
      expect(screen.getByText(/abductors/i)).toBeInTheDocument();
      expect(screen.getByText(/adductors/i)).toBeInTheDocument();
      expect(screen.getByText(/glutes/i)).toBeInTheDocument();
      expect(screen.getByText(/hamstrings/i)).toBeInTheDocument();
    });
  });

  test('navigates to Neck page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/neck" element={<Neck />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const neckLink = screen.getByTestId('neck-link');
    expect(neckLink).toBeInTheDocument(); 
    fireEvent.click(neckLink);

    await waitFor(() => {
      expect(screen.getByText(/levator scapulae/i)).toBeInTheDocument();
    });
  });

  test('navigates to Abs page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/abs" element={<Abs />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const absLink = screen.getByTestId('abs-link');
    expect(absLink).toBeInTheDocument(); 
    fireEvent.click(absLink);

    await waitFor(() => {
      expect(screen.getByText(/abs/i)).toBeInTheDocument();
    });
  });

  test('navigates to Shoulders page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/shoulders" element={<Shoulders />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const shouldersLink = screen.getByTestId('shoulders-link');
    expect(shouldersLink).toBeInTheDocument(); 
    fireEvent.click(shouldersLink);

    await waitFor(() => {
      expect(screen.getByText(/delts/i)).toBeInTheDocument();
    });
  });

  test('navigates to Chest page when Arms dropdown item is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/chest" element={<Chest />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const chestLink = screen.getByTestId('chest-link');
    expect(chestLink).toBeInTheDocument(); 
    fireEvent.click(chestLink);

    await waitFor(() => {
      expect(screen.getByText(/pectorals/i)).toBeInTheDocument();
      expect(screen.getByText(/serratus anterior/i)).toBeInTheDocument();
    });
  });

  test('navigates to Register page when Register link is clicked from homepage', async () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );

    const registerLink = screen.getByTestId('register-link');
    expect(registerLink).toBeInTheDocument(); 
    fireEvent.click(registerLink);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
    });
  });

  test('navigates to Login page when link is clicked from homepage', async () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );

    const loginLink = screen.getByTestId('login-link');
    expect(loginLink).toBeInTheDocument(); 
    fireEvent.click(loginLink);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
  });

  test('navigates to Dashboard page when link is clicked from BMI page', async () => {
    const mockUser = { id: 1, username: 'testuser' };

    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/bmi']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );

    const dashboardLink = screen.getByTestId('dashboard-link');
    expect(dashboardLink).toBeInTheDocument(); 
    fireEvent.click(dashboardLink);

    await waitFor(() => {
      expect(screen.getByText(/Daily Motivation/i)).toBeInTheDocument();
      expect(screen.getByText(/Target Heart Rate/i)).toBeInTheDocument();
    });
  });

  test('navigates to Calendar page when link is clicked', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const calendarLink = screen.getByTestId('calendar-link');
    expect(calendarLink).toBeInTheDocument(); 
    fireEvent.click(calendarLink);

    await waitFor(() => {
      expect(screen.getByText(/Drag-n-Drop an Exercise/i)).toBeInTheDocument();
      expect(screen.getByText(/Save Workout/i)).toBeInTheDocument();
    });
  });

  test('navigates to BMI page when link is clicked from Dashboard page', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/bmi" element={<BMI />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const bmiLink = screen.getByTestId('bmi-link');
    expect(bmiLink).toBeInTheDocument(); 
    fireEvent.click(bmiLink);

    await waitFor(() => {
      expect(screen.getByLabelText(/select gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select height/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select waist/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select neck/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select hip/i)).toBeInTheDocument();
    });
  });

  test('navigates to Lifestyle Changes page when link is clicked from Dashboard page', async () => {
    const mockUser = { id: 1, username: 'testuser' };
  
    render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <ErrorBoundary>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="*" element={<Navbar />} />
              <Route path="/lifestyleChanges" element={<LifestyleChanges />} />
            </Routes>
          </MemoryRouter>
        </ErrorBoundary>
      </UserContext.Provider>
    );
  
    const exercisesButton = screen.getByRole('button', { name: /Exercises/i }) || screen.getByText(/Exercises/i);
    fireEvent.click(exercisesButton);

    const lifestyleChangesLink = screen.getByTestId('lifestyle-changes-link');
    expect(lifestyleChangesLink).toBeInTheDocument(); 
    fireEvent.click(lifestyleChangesLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Lifestyle Changes That Can Help Add Years to Your Life/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Eat a healthy diet/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Don't Smoke Cigarettes/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Be physically active/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Maintain a healthy weight and body fat percentage/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Drink alcohol in moderation/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Get adequate sleep/i})).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: /Reduce stress and anxiety/i})).toBeInTheDocument();
    });
  });
  
  test('logs out user correctly', () => {
    localStorage.setItem('token', 'mockToken');

    const mockUser = { id: 1, username: 'testuser' };
    const setCurrentUser = jest.fn();

    render(
      <UserContext.Provider value={{ currentUser: mockUser, setCurrentUser }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="*" element={<Navbar />} />
            <Route path="/" element={<Homepage />} />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>
    );

    const logoutButton = screen.getByTestId('logout-btn');
    fireEvent.click(logoutButton);

    expect(setCurrentUser).toHaveBeenCalledWith(null);
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate().mock.calls[0][0]).toBe('/'); 
  });
});