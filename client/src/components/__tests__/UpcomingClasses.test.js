import React from 'react';
import { render, screen } from '@testing-library/react';
import UpcomingClasses from '../../Dashboard/UpcomingClasses';
import '@testing-library/jest-dom/extend-expect';

describe('UpcomingClasses component', () => {
  test('renders table with correct headers', () => {
    render(<UpcomingClasses />);
    
    const dateHeader = screen.getByText('Date', { className: 'upcoming-classes-th-top' });
    expect(dateHeader).toBeInTheDocument();

    const classNameHeader = screen.getByText('Class Name', { className: 'upcoming-classes-th-top' });
    expect(classNameHeader).toBeInTheDocument();

    const instructorHeader = screen.getByText('Instructor', { className: 'upcoming-classes-th-top' });
    expect(instructorHeader).toBeInTheDocument();

    const timeHeader = screen.getByText('Time', { className: 'upcoming-classes-th-top' });
    expect(timeHeader).toBeInTheDocument();
  });

  test('renders three rows in the table body', () => {
    render(<UpcomingClasses />);
    const rows = screen.getAllByRole('row');

    expect(rows.length - 1).toBe(3);
  });

  test('each row has the correct number of cells', () => {
    render(<UpcomingClasses />);
    const rows = screen.getAllByRole('row');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      expect(cells.length).toBe(4); 
    });
  });
});