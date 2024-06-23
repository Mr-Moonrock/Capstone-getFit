import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Back from '../../userPages/exercises/Back';
import '@testing-library/jest-dom/extend-expect';

const mockAxios = new MockAdapter(axios);

describe('Back Component with ExpandableCard', () => {
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
    const target = 'upper back';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(200, mockExercises);
  
    render(<Back />);

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

  test('disables "Prev" button on the first page and enables it on subsequent pages', async () => {
    const mockExercises = generateMockExercises(40); 
    const target = 'upper back';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(200, mockExercises);
  
    render(<Back />);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 20'))).toBe(true);
    });

    const prevButton = screen.getByTestId('back-previous-btn');
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByTestId('back-next-btn');
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 21'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 40'))).toBe(true);
      expect(prevButton).not.toBeDisabled();
    });

    fireEvent.click(prevButton);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 20'))).toBe(true);
    });

    expect(prevButton).toBeDisabled();
  });

  test('displays an error message when data fetch fails', async () => {
    const target = 'upper back';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(500);
  
    render(<Back />);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('back-error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error fetching data');
    });
  });

  test('Instructions render when View button is clicked', async () => {
    const mockExercises = generateMockExercises(2); 
    const target = 'upper back';
    const encodedTarget = encodeURIComponent(target);
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
  
    mockAxios.onGet(url).reply(200, mockExercises);
  
    render(<Back />);

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

  test('able to click between tabs and render respected exercises', async () => {
    const upperBackExercises = generateMockExercises(20); 
    const target = 'upper back';
    const encodedTarget = encodeURIComponent(target);
    const upperBackUrl = `https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`;
    mockAxios.onGet(upperBackUrl).reply(200, upperBackExercises);


    const latsExercises = generateMockExercises(10);
    const latsUrl = 'https://exercisedb.p.rapidapi.com/exercises/target/lats'
    mockAxios.onGet(latsUrl).reply(200, latsExercises);

    const spineExercises = generateMockExercises(5);
    const spineUrl = 'https://exercisedb.p.rapidapi.com/exercises/target/spine'
    mockAxios.onGet(spineUrl).reply(200, spineExercises);

    const trapsExercises = generateMockExercises(2);
    const trapsUrl = 'https://exercisedb.p.rapidapi.com/exercises/target/traps'
    mockAxios.onGet(trapsUrl).reply(200, trapsExercises);
    
    render(<Back />);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 20'))).toBe(true);
    });

    const latsBtn = screen.getByTestId('tab-lats')
    fireEvent.click(latsBtn)

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(10);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 10'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 11'))).toBe(false);
    });

    const spineBtn = screen.getByTestId('tab-spine')
    fireEvent.click(spineBtn)

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(5);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 5'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 6'))).toBe(false);
    });

    const trapsBtn = screen.getByTestId('tab-traps')
    fireEvent.click(trapsBtn)

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(2);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 2'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 6'))).toBe(false);
    });
  });
});