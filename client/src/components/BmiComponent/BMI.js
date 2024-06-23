import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import '../styles/BMI.css';
import BmiInfo from './BmiInfo';
import logoImage from '../../images/logoImage.jpg';
import { UserContext } from '../../UserContext';
import BmiResultCard from './BmiResultCard';

function BMI() {
  const { currentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    neck: "",
    waist: "",
    hip: "",
    fitnessLevel: "",
    bodyFat: "",
    equation: "mifflin",
  });

  const [ selectedCalculation, setSelectedCalculation] = useState('bodyfat');
  const [ result, setResult ] = useState(null);

  useEffect(() => {
    setResult(null);
  }, [selectedCalculation]);

  const generateApiOptions = () => {
    const headers = {
      'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
      'x-rapidapi-host': 'health-calculator-api.p.rapidapi.com',
      'Content-Type': 'application/json'
    };
    
    const requestData = {
      gender: formData.gender,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      neck: Number(formData.neck),
      waist: Number(formData.waist),
      hip: Number(formData.hip),
      fitnessLevel: formData.fitnessLevel,
      bodyFat: Number(formData.bodyFat),
      equation: formData.equation,
    };

    switch (selectedCalculation) {
      case "bmr":
        return {
          method: 'POST',
          url: 'https://health-calculator-api.p.rapidapi.com/bmr/post',
          headers: { ...headers, },
          data: {
            age: requestData.age,
            weight: requestData.weight,
            height: requestData.height,
            gender: requestData.gender,
            equation: requestData.equation,
          },
          requestData,
        };
      case "thr":
        return {
          method: 'POST',
          url: 'https://health-calculator-api.p.rapidapi.com/thr/post',
          headers: { ...headers, },
          data: {
            age: requestData.age,
            fitness_level: requestData.fitnessLevel,
          },
          requestData,
        };
      case "ffmi":
        return {
          method: 'POST',
          url: 'https://health-calculator-api.p.rapidapi.com/ffmi/post',
          headers: { ...headers, },
          data: {
            sex: requestData.gender,
            height: requestData.height,
            weight: requestData.weight,
            body_fat: requestData.bodyFat,
            unit: 'imperial',
            format: 'yes',
          },
          requestData,
        };
      case "ajbw":
        return {
          method: 'POST',
          url: 'https://health-calculator-api.p.rapidapi.com/ajbw_imp/post',
          headers: { ...headers, },
          data: {
            sex: requestData.gender,
            height: requestData.height,
            weight: requestData.weight,
          },
          requestData,
        };
      case "bodyfat":
        return {
          method: 'POST',
          url: 'https://health-calculator-api.p.rapidapi.com/bodyfat/navy',
          headers: { ...headers, },
          data: {
            sex: requestData.gender,
            age: requestData.age,
            height: requestData.height,
            waist: requestData.waist,
            neck: requestData.neck,
            hip: requestData.hip,
          },
          requestData,
        };
      default:
        throw new Error(`Unsupported API case: ${formData.apiCase}`);
    }
  };

  const calculate = async () => {
    try {
      const options = generateApiOptions();
      const response = await axios.request(options);
      setResult(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    calculate();
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const formatNumber = (num) => {
    return parseFloat(num.toFixed(1)).toString();
  };

  const generateDropdownOptions = (min, max, step) => {
    const options = [];
    for (let i = min; i <= max; i += step) {
      options.push(formatNumber(i));
    }
    return options;
  };

  const handleSave = async (selectedCalculation, requestData, resultData) => {
    try {
      if (!currentUser.id) {
        return;
      }
      const userId = currentUser.id;
      const baseURL = 'http://localhost:5000/bmi';
  
      const userBodyInfoData = {
        fitnessLevel: requestData.fitnessLevel || null,
        age: requestData.age || null,
        weight: requestData.weight || null,
        height: requestData.height || null,
        gender: requestData.gender || null,
        waist: requestData.waist || null,
        neck: requestData.neck || null,
        hip: requestData.hip || null,
        bodyFat: requestData.bodyFat || null,
      };
      console.log('User Body Info', userBodyInfoData);
      const filteredBodyInfoData = Object.fromEntries(
        Object.entries(userBodyInfoData).filter(([key, value]) => value !== null)
      );
      console.log('filtered data', filteredBodyInfoData)
  
      if (['bmr', 'thr', 'bodyfat'].includes(selectedCalculation)) {
        const bodyInfoResponse = await axios.post(`${baseURL}/bodyInfo/${userId}`, {
          ...filteredBodyInfoData,
          formName: selectedCalculation
        });

        if (bodyInfoResponse.status !== 200) {
          throw new Error('Failed to save body info');
        }
      }
      let saveUrl, saveData;
      switch (selectedCalculation) {
        case 'bmr':
          saveUrl = `${baseURL}/bmr/${userId}`;
          saveData = { bmrData: resultData.bmr };
          break;
        case 'thr':
          saveUrl = `${baseURL}/thr/${userId}` 
          saveData = { thrMax: resultData.thr_max, thrMin: resultData.thr_min };
          break;
        case 'bodyfat':
          saveUrl = `${baseURL}/bodyfat/${userId}`
          saveData = { navyBFP: resultData.Navy_BFP };
          break;
        case 'ajbw':
          saveUrl = `${baseURL}/ajbw/${userId}`
          saveData = { ajbw: resultData.AjBW, ibwRobinson: resultData['IBW (Robinson)'] };
          break;
        case 'ffmi':
          saveUrl = `${baseURL}/ffmi/${userId}`
          saveData = { ffmi: resultData.FFMI, fatFreeMass: resultData['Fat-free mass'], totalBodyFat: resultData['Total body fat'] };
          break;
        default:
          console.error('Invalid calculation type');
          return
      }
      const response = await axios.post(saveUrl, saveData);
      if (response.status === 200) {
        alert('Saved Successfully');
      } else {
        throw new Error('Failed to save calculation data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const headings = {
    bmr: "Basal Metabolic Rate",
    thr: "Target Heart Rate",
    ffmi: "Fat-Free Mass Index",
    ajbw: "Adjusted Body Weight",
    bodyfat: "Body Fat",
  };

  const heightOptions = generateDropdownOptions(58, 84, 0.5);
  const weightOptions = generateDropdownOptions(50, 500, 1);
  const waistOptions = generateDropdownOptions(10, 60, 0.5);
  const ageOptions = generateDropdownOptions(10, 100, 1);
  const bodyFatOptions = generateDropdownOptions(1, 100, 0.1)
  const fitnessLevelOptions = ['beginner', 'intermediate', 'advanced']

  return (
    <>
      <div className="bmi-background-element" id='bmi-form'>
        <div className='bmi-form-container'>
          <div className="card-body" id='bmi-card-body'>
            <div className="card" id='bmi-card'>
              <div className='bmi-logo-and-title'>
                <img  src={logoImage}
                      alt='logoImage'
                      className='bmi-logoImage'
                />
                <div className='bmi-divider'></div>
                <h2 className='bmi-title'> Get Fit </h2>
              </div>
              <h2 className="text-center mb-3" id='bmi-header'> {headings[selectedCalculation]}  </h2>
              <form onSubmit={handleSubmit}>
              <div className="form-group" id='bmi-form-group'>
                <select 
                    name="selectedCalculation"
                    className="bmi-form-control"
                    value={selectedCalculation}
                    onChange={(e) => setSelectedCalculation(e.target.value)}
                    id='bmi-input-form-control-select-calculation'
                    aria-label="Select calculation"
                >
                  <option value="bmr">Basal Metabolic Rate</option>
                  <option value="thr">Target Heart Rate</option>
                  <option value="ffmi">Fat-Free Mass Index</option>
                  <option value="ajbw">Adjusted Body Weight</option>
                  <option value="bodyfat">Body Fat</option>
                </select>
              </div>
              {(selectedCalculation === 'bmr' || selectedCalculation === 'bodyfat' || selectedCalculation === 'ajbw' || selectedCalculation === 'ffmi') && (
                <div className="form-group" id='bmi-form-group'>
                  <select 
                      aria-label="select gender"
                      name='gender'
                      className='bmi-form-control'
                      value={formData.gender}
                      onChange={handleChange}
                      id='bmi-input-form-control-gender'
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>male</option>
                    <option value='female'>female</option>
                  </select>
                </div>
              )}
              {(selectedCalculation === 'bmr' || selectedCalculation === 'bodyfat' || selectedCalculation === 'thr') && (
                <div className="form-group" id='bmi-form-group'>
                  <select 
                      aria-label="select age"
                      name='age'
                      className='bmi-form-control'
                      value={formData.age}
                      onChange={handleChange}
                      id='bmi-input-form-control-age'
                  >
                    <option value=''>Select age</option>
                    {ageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
              {(selectedCalculation === 'bmr' || selectedCalculation === 'ajbw' || selectedCalculation === 'ffmi') && (
                <div className="form-group" id='bmi-form-group'>
                  <select 
                      aria-label="select weight"
                      name='weight'
                      className='bmi-form-control'
                      value={formData.weight}
                      onChange={handleChange}
                      id='bmi-input-form-control-weight'
                  >
                    <option value=''>Select weight (lbs)</option>
                    {weightOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
              {(selectedCalculation === 'bmr' || selectedCalculation === 'bodyfat' || selectedCalculation === 'ajbw' || selectedCalculation === 'ffmi') && (
                <div className="form-group" id='bmi-form-group'>
                  <select 
                      aria-label="select height"
                      name='height'
                      className='bmi-form-control'
                      value={formData.height}
                      onChange={handleChange}
                      id='bmi-input-form-control-height'
                  >
                    <option value=''>Select height (inches)</option>
                    {heightOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
              {selectedCalculation === "bodyfat" && (
                <>
                  <div className="form-group" id='bmi-form-group'>
                    <select 
                      aria-label="select waist"
                      name='waist'
                      className='bmi-form-control'
                      value={formData.waist}
                      onChange={handleChange}
                      id='bmi-input-form-control-waist'
                    >
                      <option value=''>Select waist (inches)</option>
                      {waistOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" id='bmi-form-group'>
                    <select 
                        aria-label="select neck"
                        name="neck"
                        className="bmi-form-control"
                        value={formData.neck}
                        onChange={handleChange}
                        id='bmi-input-form-control-neck'
                    >
                      <option value=''>Select neck (inches)</option>
                      {waistOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}          
                    </select>
                  </div>
                  <div className="form-group" id='bmi-form-group'>
                    <select 
                        aria-label="select hip"
                        name="hip"
                        className="bmi-form-control"
                        value={formData.hip}
                        onChange={handleChange}
                        id='bmi-input-form-control-hip'
                    >
                      <option value=''>Select hip (inches)</option>
                      {waistOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}          
                    </select>
                  </div>
                </>
              )}
              {selectedCalculation === "thr" && (
                <div className="form-group" id='bmi-form-group'>
                  <select 
                      aria-label="select fitness level"
                      name="fitnessLevel"
                      className="bmi-form-control"
                      value={formData.fitnessLevel}
                      onChange={handleChange}
                      id='bmi-input-form-control-fitnessLevel'
                  >
                    <option value="">Select fitness level</option>
                    {fitnessLevelOptions.map((level) => (
                      <option key={level} value={level}> {level} </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedCalculation === "ffmi" && (
                <div className="form-group" id='bmi-form-group'>
                  <select 
                      aria-label="select bodyfat"
                      name="bodyFat"
                      className="bmi-form-control"
                      value={formData.bodyFat}
                      onChange={handleChange}
                      id='bmi-input-form-control-bodyfat'
                  >
                    <option value=''>Select body fat percentage</option>
                    {bodyFatOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
              <button type="submit"
                      className="btn btn-primary mx-auto d-block"
                      id='bmi-btn'>Calculate
              </button>  
            </form>
              {result && (
                <BmiResultCard 
                  result={result} 
                  onSave={() => handleSave(selectedCalculation, generateApiOptions().requestData, result)} 
                  selectedCalculation={selectedCalculation} 
                  requestData={generateApiOptions().requestData} 
                />
              )}       
            </div>           
          </div>
        </div>
      </div>
        <BmiInfo /> 
      </>
  );
}

export default BMI;