import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import CalendarComp from '../../userPages/calendar/CalendarComp';
import { UserContext } from '../../UserContext';
import '@testing-library/jest-dom/extend-expect';
import FullCalendar from '@fullcalendar/react';
import Draggable from '@fullcalendar/interaction';

jest.mock('axios');
jest.mock('@fullcalendar/react', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div>FullCalendar</div>),
  };
});

jest.mock('@fullcalendar/interaction', () => {
  return {
    Draggable: jest.fn(),
  };
});

describe('CalendarComp Component', () => {
  const currentUser = { id: '123', name: 'testUser' };
  const mockSetCurrentUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CalendarComp component', () => {
    render(
      <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
        <CalendarComp />
      </UserContext.Provider>
    );

    expect(screen.getByText(/save workout/i)).toBeInTheDocument();
    expect(screen.getByText('Select Target Muscle')).toBeInTheDocument();
    expect(screen.getByText(/Drag-n-Drop an Exercise/i)).toBeInTheDocument();
  });

  test('fetches and displays exercises on target selection', async () => {
    const mockExercises = [
      { id: 1, name: 'Exercise 1', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
      { id: 2, name: 'Exercise 2', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockExercises });

    render(
      <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
        <CalendarComp />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'abs' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        'https://exercisedb.p.rapidapi.com/exercises/target/abs',
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Exercise 1')).toBeInTheDocument();
      expect(screen.getByText('Exercise 2')).toBeInTheDocument();
    });
  });

  // test('handles event drop correctly', async () => {

  //   const initialTasks = [
  //     { id: '1', name: 'Exercise 1', startTime: new Date(), endTime: new Date() },
  //   ];

  //   axios.get.mockResolvedValue({
  //     data: [
  //       { id: 1, name: 'Exercise 1', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
  //       { id: 2, name: 'Exercise 2', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
  //     ],
  //   });

  //   const mockEventDropInfo = {
  //     event: {
  //       _instance: { instanceId: '1' },
  //       title: 'Exercise 1',
  //       start: new Date(),
  //       end: new Date(),
  //     },
  //     oldEvent: null,
  //   };

  //   render(
  //     <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
  //       <CalendarComp />
  //     </UserContext.Provider>
  //   );

  //   fireEvent.change(screen.getByTestId('select-muscle'), {
  //      target: { value: 'abs'}
  //   })

  //   await waitFor(() => expect(screen.getByText('Exercise 1')).toBeInTheDocument());

  //   const draggableItem = screen.getByText('Exercise 1');
  //   fireEvent.dragStart(draggableItem);

  //   const calendarContainer = document.getElementById('fullCalendar-container');

  //   const dropEvent = new Event('drop', {
  //     bubbles: true,
  //     cancelable: true,
  //   });

  //   Object.assign(dropEvent, {
  //     dataTransfer: {
  //       getData: () => JSON.stringify(mockEventDropInfo),
  //     },
  //   });

  //   fireEvent.drop(calendarContainer, dropEvent);

  //   await waitFor(() => {
  //     const updatedTasks = screen.getByTestId('fullCalendar-container'); 
  //     expect(updatedTasks).toHaveTextContent('Exercise 1');
  //   });
  // });

  test('pagination buttons work correctly', async () => {
    const mockExercises = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      name: `Exercise ${i + 1}`,
      duration: '10 minutes',
      color: 'rgba(211, 208, 208, 0.608)',
    }));

    axios.get.mockResolvedValueOnce({ data: mockExercises });

    render(
      <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
        <CalendarComp />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'abs' } });

    await waitFor(() => {
      expect(screen.getByText('Exercise 1')).toBeInTheDocument();
      expect(screen.getByText('Exercise 50')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Exercise 51')).toBeInTheDocument();
      expect(screen.getByText('Exercise 60')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Prev'));

    await waitFor(() => {
      expect(screen.getByText('Exercise 1')).toBeInTheDocument();
      expect(screen.getByText('Exercise 50')).toBeInTheDocument();
    });
  });

  test('saves workouts correctly', async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Exercise 1', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
        { id: 2, name: 'Exercise 2', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
      ],
    });
  
    axios.post.mockResolvedValueOnce({ data: { success: true } });
  
    render(
      <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
        <CalendarComp />
      </UserContext.Provider>
    );
  
    fireEvent.change(screen.getByTestId('select-muscle'), {
      target: { value: 'abs' } 
    });
  
    await waitFor(() => expect(screen.getByText('Exercise 1')).toBeInTheDocument());
  
    const draggableItem = screen.getByText('Exercise 1');
    fireEvent.dragStart(draggableItem);
  
    await waitFor(() => {
      fireEvent.drop(screen.getByTestId('fullCalendar-container'), {
        dataTransfer: {
          getData: () => JSON.stringify({
            event: {
              _instance: { instanceId: '1' },
              title: 'Exercise 1',
              start: new Date('2024-06-12T10:00:00'),
              end: new Date('2024-06-12T11:00:00'),
            },
          }),
        },
      });
    });
  
    fireEvent.click(screen.getByText('Save Workout'));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/calendar/exercises',
        expect.any(Array),
        expect.any(Object)
      );
      expect(screen.getByText('Saved Successfully!')).toBeInTheDocument();
    });
  });

  test('does not create event with empty title', async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Exercise 1', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
        { id: 2, name: 'Exercise 2', duration: '10 minutes', color: 'rgba(211, 208, 208, 0.608)' },
      ],
    });
    
    render(
      <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
        <CalendarComp />
      </UserContext.Provider>
    );
  
    fireEvent.change(screen.getByTestId('select-muscle'), { target: { value: 'abs' } });
  
    // await waitFor(() => {
    //   const exercises = screen.getAllByClassName(/list-group-item/i); 
    //   expect(exercises).toHaveLength(2); 
    // });
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(2); // Use getAllByRole instead
    });

    const calendarContainer = screen.getByTestId('fullCalendar-container');
    const dropEvent = new Event('drop', { bubbles: true });
    Object.assign(dropEvent, {
      dataTransfer: {
        getData: () => JSON.stringify({
          event: {
            _instance: { instanceId: '1' },
            title: '', // Empty title
            start: new Date('2024-06-12T10:00:00'),
            end: new Date('2024-06-12T11:00:00'),
          },
        }),
      },
    });
  
    act(() => {
      fireEvent(calendarContainer, dropEvent);
    });
  
    await waitFor(() => {
      const eventTitles = calendarContainer.querySelectorAll('.fc-event-title');
      expect(eventTitles).toHaveLength(0);
    });
  });
});