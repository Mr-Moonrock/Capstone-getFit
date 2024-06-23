import React from 'react';
import './styles/Homepage.css';
import { Link } from 'react-router-dom';
import BmiHomepage from './BmiComponent/BmiHomepage';
import CalendarHomepage from './CalendarHomepage';
import IntroImage from '../images/IntroImage.jpg';
import homepgCalendarImage from '../images/homepgCalendarImage.jpg';
import lifestyleChangesHomepage from '../images/lifestyleChangesHomepage.jpg';
import classesImage from '../images/classesImage.jpg';
import equipmentImage from '../images/equipmentImage.jpg';

function Homepage() {
  return (
    <div className='Homepage'>
      <div className='homepage-intro-container'>
        <div className='homepage-side-by-side'> 
          <div className='homepage-intro-left-container'>
            <h6 className='homepage-intro-header'> Improve Yourself.</h6>
            <p className='homepage-intro-paragraph'> Choose from hundreds of cardio and strength training exercises. </p>
            <Link to='/register'> 
              <button className='homepage-join-now-btn' > Join Now </button> 
            </Link>
          </div>
          <div id='homepage-intro-image'>
            <img src={IntroImage} className='homepage-intro-img' alt='IntroImage'/> 
          </div>
        </div>
      </div>

      <div className='homepage-side-by-side'> 
        <div className='homepage-bmi-container'>
          <h6 className='display-6 text-center homepage-bmi-header'> Calculate Your BMI </h6>
          < BmiHomepage />
        </div>
        <div className='homepage-calendar-container'>
          <CalendarHomepage /> 
          <div> 
            <img src={homepgCalendarImage} className='homepage-calendar-Image' alt='homepgCalendarImage'/>
          </div>
        </div>
      </div>
      
      <div className='homepage-lifestyle-container'>
        <div className='homepage-side-by-side'> 
        <div id='homepage-lifestyle-image'>
            <img src={lifestyleChangesHomepage} className='homepage-lifestyle-img' alt='lifestyleChangesHomepage'/> 
          </div>
          <div className='homepage-lifestyle-right-container'>
            <h6 className='homepage-lifestyle-header text-center'> Change Your Lifestyle.</h6>
            <p className='homepage-intro-paragraph'> Read a few ways you can change your habits </p>
            <Link to='/lifestyleChanges'> 
              <button className='homepage-lifestyleChanges-btn' > Lifestyle Changes </button> 
            </Link>
          </div>
        </div>
      </div>

      <div className='coming-soon-side-by-side'> 
        <div className='equipment-container'>
          <img src={classesImage} className='classes-img' alt= 'classesImage' />
        </div>
        <div className='coming-soon-intro-container'> 
          <h4 className='coming-soon-intro-header text-center'> Coming Soon!!</h4>
          <p className='coming-soon-online-classes'> <b>FREE</b> Online Classes with certified personal trainers whether you're at home or on the road. </p>
          <button className='classes-btn' > Online Classes </button> 
        </div>
        <div className='classes-container'>
          <img src={equipmentImage} className='equipment-img' alt='equipmentImage'/>
        </div>
        <div className='equipment-intro-container'> 
          <h4 className='equipment-intro-header text-center'> Coming Soon! </h4>
          <p className='equipment-intro-paragraph'> Find the best <b>workout equipment</b> from some of the top brands. </p>
          <button className='equipment-btn' > Buy Equipment </button> 
        </div>
      </div>
    </div>
  )
}

export default Homepage;