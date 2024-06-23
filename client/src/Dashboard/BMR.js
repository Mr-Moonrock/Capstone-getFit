import React, { useState, useEffect, useContext } from 'react';
import './styles/BMR.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function BMR () {
  const [ bmr, setBmr ] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext) || {};

  const getThrValuesFromDb = async () => {
    try {
      const userId = currentUser.id;
      const baseURL = 'http://localhost:5000/bmi'
      const res = await fetch(`${baseURL}/bmr/${userId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch BMR values');
      }
      const data = await res.json();
      return data
    } catch (err) {
      console.error('Error getting bmr values', err);
      return null;
    }
  }

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return;
  }
  const fetchData = async () => {
    try {
      const bmrValues = await getThrValuesFromDb();
      if (bmrValues && bmrValues.userBmrData) {
        const userBmrValue = bmrValues.userBmrData.bmr;
        setBmr(userBmrValue)
      } else {
        console.error('BMR data not found')
      }
    } catch (err) {
      console.error('Error getting BMR data', err)
    }
  }
  fetchData();
}, [[currentUser, navigate]])

  return (
    <div>
      <div className='bmr-container'>
        <h5 className='text-center bmr-heading'> Basal Metabolic Rate </h5>
        <div className='bmrMax container'>
          <h6 className='bmr-display text-center'> {bmr} </h6>
        </div>
      </div>
    </div>
  )
}

export default BMR;