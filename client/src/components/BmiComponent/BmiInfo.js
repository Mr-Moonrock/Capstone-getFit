import React from 'react';
import BmiTable from './BmiTable';
import bmiChartImage from '../../images/bmiChartImage.jpg';

function BmiInfo() {
  return (
    <div>
      <h1 className='bmi-info-header text-center'> Methods of Calculating Body Mass </h1>
      <div className='container' id='bmi-method-container'>
        <h4 className='text-center bmi-method'> BMI Category and Table </h4>
        <div className='bmi-chart-and-table-container'>
          <div className='container' id='bmi-chart-container'>
            <img src={bmiChartImage} alt='bmiChartImage' className='bmi-chart'/>  
          </div>
          <div className='bmi-table-container'> 
            <BmiTable /> 
          </div>
        </div>
      </div>
      <div className='container' >
        <h4 className='text-center bmi-method'>Body Fat (BMI method)</h4>
        <p className='bmi-info'> 
          Body mass index is a tool that healthcare providers use to estimate the amount of body fat by using your height and weight measurements. It can help assess risk factors for certain health conditions. The BMI is not always an accurate representation of body fatness.
        </p>
      </div>
      <div className='container' >
        <h4 className='text-center bmi-us-navy-method'> Body Fat (U.S. Navy Method) </h4>
        <p className='bmi-info'> 
          There are many specific techniques used for measuring body fat. The calculator above uses a method involving equations developed at the Naval Health Research Center by Hodgdon and Beckett in 1984. The method for measuring the relevant body parts as well as the specific equations used are provided below:
        </p>
        <h6 className='text-center'> How to measure for the calculation? </h6>
        <ul className='bmi-info'>
          <li className='bmi-info'> 
            Measure the circumference of the subject's waist at a horizontal level around the navel for men, and at the level with the smallest width for women. Ensure that the subject does not pull their stomach inwards to obtain accurate measurements. 
          </li>
          <li className='bmi-info'>
            Measure the circumference of the subject's neck starting below the larynx, with the tape sloping downward to the front. The subject should avoid flaring their neck outwards.
          </li>
          <li className='bmi-info'>
            <b> For women only: </b> Measure the circumference of the subject's hips at the largest horizontal measure.
          </li>
        </ul>
      </div>
      <div className='container' >
        <h4 className='text-center bmi-bodyfat-mass'> Body Compositon </h4>
        <ul className='bmi-info'>
          <li className='bmi-info'> 
            Body Fat Mass:  Also known as stored fat, this is found in your adipose tissue. This type of fat is used as energy for your body. It insulates and cushions your body. It surrounds your organs and is just under your skin. Total amount of fat in the body. 
          </li>
          <li className='bmi-info'>
            Lean Body Mass: This includes muscle, organs, and bone. The Total Weight - Body Fat Mass = Lean Body Mass.
          </li>
        </ul>
      </div>

    </div>
  )
}

export default BmiInfo;
