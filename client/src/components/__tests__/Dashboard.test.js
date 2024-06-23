import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Dashboard from '../../Dashboard/Dashboard';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

describe('Dashboard Component', () => {
  const mockUser = { id: 1, username: 'testuser' };
  const mockResponse = [];

  beforeEach( async() => {
    axios.get.mockResolvedValueOnce({ data: mockResponse });

    await act(async () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ currentUser: mockUser }}>
            <Dashboard />
          </UserContext.Provider>
        </MemoryRouter>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should render GetQuotes component', () => {
    expect(screen.getByText(/Daily Motivation/i)).toBeInTheDocument();
  });

  it('should render THR component', () => {
    expect(screen.getByText(/Target Heart Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/THR Max:/i)).toBeInTheDocument();
    expect(screen.getByText(/THR Min:/i)).toBeInTheDocument();
  });

  it('should render UserInfo component', () => {
    expect(screen.getByText(/User Info/i)).toBeInTheDocument();
    expect(screen.getByText(/Age:/i)).toBeInTheDocument();
    expect(screen.getByText(/Height:/i)).toBeInTheDocument();
    expect(screen.getByText(/Waist:/i)).toBeInTheDocument();
    expect(screen.getByText(/Neck:/i)).toBeInTheDocument();
    expect(screen.getByText(/Hip:/i)).toBeInTheDocument();
    expect(screen.getByText(/Fitness Level:/i)).toBeInTheDocument();
  });

  it('should render Bodyfat component', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Bodyfat Percentage/i)).toBeInTheDocument();
    });
  });

  it('should render AjBW component', () => {
    expect(screen.getByText(/Adjustable Body Weight/i)).toBeInTheDocument();
    expect(screen.getByText(/AjBW/i)).toBeInTheDocument();
    expect(screen.getByText(/Ideal Body Weight/i)).toBeInTheDocument();
  });

  it('should render FFMI component', () => {
    expect(screen.getByText(/Fat-Free Mass Index/i)).toBeInTheDocument();
    expect(screen.getByText(/FFMI/i)).toBeInTheDocument();
    expect(screen.getByText(/Fat-Free Mass/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Body Fat/i)).toBeInTheDocument();
  });

  it('should render BMR component', () => {
    expect(screen.getByText(/Basal Metabolic Rate/i)).toBeInTheDocument();
  });

  it('should render Bodyfat component', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Bodyfat Percentage/i)).toBeInTheDocument();
    });
  });

  it('should render UpcomingClasses component', () => {
    expect(screen.getByText(/Class Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Instructor/i)).toBeInTheDocument();
    expect(screen.getByText(/Time/i)).toBeInTheDocument();
  });

  it('should render AllExercises component', () => {
    expect(screen.getByText(/Arm Exercises/i)).toBeInTheDocument();
  });

  it('should render CardioCarousel component', () => {
    expect(screen.getByText(/HITT Cardio/i)).toBeInTheDocument();
  });
});