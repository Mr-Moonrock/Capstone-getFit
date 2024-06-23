import React, { useState, useEffect, useContext } from 'react';
import './styles/AjBW.css'
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function AjBW () {
  const { currentUser } = useContext(UserContext) || {};
  const [ajbw, setAjbw] = useState(0);
  const [ibwRobinson, setIbbwRobinson] = useState(0);
  const navigate = useNavigate();

  const getAjbwFromDb = async () => {
    try {
      const userId = currentUser.id;
      const baseURL = 'http://localhost:5000/bmi'
      const res = await fetch(`${baseURL}/ajbw/${userId}`)
      const data = await res.json();
      return data
    } catch (err) {
      console.error('Error getting AjBW values')
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
        const ajbwValues = await getAjbwFromDb();
        if (ajbwValues.userAjbwData) {
          const userNavyBfpValue = ajbwValues.userAjbwData.ajbw;
          const userIbwRobinsonValue = ajbwValues.userAjbwData.ibw_robinson
          setAjbw(userNavyBfpValue)
          setIbbwRobinson(userIbwRobinsonValue)
        } else {
          console.error('AjBW data not found')
        }
      } catch (err) {
        console.error('Error getting AjBW data', err)
      }
    };
    fetchData();
  }, [currentUser, getAjbwFromDb, navigate]);

  return (
    <div>
      <div className='ajbw-robinson-container'>
        <div className='ajbw container'>
          <h5 className='ajbw-heading text-center'> Adjustable Body Weight </h5>
          <div >
            <h6 className='ajbw-display'> AjBW: {ajbw} </h6>
          </div>
        </div>
        <div className='robinson container'>
          <div >
            <h6 className='robinson-display'> Ideal Body Weight: {ibwRobinson} </h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AjBW;