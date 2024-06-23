import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import './styles/CalendarComp.css';
import { UserContext } from '../../UserContext';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar } from '@fullcalendar/core';

function CalendarComp() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [droppedTasks, setDroppedTasks] = useState([]);
  const [tasksByTarget, setTasksByTarget] = useState({});
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);
  const [allExercises, setAllExercises] = useState([]);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  // CALL TO GET THE TARGET MUSCLES FROM API AND DROP DOWN BOX 
  useEffect(() => {
    const fetchExercises = async (selectedTarget) => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/target/${selectedTarget}`, {
          params: { limit: '200' },
          headers: {
            'X-RapidAPI-Key': '31c3abfaa6msh09cecb581336696p1907c7jsn6d70f9e3b0b8',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        })
        if (Array.isArray(response.data)) {
          const formattedExercises = response.data.map((exercise, index) => ({
            id: index + 1,
            name: exercise.name,
            duration: '10 minutes',
            color: 'rgba(211, 208, 208, 0.608)',
          }))
          makeExercisesDraggable(formattedExercises);
          setAllExercises(formattedExercises)
          updateTasksForTarget(selectedTarget, formattedExercises.slice(0, 50));
          setTotalExercises(response.data.length);
          setTotalPages(Math.ceil(response.data.length / 50));
        } else {
          console.error('Invalid Data format:', response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching exercises', error);
        setIsLoading(false);
      }
    };
    if (selectedTarget) {
      fetchExercises(selectedTarget);
    }
  }, [selectedTarget]);  

    // HANDLE EVENT DROP
  const handleEventDrop = (eventDropInfo) => {
    console.log('handleEventDrop is being called', eventDropInfo);
    const newStartTime = eventDropInfo.event.start; 
    const newEndTime = eventDropInfo.event.end;
    const droppedExercise = {
      id: eventDropInfo.event._instance.instanceId,
      name: eventDropInfo.event.title,
      startTime: newStartTime,
      endTime: newEndTime
    };
  
    console.log('Dropped exercise:', droppedExercise);
  
    const existingIndex = droppedTasks.findIndex(task => task.id === droppedExercise.id);
    if (existingIndex !== -1) {
      const updatedTasks = [...droppedTasks];
      updatedTasks[existingIndex] = droppedExercise;
      setDroppedTasks(updatedTasks); 
      console.log('Updated tasks:', updatedTasks);
    } else {
        setDroppedTasks(prevTasks => [...prevTasks, droppedExercise]);
        console.log('New tasks:', [...droppedTasks, droppedExercise]);
    }
  };

      // SAVE BUTTON 
  const saveWorkoutsToDb = async (formattedExercises) => {
    try {
      const baseUrl = 'http://localhost:5000/calendar/exercises';
      const token = localStorage.getItem('token');
      const res = await axios.post(baseUrl, formattedExercises, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      showSuccessMessage();
      return res.data;
    } catch (err) {
      console.error('Error saving workout data', err);
      throw err;
    }
  };

  const handleClickSave = async () => {
    try {
      const formattedExercises = droppedTasks.map(task => ({
        userId: currentUser.id,
        name: task.name,
        exerciseDate: task.startTime.toLocaleDateString(
          'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        exerciseDayOfWeek: task.startTime.toLocaleDateString(
          'en-US', { weekday: 'long' }),
        exerciseStartTime: task.startTime.toLocaleTimeString(
          'en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        exerciseEndTime: task.endTime.toLocaleTimeString(
          'en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }));
      await saveWorkoutsToDb(formattedExercises);
    } catch (err) {
      console.error('Error handling click save', err)
    }
  }

  const showSuccessMessage = () => {
    setSavedSuccessfully(true);
    setTimeout(() => {
      setSavedSuccessfully(false);
    }, 10000);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1); 
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); 
    }
  };

  useEffect(() => {
    if (allExercises.length > 0) {
      const startIndex = (currentPage - 1) * 50;
      const endIndex = Math.min(startIndex + 50, allExercises.length);
      updateTasksForTarget(selectedTarget, allExercises.slice(startIndex, endIndex));
    }
  }, [currentPage, allExercises]); 

  const handleSelectChange = (e) => {
    setSelectedTarget(e.target.value);
  };

  const handleSelect = (selectInfo) => {
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr
      };
      setEvents([...events, newEvent]);
    }
  };

  // DELETE BUTTON 
  const handleDeleteExercise = (exerciseId) => {
    setAllExercises((prevExercises) => 
      prevExercises.filter((exercise) => exercise.id !== exerciseId)
    );
    setDroppedTasks((prevTasks) => 
      prevTasks.filter((task) => task.id !== exerciseId)
    );
  }

  // HELPER FUNCTIONS 
  const handleEventDragStop = (eventDragInfo) => {
    if (!eventDragInfo.jsEvent.target.closest('.fc')) {
      const eventId = eventDragInfo.event.id;
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    }
  };

  const updateTasksForTarget = (selectedTarget, tasks) => {
    setTasksByTarget(prevState => ({
      ...prevState,
      [selectedTarget]: tasks,
    }))
  }

  const makeExercisesDraggable = (exercises) => {
    console.log('MakeExercisesDraggable - exercises', exercises); 
    
    setTimeout(() => {
      exercises.forEach(exercise => {
        const element = document.getElementById(`exercise-${exercise.id}`);
        if (element) {
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.className='draggable-exercise-delete-btn';
        deleteButton.onclick = () => handleDeleteExercise(exercise.id);
        element.appendChild(deleteButton);
          new Draggable(element, {
            eventData: {
              title: exercise.name,
              duration: '01:00',
              extendedProps: { id: exercise.id }
            }
          })
        }
      });
    }, 1000); 
  };

  return (
    <div className='' id='fullCalendar-full-container'>
      <div className='row'>
        <div className='col-md-5' id='dropdown-container'>
          <div  className="col-md-12" 
                id='calendarComp-dropdown-box' >
            <select className='form-select mb-3' 
                    data-testid = 'select-muscle'
                    onChange={handleSelectChange} 
                    value={selectedTarget || ''}
            >
              <option value='Select Target Muscle'> Select Target Muscle </option>
              <option value="cardiovascular system"> Cardio </option>
              <option value="abs"> Abs </option>
              <option value="triceps"> Triceps </option>
              <option value="biceps"> Biceps </option>
              <option value="upper back"> Upper Back </option>
              <option value="lats"> Lats </option>
              <option value="spine"> Spine </option>                                               
              <option value="traps"> Traps </option>
              <option value="pectorals"> Pectorals </option>
              <option value="serratus anterior"> Serratus Anterior </option>
              <option value="quads"> Quads </option>
              <option value="abductors"> Abductors </option>
              <option value="adductors"> Adductors </option>
              <option value="glutes"> Glutes </option>
              <option value="hamstrings"> Hamstrings </option>
              <option value="levator scapulae"> Levator Scapulae </option>
              <option value="delts"> Delts </option>
            </select>    
            <div className="row mt-5" id='drag-n-drop-exercise-container-wrap'>
              {savedSuccessfully && (
                <div className="alert alert-success text-center" role="alert"> 
                  Saved Successfully! 
                </div>
              )}
              <h5 className='text-center' 
                  id='fullCalendar-DragNDrop-Header'> Drag-n-Drop an Exercise:
              </h5>
              <ul className="list-group" id='calendar-draggable-list'>
                  {tasksByTarget[selectedTarget] && 
                  tasksByTarget[selectedTarget].map((exercise, index) => (
                <li key={index}
                    id={`exercise-${exercise.id}`}
                    className="list-group-item"
                > {exercise.name}
                </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className='calendar-next-prev-btn'>
            <div className='row'>
              <div className='col'> 
              
                <button className='btn btn-primary mx-auto d-block' 
                        id='calendar-prev-btn'
                        onClick={handlePrevPage}
                > Prev 
                </button>
              </div>
              <div className='col'> 
                <button className='btn btn-primary mx-auto d-block' 
                        id='calendar-next-btn'
                        onClick= {handleNextPage}
                > Next 
                </button>
              </div>
            </div>
          </div>
          <button type="button"
                  className="btn btn-primary mx-auto d-block"
                  onClick={handleClickSave}
                  id='calendar-exercise-save-btn'
          > Save Workout
          </button>
        </div>
        <div className='col-md-9'>
          <div className='row'>
            <div className ='col-md-8' id='fullCalendar-container' data-testid='fullCalendar-container'>
              <FullCalendar 
                  plugins = {[ dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin ]}
                  initialView = {'dayGridMonth'}
                  headerToolbar = {{
                                    start: 'prev,next today',
                                    center: 'title',
                                    end: 'dayGridMonth,timeGridWeek,timeGridDay',
                                  }}
                  droppable = {true}
                  editable = {true}
                  eventDrop = {handleEventDrop}
                  eventDragStop= {handleEventDragStop}            
                  selectable = {true} 
                  select = {handleSelect} 
                  events = {events.concat(tasks)} 
                  height = {1200}
                  eventBackgroundColor= 'rgba(211, 208, 208, 0.608)'
                  eventBorderColor = 'rgba(211, 208, 208, 0.608)'
                  themeSystem = 'bootstrap5'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CalendarComp;



