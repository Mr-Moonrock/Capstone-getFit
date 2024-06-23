import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import CalendarHomepage from '../CalendarHomepage';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Calendar omepage component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<CalendarHomepage />);
  });

  test('renders the CalendarHomepage header', () => {
    render(<CalendarHomepage />);
    const headerElement = screen.getByText(/Create Your Workout Calendar/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the CalendarHomepage paragraph', () => {
    render(<CalendarHomepage />);
    const paragraphElement = screen.getByText(/Use a drag and drop Calendar to assist in creating workout plan./i);
    expect(paragraphElement).toBeInTheDocument();
  });
});