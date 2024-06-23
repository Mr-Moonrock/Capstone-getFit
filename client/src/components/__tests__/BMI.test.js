import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import BMI from '../BmiComponent/BMI';
import { UserContext } from '../../UserContext';

const mockAxios = new axiosMock(axios);
jest.mock('../../images/logoImage.jpg', () => 'mockedImagePath');

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe('BMI Component', () => {
  const providerProps = {
    value: {
      currentUser: {
        id: '12345',
        name: 'Test User',
        
      },
    },
  };

  beforeEach(() => {
    mockAxios.reset();
  });

  test('renders without crashing', () => {
    renderWithContext(<BMI />, { providerProps });
    expect(screen.getByRole('heading', { level: 2, name: /Get Fit/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Body Fat/i })).toBeInTheDocument();
  });

  test('Does images render', () => {
    renderWithContext(<BMI />, { providerProps })
    const logoImage = screen.getByAltText('logoImage');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mockedImagePath')
  });


  // BODYFAT 

  test('Does the correct form elements render for Bodyfat', () => {
    renderWithContext(<BMI />, { providerProps })
    fireEvent.change(screen.getByLabelText('Select calculation'), { target: { value: 'bodyfat' } });
    expect(screen.getByLabelText(/select gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select waist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select neck/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select hip/i)).toBeInTheDocument();
  })

  test('allows bodyfat form submission', async () => {
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/bodyfat/navy').reply(200, {
      Navy_BFP: 7.13,
    });

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText(/select gender/i), {
      target: { value: 'male' },
    });
    fireEvent.change(screen.getByLabelText(/select age/i), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByLabelText(/select height/i), {
      target: { value: '70' },
    });
    fireEvent.change(screen.getByLabelText(/select waist/i), {
      target: { value: '32' },
    });
    fireEvent.change(screen.getByLabelText(/select neck/i), {
      target: { value: '15' },
    });
    fireEvent.change(screen.getByLabelText(/select hip/i), {
      target: { value: '36' },
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(screen.getByTestId('bodyfat-result')).toHaveTextContent(/7.13/);
    });
  });

  test('saves Bodyfat calculation result', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/bodyfat/post').reply(200, {
      Navy_BFP: 14.64,
    });

    mockAxios.onPost('http://localhost:5000/bmi/bodyInfo/12345').reply(200);
    mockAxios.onPost('http://localhost:5000/bmi/bodyfat/12345').reply(200);

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'bodyfat' } 
    });

    fireEvent.change(screen.getByLabelText(/select gender/i), { 
      target: { value: 'male' } 
    });
    fireEvent.change(screen.getByLabelText(/select age/i), { 
      target: { value: 25 } 
    });
    fireEvent.change(screen.getByLabelText(/select height/i), { 
      target: { value: 70 } 
    });
    fireEvent.change(screen.getByLabelText(/select waist/i), {
      target: { value: 36 },
    });
    fireEvent.change(screen.getByLabelText(/select neck/i), {
        target: { value: 15 },
    });
    fireEvent.change(screen.getByLabelText(/select hip/i), {
        target: { value: 40 },
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(screen.getByTestId('bodyfat-result')).toHaveTextContent(/14.64/);
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      console.log('POST Requests:', mockAxios.history.post);
      expect(mockAxios.history.post.length).toBe(3); 
      expect(mockAxios.history.post[1].url).toBe('http://localhost:5000/bmi/bodyInfo/12345');
      expect(JSON.parse(mockAxios.history.post[1].data)).toEqual({
        formName: 'bodyfat',
        gender: 'male',
        age: 25,
        height: 70,
        waist: 36,
        neck: 15,
        hip: 40,
      });

      expect(mockAxios.history.post[2].url).toBe('http://localhost:5000/bmi/bodyfat/12345');
      expect(JSON.parse(mockAxios.history.post[2].data)).toEqual({
        navyBFP: 14.64,
      });

      expect(window.alert).toHaveBeenCalledWith('Saved Successfully');
    });
  });

  // BASAL METABOLIC RATE

  test('Does the correct form elements render for Basal Metabolic Rate', () => {
    renderWithContext(<BMI />, { providerProps })
    fireEvent.change(screen.getByLabelText('Select calculation'), { target: { value: 'bmr' } });
    expect(screen.getByLabelText(/select gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select height/i)).toBeInTheDocument();
  })

  test('allows bmr form submission', async () => {
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/bmr/post').reply(200, {
      bmr: 2617.5,
    });

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { target: { value: 'bmr' } });

    fireEvent.change(screen.getByLabelText(/select gender/i), { 
      target: { value: 'male' } 
    });
    fireEvent.change(screen.getByLabelText(/select age/i), { 
      target: { value: '25' } 
    });
    fireEvent.change(screen.getByLabelText(/select weight/i), { 
      target: { value: '230' } 
    });
    fireEvent.change(screen.getByLabelText(/select height/i), { 
      target: { value: '70' } 
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBeGreaterThan(0);
      expect(mockAxios.history.post[0].url).toBe('https://health-calculator-api.p.rapidapi.com/bmr/post');

      if (mockAxios.history.post[0].data) {
          expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
          age: 25,
          weight: 230,
          height: 70,
          gender: 'male',
          equation: 'mifflin',
        });
      } else {
          throw new Error('POST request data is undefined');
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('bmr-result')).toHaveTextContent(/BMR:\s*2617.5/);
    });
  });

  test('saves BMR calculation result', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/bmr/post').reply(200, {
      bmr: 2617.5,
    });

    mockAxios.onPost('http://localhost:5000/bmi/bodyInfo/12345').reply(200);
    mockAxios.onPost('http://localhost:5000/bmi/bmr/12345').reply(200);

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'bmr' } 
    });

    fireEvent.change(screen.getByLabelText(/select gender/i), { 
      target: { value: 'male' } 
    });
    fireEvent.change(screen.getByLabelText(/select age/i), { 
      target: { value: 25 } 
    });
    fireEvent.change(screen.getByLabelText(/select weight/i), { 
      target: { value: 230 } 
    });
    fireEvent.change(screen.getByLabelText(/select height/i), { 
      target: { value: 70 } 
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(screen.getByTestId('bmr-result')).toHaveTextContent(/BMR:\s*2617.5/);
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(3); 
      expect(mockAxios.history.post[1].url).toBe('http://localhost:5000/bmi/bodyInfo/12345');
      expect(JSON.parse(mockAxios.history.post[1].data)).toEqual({
        formName: 'bmr',
        gender: 'male',
        age: 25,
        weight: 230,
        height: 70,
      });

      expect(mockAxios.history.post[2].url).toBe('http://localhost:5000/bmi/bmr/12345');
      expect(JSON.parse(mockAxios.history.post[2].data)).toEqual({
        bmrData: 2617.5,
      });

      expect(window.alert).toHaveBeenCalledWith('Saved Successfully');
    });
  });

  // TARGET HEART RATE 

  test('Does the correct form elements render for Target Heart Rate', () => {
    renderWithContext(<BMI />, { providerProps })
    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'thr' } 
    });
    expect(screen.getByLabelText(/select age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select fitness level/i)).toBeInTheDocument();
  })

  test('allows thr form submission', async () => {
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/thr/post').reply(200, {
      thrMax: 165.75, thrMin: 97.5,
    });

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'thr' } 
    });

    fireEvent.change(screen.getByLabelText(/select age/i), { 
      target: { value: '25' } 
    });
    fireEvent.change(screen.getByLabelText(/select fitness level/i), { 
      target: { value: 'beginner' } 
    });
    

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBeGreaterThan(0);
      expect(mockAxios.history.post[0].url).toBe('https://health-calculator-api.p.rapidapi.com/thr/post');

      if (mockAxios.history.post[0].data) {
          expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
          age: 25,
          fitness_level: 'beginner',
        });
      } else {
          throw new Error('POST request data is undefined');
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('thr-result-max')).toHaveTextContent(/165.75/);
      expect(screen.getByTestId('thr-result-min')).toHaveTextContent(/97.5/);
    });
  });

  test('saves THR calculation result', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/thr/post').reply(200, {
      thr_max: 165.75, thr_min: 97.5
    });

    mockAxios.onPost('http://localhost:5000/bmi/bodyInfo/12345').reply(200);
    mockAxios.onPost('http://localhost:5000/bmi/thr/12345').reply(200);

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'thr' } 
    });

    fireEvent.change(screen.getByLabelText(/select age/i), { 
      target: { value: '25' } 
    });
    fireEvent.change(screen.getByLabelText(/select fitness level/i), { 
      target: { value: 'beginner' } 
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(screen.getByTestId('thr-result-max')).toHaveTextContent(/165.75/);
      expect(screen.getByTestId('thr-result-min')).toHaveTextContent(/97.5/);
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      console.log('POST Requests:', mockAxios.history.post);
      expect(mockAxios.history.post.length).toBe(3); 
      expect(mockAxios.history.post[1].url).toBe('http://localhost:5000/bmi/bodyInfo/12345');
      expect(JSON.parse(mockAxios.history.post[1].data)).toEqual({
        formName: 'thr',
        age: 25,
        fitnessLevel: 'beginner',
      });

      expect(mockAxios.history.post[2].url).toBe('http://localhost:5000/bmi/thr/12345');
      expect(JSON.parse(mockAxios.history.post[2].data)).toEqual({
        thrMax: 165.75,
        thrMin: 97.5
      });

      expect(window.alert).toHaveBeenCalledWith('Saved Successfully');
    });
  });


  // FAT FREE MASS INDEX

  test('Does the correct form elements render for Fat Free Mass Index', () => {
    renderWithContext(<BMI />, { providerProps })

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'ffmi' } 
    });

    expect(screen.getByLabelText(/select gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select bodyfat/i)).toBeInTheDocument();
  });

  test('allows ffmi form submission', async () => {
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/ffmi/post').reply(200, {
      FFMI: 61.11,
      "Fat-free mass": '193.2 lb',
      "Normalized FFMI": 61.41,
      Sex: 'male',
      "Total body fat": '36.8 lb'
    });

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'ffmi' } 
    });
    fireEvent.change(screen.getByLabelText(/select gender/i), { 
      target: { value: 'male' } 
    });
    fireEvent.change(screen.getByLabelText(/select weight/i), { 
      target: { value: '230' } 
    });
    fireEvent.change(screen.getByLabelText(/select height/i), { 
      target: { value: '70' } 
    });
    fireEvent.change(screen.getByLabelText(/select bodyfat/i), { 
      target: { value: '16' } 
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBeGreaterThan(0);
      expect(mockAxios.history.post[0].url).toBe('https://health-calculator-api.p.rapidapi.com/ffmi/post');

      if (mockAxios.history.post[0].data) {
          expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
          sex: 'male',
          weight: 230,
          height: 70,
          body_fat: 16,
          unit: 'imperial',
          format: 'yes',
        });
      } else {
          throw new Error('POST request data is undefined');
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('ffmi-result-mass-index')).toHaveTextContent(/61.11/);
      expect(screen.getByTestId('ffmi-result-fat-free')).toHaveTextContent(/193.2 lb/);
      expect(screen.getByTestId('ffmi-result-normalized')).toHaveTextContent(/61.41/);
      expect(screen.getByTestId('ffmi-result-sex')).toHaveTextContent(/male/);
      expect(screen.getByTestId('ffmi-result-tbf')).toHaveTextContent(/36.8 lb/);
    });
  });

  // ADJUSTABLE BODY WEIGHT

  test('Does the correct form elements render for Adjustable Body Weight', () => {
    renderWithContext(<BMI />, { providerProps })

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'ajbw' } 
    });

    expect(screen.getByLabelText(/select gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select height/i)).toBeInTheDocument();
  });

  test('allows ajbw form submission', async () => {
    mockAxios.onPost('https://health-calculator-api.p.rapidapi.com/ajbw_imp/post').reply(200, {
      AjBW: 185.92,
      Height: 70,
      "IBW (Robinson)": 156.53,
      Sex: 'male',
      Weight: 230 
    });

    renderWithContext(<BMI />, { providerProps });

    fireEvent.change(screen.getByLabelText('Select calculation'), { 
      target: { value: 'ajbw' } 
    });
    fireEvent.change(screen.getByLabelText(/select gender/i), { 
      target: { value: 'male' } 
    });
    fireEvent.change(screen.getByLabelText(/select weight/i), { 
      target: { value: '230' } 
    });
    fireEvent.change(screen.getByLabelText(/select height/i), { 
      target: { value: '70' } 
    });

    fireEvent.click(screen.getByText(/calculate/i));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBeGreaterThan(0);
      expect(mockAxios.history.post[0].url).toBe('https://health-calculator-api.p.rapidapi.com/ajbw_imp/post');

      if (mockAxios.history.post[0].data) {
          expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
          sex: 'male',
          weight: 230,
          height: 70,
        });
      } else {
          throw new Error('POST request data is undefined');
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('ajbw-result-ajbw')).toHaveTextContent(/185.92/);
      expect(screen.getByTestId('ajbw-result-height')).toHaveTextContent(/70/);
      expect(screen.getByTestId('ajbw-result-ibw')).toHaveTextContent(/156.53/);
      expect(screen.getByTestId('ajbw-result-sex')).toHaveTextContent(/male/);
      expect(screen.getByTestId('ajbw-result-weight')).toHaveTextContent(/230/);
    });
  });
});

