import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import CalendarDashboardCard from '../../Dashboard/CalendarDashboardCard'; // Adjust the import based on your folder structure

describe('CalendarDashboardCard Component', () => {
  const mockWorkout = {
    name: 'Push Up',
    equipment: 'Bodyweight',
    gifUrl: 'https://example.com/pushup.gif',
  };

  it('renders correctly with workout data', () => {
    render(<CalendarDashboardCard workout={mockWorkout} />);

    expect(screen.getByText(/Push Up/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Bodyweight/i)).toBeInTheDocument();
    
    const gifImage = screen.getByAltText(/Exercise GIF/i);
    expect(gifImage).toBeInTheDocument();
    expect(gifImage).toHaveAttribute('src', 'https://example.com/pushup.gif');
  });

  it('handles missing workout data gracefully', () => {
    const incompleteWorkout = {
      name: 'Squat',
      equipment: '', 
      gifUrl: '', 
    };

    render(<CalendarDashboardCard workout={incompleteWorkout} />);

    expect(screen.getByText(/Squat/i)).toBeInTheDocument();

    expect(screen.getByText(/Equipment:/i)).toBeInTheDocument();
    const equipmentText = screen.getByText(/Equipment:/i);
    expect(equipmentText).toHaveTextContent('Equipment:');

    const gifImage = screen.queryByAltText(/Exercise GIF/i);
    expect(gifImage).not.toBeInTheDocument(); 
  });

  it('renders default values if some props are missing', () => {
    const partialWorkout = {
      name: 'Lunges',
    };

    render(<CalendarDashboardCard workout={partialWorkout} />);

    expect(screen.getByText(/Lunges/i)).toBeInTheDocument();

    expect(screen.getByText(/Equipment:/i)).toBeInTheDocument();
    const equipmentText = screen.getByText(/Equipment:/i);
    expect(equipmentText).toHaveTextContent('Equipment:'); 

    const gifImage = screen.queryByAltText(/Exercise GIF/i);
    expect(gifImage).not.toBeInTheDocument(); 
  });

  it('renders multiple workout cards correctly', () => {
    const workouts = [
      { name: 'Deadlift', equipment: 'Barbell', gifUrl: 'https://example.com/deadlift.gif' },
      { name: 'Pull Up', equipment: 'Pull-up Bar', gifUrl: 'https://example.com/pullup.gif' },
    ];

    workouts.forEach(workout => {
      const {unmount} = render(<CalendarDashboardCard workout={workout} />);

      expect(screen.getByText(new RegExp(workout.name, 'i'))).toBeInTheDocument();

      expect(screen.getByText(new RegExp(workout.equipment, 'i'))).toBeInTheDocument();

      const gifImage = screen.getByAltText(/Exercise GIF/i);
      expect(gifImage).toBeInTheDocument();
      expect(gifImage).toHaveAttribute('src', workout.gifUrl);

      unmount()
    });
  });
});