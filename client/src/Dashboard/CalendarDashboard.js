import React, { useEffect, useState, useContext } from 'react';
import './styles/CalendarDashboard.css';
import { UserContext } from '../UserContext';
import axios from 'axios';
import CalendarDashboardCard from './CalendarDashboardCard';
import { useNavigate } from 'react-router-dom';
import './styles/CalendarDashboard.css';

function CalendarDashboard() {
  const { currentUser } = useContext(UserContext) || {};
  const [ sevenDayWorkoutForecast, setSevenDayWorkoutForecast ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false);
  const [ exerciseDetails, setExerciseDetails ] = useState([])
  const [activeTab, setActiveTab] = useState(null);
  const [workoutsReadyForDisplay, setWorkoutsReadyForDisplay] = useState([]);
  const navigate = useNavigate();

  const fetchExercisesFromAPI = async (exercisesNames) => {
    const requests = exercisesNames.map(name => {
      const options = {
        method: 'GET',
        url: `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}`,
        parms: {limit: 1},
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      };
      return axios.request(options)
    });
    try {
      const responses = await Promise.all(requests)
      const workoutsReadyForDisplay = responses.map(response => response.data[0]);
      return workoutsReadyForDisplay
    } catch (err) {
      console.error('Error fetching exercise data from api', err);
      throw err;
    }
  }

  useEffect(() => {
    const fetchSevenDayDataFromdb = async () => {
      try {
        setIsLoading(true);
        const userId = currentUser.id;
        const baseUrl = `http://localhost:5000/calendar/sevenDay/${userId}`;
        const response = await axios.get(baseUrl);

        if (Array.isArray(response.data)) {
          const formattedWorkouts = response.data.map((workout, index) => ({
            id: index + 1,
            name: workout.exercise_name,
            date: workout.formatted_date,
            timeRange: workout.time_range,
          }));
          setSevenDayWorkoutForecast(formattedWorkouts)
          if (formattedWorkouts.length > 0) {
            setActiveTab(formattedWorkouts[0].date);
          }
          const exerciseNames = extractWorkoutNames(formattedWorkouts);
          const detailedWorkouts = await fetchExercisesFromAPI(exerciseNames);
          setWorkoutsReadyForDisplay(detailedWorkouts); 
        } else {
          console.error('Invalid Data format:', response.data);
        }
      } catch (err) {
        console.error('Error fetching sevenDay workout data', err);
        return [];
      } finally {
        setIsLoading(false)
      }
    } 
    fetchSevenDayDataFromdb()
  }, [])

  const extractWorkoutNames = (formattedWorkouts) => {
    const exercisesNames = formattedWorkouts.map(workout => workout.name);
    return exercisesNames
  }

  const groupWorkoutsByDate = (workouts) => {
    return workouts.reduce((acc, workout) => {
      if (!acc[workout.date]) {
        acc[workout.date] = [];
      }
      acc[workout.date].push(workout);
      return acc;
    }, {});
  };

  const getTimeRangeForDate = (workouts) => {
    const times = workouts.map(workout => {
      if (!workout.timeRange) return null;
      const [startTime, endTime] = workout.timeRange.split('-');
      return { startTime, endTime };
    }).filter(time => time !== null);

    if (times.length === 0) return '';

    const earliestStart = times.reduce((earliest, current) => 
      current.startTime < earliest ? current.startTime : earliest, times[0].startTime);
    const latestEnd = times.reduce((latest, current) => 
      current.endTime > latest ? current.endTime : latest, times[0].endTime);

    return `${earliestStart}-${latestEnd}`;
  };

  const handleTabClick = (date) => {
    setActiveTab(date);
  };

  useEffect(() => {
    if (sevenDayWorkoutForecast.length > 0) {
      const fetchExercises = async () => {
        const exerciseNames = extractWorkoutNames(sevenDayWorkoutForecast);
        const details = await fetchExercisesFromAPI(exerciseNames);
        setExerciseDetails(details);
      };
      fetchExercises();
    }
  }, [sevenDayWorkoutForecast]);

  const groupedWorkouts = groupWorkoutsByDate(sevenDayWorkoutForecast);

  return (
    <div className='container' id='calendarDashboard-container'>
      <div className="card text-center">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" id='workout-nav-tabs'>
            {Object.keys(groupedWorkouts).map(date => (
              <li className="nav-item" id='workout-nav-item' key={date}>
                <a
                  className={`nav-link ${activeTab === date ? 'active' : 'non-active'}`}
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    handleTabClick(date)
                  }}
                >
                  <span className="date-text">{date}</span>
                  <br></br>
                  <span className="time-text">{getTimeRangeForDate(groupedWorkouts[date])}</span>
                  
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body calendar-dashboard-card-body">
          {activeTab && groupedWorkouts[activeTab] ? (
            <div className='calendar-dashboard-card-container'>
              <div className="card-grid-container row">
                {groupedWorkouts[activeTab].map((workout, index) => {
                  const workoutDetail = workoutsReadyForDisplay.find(detail => detail.name.toLowerCase() === workout.name.toLowerCase());
                  return (
                    <div key={index} className='col-sm-6 col-md-4 col-lg-3 workout-card'>
                      {workoutDetail ? (
                        <CalendarDashboardCard workout={workoutDetail} />
                      ) : (
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">No workouts scheduled</h5>
                            <button className='calendar-dashboard-btn' onClick={() => navigate('/calendar')}>Go to Calendar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">No workouts scheduled</h5>
                <button className="calendar-dashboard-btn" onClick={() => navigate('/calendar')}>Go to Calendar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarDashboard;