import React, { useState, useEffect, useContext } from 'react';
import './styles/UserInfo.css'
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function UserInfo () {
  const [ age, setAge ] = useState(0);
  const [ weight, setWeight ] = useState(0);
  const [ height, setHeight ] = useState(0);
  const [ waist, setWaist ] = useState(0);
  const [ neck, setNeck ] = useState(0);
  const [ hip, setHip ] = useState(0);
  const [ fitnessLevel, setFitnessLevel ] = useState('')
  const [ bodyfat, setBodyfat] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext) || {};

  const getUserInfoFromDb = async () => {
    try {
      const userId = currentUser.id;
      const baseURL = 'http://localhost:5000/bmi'
      const res = await fetch(`${baseURL}/bodyInfo/${userId}`)
      const data = await res.json();
      return data
    } catch (err) {
      console.error('Error getting User Info')
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
      const userInfoValues = await getUserInfoFromDb();
      if (userInfoValues.userBodyInfoData) {
        const userAge = userInfoValues.userBodyInfoData.user_age;
        const userWeight = userInfoValues.userBodyInfoData.user_weight; 
        const userHeight = userInfoValues.userBodyInfoData.user_height;
        const userWaist = userInfoValues.userBodyInfoData.user_waist;
        const userNeck = userInfoValues.userBodyInfoData.user_neck;
        const userHip = userInfoValues.userBodyInfoData.user_hip;
        const fitnessLevel = userInfoValues.userBodyInfoData.user_fitness_level;
        const bodyfat = userInfoValues.userBodyInfoData.user_bodyfat;
        setAge(userAge)
        setWeight(userWeight)
        setHeight(userHeight)
        setWaist(userWaist)
        setNeck(userNeck)
        setHip(userHip)
        setFitnessLevel(fitnessLevel)
        setBodyfat(bodyfat)
      } else {
        console.error('User Info not found')
      }
    } catch (err) {
      console.error('Error getting User Info', err)
    }
  }
  fetchData();
}, [ currentUser, getUserInfoFromDb, navigate ])

  return (
    <div>
      <div className='userInfo-container'>
        <h5 className='userInfo-heading text-center'> User Info </h5>
        <div className='age container'>
          <h6 className='age-display'> Age: {age} </h6>
        </div>
        <div className='weight container'>
          <h6 className='weight-display'> Weight: {weight} lbs </h6>
        </div>
        <div className='height container'>
          <h6 className='height-display'> Height: {height} in </h6>
        </div>
        <div className='waist container'>
          <h6 className='waist-display'> Waist: {waist} in </h6>
        </div>
        <div className='neck container'>
          <h6 className='neck-display'> Neck: {neck} in </h6>
        </div>
        <div className='hip container'>
          <h6 className='hip-display'> Hip: {hip} in </h6>
        </div>
        <div className='fitnessLevel container'>
          <h6 className='fitnessLevel-display'> Fitness Level: {fitnessLevel} </h6>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;