import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BmiTable from '../BmiComponent/BmiTable';

describe('BmiTable', () => {
  test('renders the BMI Table header', () => {
    render(<BmiTable />);
    const headerElement = screen.getByText(/BMI Table/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders all BMI categories', () => {
    render(<BmiTable />);
    const categories = ['Underweight', 'Normal', 'Overweight', 'Obesity'];
    categories.forEach(category => {
      const categoryElement = screen.getByText(category);
      expect(categoryElement).toBeInTheDocument();
    });
  });

  test('renders the correct BMI ranges', () => {
    render(<BmiTable />);
    const ranges = [
      'Below 18.5%',
      '18.5-24.9%',
      '25.0-29.9%',
      '30.0% and Above'
    ];
    ranges.forEach(range => {
      const rangeElement = screen.getByText(range);
      expect(rangeElement).toBeInTheDocument();
    });
  });
});