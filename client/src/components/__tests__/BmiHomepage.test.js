import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import BmiHomepage from '../BmiComponent/BmiHomepage.js';

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Bmi Homepage component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<BmiHomepage />);
  });

  test('renders headings correctly', () => {
    renderWithRouter(<BmiHomepage />);
    expect(screen.getByRole('heading', { level: 6, name: /Why is BMI Important\?/i})).toBeInTheDocument();
  })

  test('renders paragraphs correctly', () => {
    renderWithRouter(<BmiHomepage />);
    expect(screen.getByText(/The higher your BMI, the higher your risk for certain diseases such as heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers\./i)).toBeInTheDocument();
  });

  test('buttons navigate to their respected destinations', () => {
    renderWithRouter(<BmiHomepage/>);
    fireEvent.click(screen.getByText('BMI Info'));
    expect(window.location.pathname).toBe('/bmiInfo');
  });
});