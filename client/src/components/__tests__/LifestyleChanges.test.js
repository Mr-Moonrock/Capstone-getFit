import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import LifestyleChanges from '../LifestyleChanges';

jest.mock('../../images/lifestyleDietImage.jpg', () => 'mockedImagePath');
jest.mock('../../images/lifestyleActiveImage.jpg', () => 'mockedImagePath');
jest.mock('../../images/lifestyleSleepImage.jpg', () => 'mockedImagePath');

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Homepage component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<LifestyleChanges />);
  });

  test('renders headings correctly', () => {
    renderWithRouter(<LifestyleChanges />);
    expect(screen.getByRole('heading', { level: 1, name: /Lifestyle Changes That Can Help Add Years to Your Life/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Eat a healthy diet/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Don't Smoke Cigarettes/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Be physically active/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Maintain a healthy weight and body fat percentage/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Drink alcohol in moderation/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Get adequate sleep/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Reduce stress and anxiety/i})).toBeInTheDocument();
  });

  test('renders paragraphs correctly', () => {
    renderWithRouter(<LifestyleChanges />);
    expect(screen.getByText(/Everyone wants to live a long and healthy life\./i)).toBeInTheDocument();
    expect(screen.getByText(/They aimed to investigate how a combination of healthy lifestyle choices—never smoking/i)).toBeInTheDocument();
    expect(screen.getByText(/But this was not the first study to link lifestyle choices with mortality\./i)).toBeInTheDocument();
    expect(screen.getByText(/Research shows that diets rich in nutrient-dense plant foods may lower disease risk and promote longevity\./i)).toBeInTheDocument();
    expect(screen.getByText(/Just three to four daily servings of these foods reduced the risk of premature death by 22%\./i)).toBeInTheDocument();
    expect(screen.getByText(/However, consuming red and processed meats may shorten your lifespan\./i)).toBeInTheDocument();
    expect(screen.getByText(/It is not only heavy smokers that live shorter lives\./i)).toBeInTheDocument();
    expect(screen.getByText(/Even those who quit at age 65 gained could expect to live one to four years longer than their smoking peers\./i)).toBeInTheDocument();
    expect(screen.getByText(/Staying physically active is vital for a long and healthy life\./i)).toBeInTheDocument();
    expect(screen.getByText(/The risk of premature death decreased even further for those who exercised above this level\./i)).toBeInTheDocument();
    expect(screen.getByText(/In a large meta-analysis, researchers looked at the impact of total steps on mortality\./i)).toBeInTheDocument();
    expect(screen.getByText(/adults with obesity had the lowest chance of disease-free life expectancy at age fifty compared to those with a healthy weight\./i)).toBeInTheDocument();
    expect(screen.getByText(/Waist circumference was positively associated with mortality within all categories of BMI\./i)).toBeInTheDocument();
    expect(screen.getByText(/a week led to the greatest reduction in heart disease, cancer, and mortality risk when compared to none or higher alcohol intake\./i)).toBeInTheDocument();
    expect(screen.getByText(/is two drinks or less in a day for men and one drink or less in a day for women\./i)).toBeInTheDocument();
    expect(screen.getByText(/Research suggests that both too little and too much sleep can hurt your health\./i)).toBeInTheDocument();
    expect(screen.getByText(/The mechanism linking excessive sleep and increased risk of premature death is less clear\,/i)).toBeInTheDocument();
    expect(screen.getByText(/one cohort study reported a 32% increased risk of premature death in men with high stress versus low stress\./i)).toBeInTheDocument();
    expect(screen.getByText(/In a study analyzing the effects of the interaction between positive mood and perceived stress\,/i)).toBeInTheDocument();
    expect(screen.getByText(/A meta-analysis of over 2,600 participants found that practicing mindfulness based stress reductio/i)).toBeInTheDocument();
  });

  test('Does images render', () => {
    renderWithRouter(<LifestyleChanges />)
    const dietImage = screen.getByAltText('lifestyleDietImage');
    expect(dietImage).toBeInTheDocument();
    expect(dietImage).toHaveAttribute('src', 'mockedImagePath')

    const activeImage = screen.getByAltText('lifestyleActiveImage');
    expect(activeImage).toBeInTheDocument();
    expect(activeImage).toHaveAttribute('src', 'mockedImagePath')

    const sleepImage = screen.getByAltText('lifestyleSleepImage');
    expect(sleepImage).toBeInTheDocument();
    expect(sleepImage).toHaveAttribute('src', 'mockedImagePath')
  })

});