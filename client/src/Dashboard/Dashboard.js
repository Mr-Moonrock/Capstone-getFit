import React from 'react';
import { useLocation } from 'react-router-dom';
import GetQuotes from './quotes/GetQuotes';
import AllExercises from './ExercisesCarousel';
import CardioCarousel from './CardioCarousel'
import './styles/Dashboard.css'
import CalendarDashboard from './CalendarDashboard';
import UpcomingClasses from './UpcomingClasses';
import THR from './THR';
import UserInfo from './UserInfo';
import Bodyfat from './Bodyfat';
import AjBW from './AjBW';
import FFMI from './FFMI';
import BMR from './BMR';

const Dashboard = () => {

  return (
    <div className='container mt-4'>
      <div className='row'>
        <div className='col-md-4'></div>
          <div class='container' className='dashboard'>
            <div className='quotes-container'>
              <h6 className='text-center quotes-heading'> Daily Motivation </h6>
                <GetQuotes />
            </div>
            <div>
              <THR />
            </div>
            <div>
              <UserInfo />
            </div>
            <div>
              <Bodyfat />
            </div>
            <div>
              <AjBW />
            </div>
            <div>
              <FFMI />
            </div>
            <div>
              <BMR />
            </div>
            <div className='dashboard-calendar-container'>
              <h4 className='text-center'> Upcoming Classes and Workouts </h4>
                <UpcomingClasses />
                <CalendarDashboard />
            </div>
            <div id='exercise-carousel-section'>
              <AllExercises />
            </div>
            <div class='container py-3' id='cardio-carousel-section'>
              <CardioCarousel />
            </div>      
          </div>
        </div>
      </div>
  )
}

export default Dashboard;


