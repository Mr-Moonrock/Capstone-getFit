import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import BmiInfo from '../BmiComponent/BmiInfo';


jest.mock('../../images/bmiChartImage.jpg', () => 'mockedImagePath');

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('BmiInfo component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<BmiInfo />);
  });

  test('renders headings correctly', () => { 
    renderWithRouter(<BmiInfo />);
    console.log(screen.debug());
    expect(screen.getByRole('heading', { level: 1, name: /Methods of Calculating Body Mass/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /BMI Category and Table/i})).toBeInTheDocument();
    // expect(screen.getByRole('heading', { level: 4, name: /Body Fat (BMI method)/i})).toBeInTheDocument();
    // expect(screen.getByRole('heading', { level: 4, name: /Body Fat (U.S. Navy Method)/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: /How to measure for the calculation\??/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Body Compositon/i})).toBeInTheDocument();
  });

  test('renders paragraphs correctly', () => {
    render(<BmiInfo />);
    expect(screen.getByText(/Body mass index is a tool that healthcare providers use to estimate the amount of body fat/i)).toBeInTheDocument();
    expect(screen.getByText(/There are many specific techniques used for measuring body fat/i)).toBeInTheDocument();
  });

  test('renders list items correctly', () => {
    render(<BmiInfo />);
    expect(screen.getByText(/Measure the circumference of the subject's waist/i)).toBeInTheDocument();
    expect(screen.getByText(/Measure the circumference of the subject's neck/i)).toBeInTheDocument();
    expect(screen.getByText(/Measure the circumference of the subject's hips at the largest horizontal measure./i)).toBeInTheDocument();
    expect(screen.getByText(/It surrounds your organs and is just under your skin. Total amount of fat in the body./i)).toBeInTheDocument();
  });

  test('Does images render', () => {
    renderWithRouter(<BmiInfo />)
    const bmiChart = screen.getByAltText('bmiChartImage');
    expect(bmiChart).toBeInTheDocument();
    expect(bmiChart).toHaveAttribute('src', 'mockedImagePath')
  })

});