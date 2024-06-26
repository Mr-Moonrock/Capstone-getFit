import React, { useState, useEffect, useContext } from 'react';
import './styles/Bodyfat.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function Bodyfat () {
  const [ navyBfp, setNavyBfp ] = useState(0);
  const { currentUser } = useContext(UserContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    const getBodyfatFromDb = async () => {
      try {
        const userId = currentUser.id;
        const baseURL = `${process.env.REACT_APP_BACKEND_URL}/bmi`
        const res = await fetch(`${baseURL}/bodyfat/${userId}`)
        const data = await res.json();
        return data
      } catch (err) {
        console.error('Error getting bodyfat values')
        return null;
      }
    }
  
    const fetchData = async () => {
      try {
        if (!currentUser) {
          navigate('/login')
          return;
      }
      const bodyfatValues = await getBodyfatFromDb();
        if (bodyfatValues.userBodyfatData) {
          const userNavyBfpValue = bodyfatValues.userBodyfatData.navy_bfp;
          setNavyBfp(userNavyBfpValue)
        } else {
          console.error('Bodyfat data not found')
        }
      } catch (err) {
          console.error('Error getting Bodyfat data', err)
      }
    }
    fetchData();
  }, [currentUser, navigate])
    
  return (
    <div>
      <div className='bodyfat-container'>
        <h5 className='bodyfat-heading text-center'> Bodyfat Percentage (Navy) </h5>
        <div className='navyBfp container'>
          <h6 className='navyBfp-display text-center'> {navyBfp} </h6>
        </div>
      </div>
    </div>
  )
}

export default Bodyfat;