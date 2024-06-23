import React from 'react';
import '../styles/BmiInfo.css'
import { Link } from 'react-router-dom';
import BmiImage from '../../images/BmiImage.jpg';
import '../styles/BmiHomepage.css';

function BmiHomepage() {
  return (
    <div className='bmi-info-container'>
      <div className='bmi-homepage-img'>
        <img src= {BmiImage}  alt='bmi' className='bmi-image' />
      </div>
      
      <h6 className='bmi-homepage-header'> Why is BMI Important? </h6>
      <p className='bmi-info-paragraph'> 
        BMI is an estimate of body fat and a good gauge of your risk for diseases that can occur with more body fat. The higher your BMI, the higher your risk for certain diseases such as heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers. 
      </p>
      <Link to='/bmiInfo'> <button className='bmiInfo-btn' > BMI Info </button> </Link>
    </div>
  )
}

export default BmiHomepage;