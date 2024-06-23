import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Arms from '../../userPages/exercises/Arms';
import '@testing-library/jest-dom/extend-expect';

const mockAxios = new MockAdapter(axios);

describe('Arms Component with ExpandableCard', () => {
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
      gifPlaceholderUrl: 'placeholder-url',
      gifUrl: 'gif-url',
      instructions: ['Step 1', 'Step 2']
    }));
  };

  test('fetches and displays exercises in ExpandableCard', async () => {
    const mockExercises = generateMockExercises(2); 
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/triceps')
      .reply(200, mockExercises);
     
    render(<Arms />);
    
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
      
  test('renders exercises correctly and handles "Next" and "Prev" button click', async () => {
    const mockExercises = generateMockExercises(40);
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/triceps')
      .reply(200, mockExercises);
    
    render(<Arms />);
    
    await waitFor(() => {
      const errorMessage = screen.queryByTestId('arms-error-message');
      expect(errorMessage).not.toBeInTheDocument();

      const tricepsBtn = screen.getByTestId('tab-triceps');
      expect(tricepsBtn).toBeInTheDocument();

      const bicepsBtn = screen.getByTestId('tab-biceps');
      expect(bicepsBtn).toBeInTheDocument();

      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 15'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 20'))).toBe(true);
    });

    const nextButton = screen.getByTestId('arms-next-btn');
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
    

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 21'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 30'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 40'))).toBe(true);
    });

    const prevButton = screen.getByTestId('arms-previous-btn');
    expect(prevButton).toBeInTheDocument();
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 9'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 18'))).toBe(true);
    });
  });

  test('renders error message on API failure', async () => {
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/tricpes')
      .reply(404);
  
    render(<Arms />);
  
    await waitFor(() => {
      const errorMessage = screen.queryByTestId('arms-error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toBe('Error fetching data');
    });
  
    const exerciseNames = screen.queryAllByTestId('expandable-card-exercise-name');
    expect(exerciseNames).toHaveLength(0);
  });

  test('disables "Prev" button on the first page and enables it on subsequent pages', async () => {
    const mockExercises = generateMockExercises(40); 
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/triceps')
      .reply(200, mockExercises);

      render (<Arms />);

    await waitFor(() => {
      const exerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(exerciseNames).toHaveLength(20);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(exerciseNames.some(el => el.textContent.includes('Exercise 20'))).toBe(true);
    });

    const prevButton = screen.getByTestId('arms-previous-btn');
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByTestId('arms-next-btn');
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
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/triceps')
      .reply(500); 

    render(<Arms />);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('arms-error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error fetching data');
    });
  });

  test('Instructions render when View button is clicked', async () => {
    const mockExercises = generateMockExercises(2); 
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/triceps')
      .reply(200, mockExercises);
     
    render(<Arms />);
    
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

  test('switches between triceps and biceps tabs', async () => {
    const mockTricepsExercises = generateMockExercises(20); 
    const mockBicepsExercises = generateMockExercises(15); 
  
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/triceps')
      .reply(200, mockTricepsExercises);
    
    mockAxios.onGet('https://exercisedb.p.rapidapi.com/exercises/target/biceps')
      .reply(200, mockBicepsExercises);
  
    render(<Arms />);
  
    await waitFor(() => {
      const errorMessage = screen.queryByTestId('arms-error-message');
      expect(errorMessage).not.toBeInTheDocument(); 
  
      const tricepsBtn = screen.getByTestId('tab-triceps');
      expect(tricepsBtn).toBeInTheDocument();
  
      const bicepsBtn = screen.getByTestId('tab-biceps');
      expect(bicepsBtn).toBeInTheDocument(); 
  
      fireEvent.click(bicepsBtn);
  
      const bicepsExerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(bicepsExerciseNames).toHaveLength(15); 
      expect(bicepsExerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
      expect(bicepsExerciseNames.some(el => el.textContent.includes('Exercise 15'))).toBe(true);
  
      fireEvent.click(tricepsBtn);
  
      const tricepsExerciseNames = screen.getAllByTestId('expandable-card-exercise-name');
      expect(tricepsExerciseNames).toHaveLength(20); 
      expect(tricepsExerciseNames.some(el => el.textContent.includes('Exercise 1'))).toBe(true);
    });
  });
});