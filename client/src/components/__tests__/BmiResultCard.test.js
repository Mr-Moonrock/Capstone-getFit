import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import BmiResultCard from '../BmiComponent/BmiResultCard';

describe('BmiResultCard component', () => {
  const result = {
    bmr: 1500,
    thr_max: 180,
    thr_min: 120,
    FFMI: 23,
    "Fat-free mass": 160,
    "Normalized FFMI": 22,
    Sex: 'male',
    "Total body fat": 15,
    AjBW: 70,
    Height: 180,
    "IBW (Robinson)": 75,
    Weight: 80,
    Navy_BFP: 10,
  };

  const onSaveMock = jest.fn();
  let selectedCalculation;
  const requestData = { gender: 'male', age: 30, weight: 80, height: 180 };

  test('should render BMR result', () => {
    const resultWithBMR = { bmr: 1500 };
    selectedCalculation = 'bmr';
    render(<BmiResultCard result={resultWithBMR} onSave={onSaveMock} selectedCalculation={selectedCalculation} requestData={requestData} />);
    expect(screen.getByTestId('bmr-result')).toBeInTheDocument();
  });

  test('should render THR results', () => {
    const resultWithTHR = { thr_max: 180, thr_min: 120 };
    selectedCalculation = 'thr';
    render(<BmiResultCard result={resultWithTHR} onSave={onSaveMock} selectedCalculation={selectedCalculation} requestData={requestData} />);
    expect(screen.getByTestId('thr-result-max')).toBeInTheDocument();
    expect(screen.getByTestId('thr-result-min')).toBeInTheDocument();
  });

  test('should render FFMI results', () => {
    const resultWithFFMI = { FFMI: 23, "Fat-free mass": 160, "Normalized FFMI": 22, Sex: 'male', "Total body fat": 15 };
    selectedCalculation = 'ffmi';
    render(<BmiResultCard result={resultWithFFMI} onSave={onSaveMock} selectedCalculation={selectedCalculation} requestData={requestData} />);
    expect(screen.getByTestId('ffmi-result-mass-index')).toBeInTheDocument();
    expect(screen.getByTestId('ffmi-result-fat-free')).toBeInTheDocument();
    expect(screen.getByTestId('ffmi-result-normalized')).toBeInTheDocument();
    expect(screen.getByTestId('ffmi-result-sex')).toBeInTheDocument();
    expect(screen.getByTestId('ffmi-result-tbf')).toBeInTheDocument();
  });

  test('should render AjBW results', () => {
    const resultWithAjBW = { AjBW: 70, Height: 180, "IBW (Robinson)": 75, Sex: 'male', Weight: 80 };
    selectedCalculation = 'ffmi';
    render(<BmiResultCard result={resultWithAjBW} onSave={onSaveMock} selectedCalculation={selectedCalculation} requestData={requestData} />);
    expect(screen.getByTestId('ajbw-result-ajbw')).toBeInTheDocument();
    expect(screen.getByTestId('ajbw-result-height')).toBeInTheDocument();
    expect(screen.getByTestId('ajbw-result-ibw')).toBeInTheDocument();
    expect(screen.getByTestId('ajbw-result-sex')).toBeInTheDocument();
    expect(screen.getByTestId('ajbw-result-weight')).toBeInTheDocument();
  });

  test('should call onSave function when Save button is clicked', () => {
    selectedCalculation = 'bmr';
    render(<BmiResultCard result={result} onSave={onSaveMock} selectedCalculation={selectedCalculation} requestData={requestData} />);
    fireEvent.click(screen.getByText('Save'));
    expect(onSaveMock).toHaveBeenCalledWith(selectedCalculation, requestData, result);
  });
});