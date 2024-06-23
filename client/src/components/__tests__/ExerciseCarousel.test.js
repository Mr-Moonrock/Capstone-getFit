import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import ExercisesCarousel from '../../Dashboard/ExercisesCarousel';

jest.useFakeTimers(); 

const backImage = 'backImage.jpg';
const armsImage = 'armsImage.jpg';
const chestImage = 'chestImage.jpg';
const lowerLegsImage = 'lowerLegsImage.jpg';
const neckImage = 'neckImage.jpg';
const shouldersImage = 'shouldersImage.jpg';

const items = [
  { src: backImage, altText: 'Back Exercises', caption: 'Back Exercises', link: '/back' },
  { src: armsImage, altText: 'Arm Exercises', caption: 'Arm Exercises', link: '/arms' },
  { src: chestImage, altText: 'Chest Exercises', caption: 'Chest Exercises', link: '/chest' },
  { src: lowerLegsImage, altText: 'Lower Leg Exercises', caption: 'Lower Leg Exercises', link: '/legs' },
  { src: neckImage, altText: 'Neck Exercises', caption: 'Neck Exercises', link: '/neck' },
  { src: shouldersImage, altText: 'Shoulder Exercises', caption: 'Shoulder Exercises', link: '/shoulders' },
];

describe('ExercisesCarousel Component', () => {
  it('renders carousel items correctly', () => {
    render(
      <Router>
        <ExercisesCarousel />
      </Router>
    );
    items.forEach((item) => {
      expect(screen.getByText(item.caption)).toBeInTheDocument();
      expect(screen.getByAltText(item.altText)).toBeInTheDocument();
    });
  });

  test('each image has correct active status based on activeIndex', async () => {
    render(
      <Router>
        <ExercisesCarousel items={items} />
      </Router>
    );

    fireEvent.click(screen.getByLabelText('exercise-Next'));

    await waitFor(() => {
      expect(screen.getByAltText('Arm Exercises')).toHaveAttribute('data-active', 'true');
      expect(screen.getByAltText('Back Exercises')).toHaveAttribute('data-active', 'false');
    });

    fireEvent.click(screen.getByLabelText('exercise-Previous'));

    await waitFor(() => {
      expect(screen.getByAltText('Back Exercises')).toHaveAttribute('data-active', 'true');
      expect(screen.getByAltText('Arm Exercises')).toHaveAttribute('data-active', 'false');
    });
  });

  it('navigates to the correct link when clicking on "Go to Exercises"', () => {
    render(
      <Router>
        <ExercisesCarousel />
      </Router>
    );

    const goToExercisesLinks = screen.getAllByText('Go to Exercises');

    goToExercisesLinks.forEach((link, index) => {
      fireEvent.click(link);
      expect(window.location.pathname).toBe(items[index].link);
    });
  });
});
