import React, {useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../components/Register';
import Login from '../components/Login';
import BmiInfo from '../components/BmiComponent/BmiInfo';
import BMI from '../components/BmiComponent/BMI';
import Homepage from '../components/Homepage';
import Navbar from './Navbar';
import Dashboard from '../Dashboard/Dashboard';
import AllExercises from '../Dashboard/ExercisesCarousel'; 
import CardioInfo from '../userPages/exercises/CardioInfo';
import Cardio from '../userPages/exercises/Cardio';
import Arms from '../userPages/exercises/Arms';
import Back from '../userPages/exercises/Back';
import Chest from '../userPages/exercises/Chest';
import Legs from '../userPages/exercises/Legs';
import Neck from '../userPages/exercises/Neck';
import Shoulders from '../userPages/exercises/Shoulders';
import LifestyleChanges from '../components/LifestyleChanges';
import CalendarComp from '../userPages/calendar/CalendarComp';
import Abs from '../userPages/exercises/Abs';
import { UserContext } from '../UserContext';


function AppRoutes() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className='pt-5'>
    <Navbar />
    <Routes>   
        { currentUser ? (
          <>
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='/bmi' element={ <BMI /> }/> 
            <Route path='/calendar' element={ <CalendarComp /> }/>
            <Route path='/cardioInfo' element={ <CardioInfo /> }/>
            <Route path='/cardio' element={ <Cardio /> }/>
            <Route path='/arms' element={ <Arms /> }/>
            <Route path='/back' element={ <Back /> }/>
            <Route path='/legs' element={ <Legs /> }/>
            <Route path='/neck' element={ <Neck /> }/>
            <Route path='/abs' element={ <Abs /> }/>
            <Route path='/shoulders' element={ <Shoulders /> }/>
            <Route path='/chest' element={ <Chest /> }/>
            <Route path='/allExercises' element={ <AllExercises /> }/>
            <Route path='/lifestyleChanges' element={<LifestyleChanges />}/> 
            <Route path='/bmiInfo' element={<BmiInfo />}/> 
            <Route path='/' element={<Homepage />}/>
          </>
        ) : (
          <>
            <Route path='/' element={<Homepage />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/lifestyleChanges' element={<LifestyleChanges />}/> 
            <Route path='/bmiInfo' element={<BmiInfo />}/> 
          </>
        )}
    </Routes>
</div>
  );
}

export default AppRoutes;