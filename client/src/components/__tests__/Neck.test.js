import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Neck from '../../userPages/exercises/Neck';
import '@testing-library/jest-dom/extend-expect';

const mockAxios = new MockAdapter(axios);

describe('Neck Component with ExpandableCard', () => {
  beforeEach(() => {
    mockAxios.reset();
    process.env.REACT_APP_RAPIDAPI_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const generateMockExercises = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Exercise ${i + 1}`,
      equipment: 'None',
      secondaryMuscles: ['Muscle'],
      gifUrl: 'gif-url',
      instructions: ['Step 1', 'Step 2']
    }));
  };

  test('fetches and displays exercises in ExpandableCard', async () => {
    const mockExercises = generateMockExercises(2); 
    const target = 'levator scapulae';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(200, mockExercises);
  
    render(<Neck />);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(2);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 2'))).toBe(true);

      const exerciseEquipment = screen.getAllByTestId('expandable-card-equipment')
      expect(exerciseEquipment).toHaveLength(2);
      expect(exerciseEquipment.some(el => el.textContent.includes('Equipment: None'))).toBe(true);

      const exerciseSecondaryMuscles = screen.getAllByTestId('expandable-secondary-muscles')
      expect(exerciseSecondaryMuscles).toHaveLength(2);
      expect(exerciseSecondaryMuscles.some(el => el.textContent.includes('Muscle'))).toBe(true);

      const exerciseGifUrls = screen.getAllByTestId('expandable-exercise-gif')
      expect(exerciseGifUrls).toHaveLength(2);
      expect(exerciseGifUrls.some(el => el.getAttribute('src') === 'gif-url')).toBe(true);

      const viewInstructionsBtn = screen.getAllByTestId('expandable-instructions-btn')
      expect(viewInstructionsBtn).toHaveLength(2);
      expect(viewInstructionsBtn.some(el => el.textContent.includes('View Instructions'))).toBe(true);

      fireEvent.click(viewInstructionsBtn[0]);
      expect(screen.getAllByTestId('expandable-card-instructions-display')).toHaveLength(2); 

      fireEvent.click(screen.getByTestId('expandable-back-btn'));
      expect(screen.queryByTestId('expandable-card-instructions-display')).toBeNull();
    });
  });

  test('displays an error message when data fetch fails', async () => {
    const target = 'levator scapulae';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(500);
  
    render(<Neck />);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('neck-error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error fetching data');
    });
  });

  test('Instructions render when View button is clicked', async () => {
    const mockExercises = generateMockExercises(2); 
    const target = 'levator scapulae';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(200, mockExercises);
  
    render(<Neck />);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(2);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 2'))).toBe(true);
    });

    const viewButtons = screen.getAllByTestId('expandable-instructions-btn');
    expect(viewButtons).toHaveLength(2);

    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      const instructions = screen.getAllByTestId('expandable-card-instructions-display');
      expect(instructions).toHaveLength(2); 
      expect(instructions[0].textContent).toBe('Step 1');
      expect(instructions[1].textContent).toBe('Step 2');
    });
  });
});

