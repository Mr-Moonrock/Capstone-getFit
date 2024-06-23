import React, { useState, useEffect, useContext } from 'react';
import './styles/FFMI.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function FFMI () {
  const [ffmi, setFfmi] = useState(0);
  const [fatFreeMass, setFatFreeMass] = useState(0);
  const [totalBodyFat, setTotalBodyFat] = useState(0);
  const { currentUser } = useContext(UserContext) || {};
  const navigate = useNavigate();

  const getFfmiFromDb = async () => {
    try {
      const userId = currentUser.id;
      const baseURL = 'http://localhost:5000/bmi'
      const res = await fetch(`${baseURL}/ffmi/${userId}`)
      const data = await res.json();
      return data
    } catch (err) {
      console.error('Error getting FFMI values')
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
        const ffmiValues = await getFfmiFromDb();
        if (ffmiValues.userFfmiData) {
          const userFfmiValue = ffmiValues.userFfmiData.ffmi;
          const userFatFreeMassValue = ffmiValues.userFfmiData.fat_free_mass;
          const userTotalBodyFat = ffmiValues.userFfmiData.total_body_fat;
          setFfmi(userFfmiValue)
          setFatFreeMass(userFatFreeMassValue)
          setTotalBodyFat(userTotalBodyFat)
        } else {
          console.error('FFMI data not found')
        } 
      } catch (err) {
        console.error('Error getting FFMI data', err)
      }
    }
    fetchData();
  }, [currentUser, getFfmiFromDb, navigate]);

  return (
    <div>
      <div className='ffmi-container'>
        <div className='ffmiValue container'>
          <div className='ffmi display'>
            <h5 className='ffmi-heading text-center'> Fat-Free Mass Index </h5>
            <h6 className='ffmiValue-display'> FFMI: {ffmi} </h6>
          </div>
          <div >
            <h6 className='fatFreeMass-display'> Fat Free Mass: {fatFreeMass} </h6>
          </div>
          <div >
            <h6 className='totalBodyFat-display'> Total Body Fat: {totalBodyFat} </h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FFMI;