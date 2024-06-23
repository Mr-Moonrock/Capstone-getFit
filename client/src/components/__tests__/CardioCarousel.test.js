import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import CardioCarousel from '../../Dashboard/CardioCarousel';

jest.useFakeTimers(); 

const hitt = 'backImage.jpg';
const miss = 'miss.jpg';
const liss = 'liss.jpg';

const items = [
  { src: hitt, altText: 'HITT Cardio', caption: 'HITT Cardio', link: '/cardioInfo', },
  { src: miss, altText: 'MISS Cardio', caption: 'MISS Cardio', link: '/cardioInfo', },
  { src: liss, altText: 'LISS Cardio', caption: 'LISS Cardio', link: '/cardioInfo', },
];

describe('CardioCarousel Component', () => {
  it('renders carousel items correctly', () => {
    render(
      <Router>
        <CardioCarousel />
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
        <CardioCarousel items={items} />
      </Router>
    );
    
    fireEvent.click(screen.getByLabelText('cardio-Next'));
    
    await waitFor(() => {
      expect(screen.getByAltText('HITT Cardio')).toHaveAttribute('data-active', 'true');
      expect(screen.getByAltText('MISS Cardio')).toHaveAttribute('data-active', 'false');
    });

    fireEvent.click(screen.getByLabelText('cardio-Previous'));

    await waitFor(() => {
      expect(screen.getByAltText('HITT Cardio')).toHaveAttribute('data-active', 'true');
      expect(screen.getByAltText('MISS Cardio')).toHaveAttribute('data-active', 'false');
    });
  });

  it('navigates to the correct link when clicking on "Learn More"', () => {
    render(
      <Router>
        <CardioCarousel />
      </Router>
    );

    const goToExercisesLinks = screen.getAllByText('Learn More');

    goToExercisesLinks.forEach((link, index) => {
      fireEvent.click(link);
      expect(window.location.pathname).toBe(items[index].link);
    });
  });
});