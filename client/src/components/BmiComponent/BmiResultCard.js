import React from 'react';
import '../styles/BmiResultCard.css';
import PropTypes from 'prop-types';

const BmiResultCard = ({ result, onSave, selectedCalculation, requestData }) => {
  const renderResult = () => {
    if (result.bmr) {
      return <p data-testid='bmr-result'> BMR: <span>{result.bmr}</span></p>;
    } else if (result.thr_max && result.thr_min) {
      return (
        <>
          <p>THR Max: 
            <span data-testid='thr-result-max'>{result.thr_max}</span>
          </p>
          <p>THR Min: 
            <span data-testid='thr-result-min'>{result.thr_min}</span>
          </p>
        </>
      );
    } else if (result.FFMI) {
      return (
        <>
          <p> FFMI: <span data-testid='ffmi-result-mass-index'> {result.FFMI} </span></p>
          <p> Fat-free mass: <span data-testid='ffmi-result-fat-free'> {result["Fat-free mass"]} </span></p>
          <p> Normalized FFMI: <span data-testid='ffmi-result-normalized'> {result["Normalized FFMI"]} </span></p>
          <p> Sex: <span data-testid='ffmi-result-sex'> {result.Sex} </span></p>
          <p> Total body fat: <span data-testid='ffmi-result-tbf'> {result["Total body fat"]} </span></p>
        </>
      );
    } else if (result.AjBW) {
      return (
        <>
          <p> AjBW: <span data-testid='ajbw-result-ajbw'> {result.AjBW} </span></p>
          <p> Height: <span data-testid='ajbw-result-height'> {result.Height} </span></p>
          <p> IBW (Robinson): <span data-testid='ajbw-result-ibw'> {result["IBW (Robinson)"]} </span></p>
          <p> Sex: <span data-testid='ajbw-result-sex'> {result.Sex} </span></p>
          <p> Weight: <span data-testid='ajbw-result-weight'> {result.Weight} </span></p>
        </>
      );
    } else if (result.Navy_BFP) {
      return (
        <>
          <p> Navy BFP: <span data-testid='bodyfat-result'>{result.Navy_BFP} </span></p>
        </>
      );
    } else {
      return <p>No result available</p>;
    }
  }
  return (
    <div className="bmi-result-card-container">
      <h3>Result:</h3>
      {renderResult()}
      <button onClick={() => onSave(selectedCalculation, requestData, result)} 
              className="btn btn-success">
        Save
      </button>
    </div>
  );
};

BmiResultCard.propTypes = {
  result: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedCalculation: PropTypes.string.isRequired,
  requestData: PropTypes.object.isRequired,
};

export default BmiResultCard;