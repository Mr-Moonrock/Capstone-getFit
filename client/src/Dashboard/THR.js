import React, { useState, useEffect, useContext } from 'react';
import './styles/THR.css'
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function THR () {
  const { currentUser } = useContext(UserContext) || {};
  const [ thrMin, setThrMin ] = useState(0);
  const [ thrMax, setThrMax ] = useState(0);
  const navigate = useNavigate();

  const getThrValuesFromDb = async () => {
    try {
      const userId = currentUser.id;
      const baseURL = 'http://localhost:5000/bmi'
      const res = await fetch(`${baseURL}/thr/${userId}`)
      const data = await res.json();
      return data
    } catch (err) {
      console.error('Error getting thr values')
      return [];
    }
  }

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return;
  }
  const fetchData = async () => {
    try {
        const thrValues = await getThrValuesFromDb();
        if (thrValues.userThrData) {
          const thrMinValue = thrValues.userThrData.thr_min;
          const thrMaxValue = thrValues.userThrData.thr_max;
          setThrMin(thrMinValue)
          setThrMax(thrMaxValue)
        } else {
          console.error('THR data not found')
        }
      } catch (err) {
        console.error('Error getting THR data', err)
      }
    }
    fetchData();
  }, [[currentUser, getThrValuesFromDb, navigate]])

  return (
    <div>
      <div className='thr-container'>
        <h5 className='text-center thr-heading'> Target Heart Rate 💓 </h5>
        <div className='thrMax container'>
          <h6 className='thrMax-display text-left'> THR Max: {thrMax} </h6>
        </div>
        <div className='thrMin container'>
          <h6 className='thrMin-display text-left'> THR Min: {thrMin} </h6>
        </div>
      </div>
    </div>
  )
}

export default THR;