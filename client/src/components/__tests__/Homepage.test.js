import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Homepage from '../Homepage';

jest.mock('../../images/classesImage.jpg', () => 'mockedImagePath');
jest.mock('../../images/equipmentImage.jpg', () => 'mockedImagePath');
jest.mock('../../images/lifestyleChangesHomepage.jpg', () => 'mockedImagePath');
jest.mock('../../images/homepgCalendarImage.jpg', () => 'mockedImagePath');
jest.mock('../../images/introImage.jpg', () => 'mockedImagePath');

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Homepage component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Homepage />);
  });

  test('renders headings correctly', () => {
    renderWithRouter(<Homepage />);
    expect(screen.getByRole('heading', { level: 6, name: /Improve Yourself\./i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: /Calculate Your BMI/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: /Change Your Lifestyle\./i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Coming Soon\!!/i})).toBeInTheDocument();
  })

  test('renders paragraphs correctly', () => {
    renderWithRouter(<Homepage />);
    expect(screen.getByText(/Choose from hundreds of cardio and strength training exercises\./i)).toBeInTheDocument();
    expect(screen.getByText(/Read a few ways you can change your habits/i)).toBeInTheDocument();
    expect(screen.getByText(/Online Classes with certified personal trainers whether you're at home or on the road\./i)).toBeInTheDocument();
    expect(screen.getByText(/Find the best from some of the top brands\./i)).toBeInTheDocument();
  });

  test('buttons navigate to their respected destinations', () => {
    renderWithRouter(<Homepage />);
    fireEvent.click(screen.getByText('Join Now'));
    expect(window.location.pathname).toBe('/register');
    fireEvent.click(screen.getByText('BMI Info'));
    expect(window.location.pathname).toBe('/bmiInfo');
    fireEvent.click(screen.getByText('Lifestyle Changes'));
    expect(window.location.pathname).toBe('/lifestyleChanges');
  });

  test('Does images render', () => {
    renderWithRouter(<Homepage />)
    const introImage = screen.getByAltText('IntroImage');
    expect(introImage).toBeInTheDocument();
    expect(introImage).toHaveAttribute('src', 'mockedImagePath')

    const homepageCalendarImg = screen.getByAltText('homepgCalendarImage');
    expect(homepageCalendarImg).toBeInTheDocument();
    expect(homepageCalendarImg).toHaveAttribute('src', 'mockedImagePath')

    const lifeStyleChangesImg = screen.getByAltText('lifestyleChangesHomepage');
    expect(lifeStyleChangesImg).toBeInTheDocument();
    expect(lifeStyleChangesImg).toHaveAttribute('src', 'mockedImagePath')

    const classesImg = screen.getByAltText('classesImage');
    expect(classesImg).toBeInTheDocument();
    expect(classesImg).toHaveAttribute('src', 'mockedImagePath')

    const equipmentImg = screen.getByAltText('equipmentImage');
    expect(equipmentImg ).toBeInTheDocument();
    expect(equipmentImg ).toHaveAttribute('src', 'mockedImagePath')
  })

});