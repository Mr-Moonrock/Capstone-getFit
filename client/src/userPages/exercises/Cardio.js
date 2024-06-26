import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ExpandableCard from './ExpandableCard';
import './styles/Cardio.css';

function Cardio () {
  const targets = [ 'cardiovascular system' ]
  const [currentIndexByTarget, setCurrentIndexByTarget] = useState({});
  const [fetchedExercisesByTarget, setFetchedExercisesByTarget] = useState({});
  const [activeTab, setActiveTab] = useState('cardiovascular system');
  const [error, setError] = useState(null);
    
  const fetchDataForTarget = useCallback((target) => {
    const encodedTarget = encodeURIComponent(target);
    axios.get(`https://exercisedb.p.rapidapi.com/exercises/target/${encodedTarget}`, {
      params: { limit: '100' },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    })
    .then(response => {
      const data = response.data
      
      const filteredData = data.filter((exercise, index, self) =>
        index === self.findIndex((t) => (
          t.id === exercise.id
        ))
      );

      const newExercises = filteredData.filter(exercise => {
        return !fetchedExercisesByTarget[target] || !fetchedExercisesByTarget[target].some(e => e.id === exercise.id);
      });

      setFetchedExercisesByTarget(prevState => ({
        ...prevState,
        [target]: filteredData 
      }));
  
      setCurrentIndexByTarget(prevState => ({
        ...prevState,
        [target]: { 
          data: prevState[target] 
            ? [...prevState[target].data, ...newExercises] 
            : newExercises, 
          currentIndex: 0 
        }
      }));
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    });
  },[fetchedExercisesByTarget]); 

  useEffect(() => {
    fetchDataForTarget(activeTab);
  }, [activeTab, fetchDataForTarget]); 

  const handleTabClick = (target) => {
    setActiveTab(target);
    fetchDataForTarget(target);
  }

  const handlePrev = (target) => {
    setCurrentIndexByTarget(prevState => ({
      ...prevState,
      [target]: {
        ...prevState[target],
        currentIndex: Math.max(0, prevState[target].currentIndex - 20)
      }
    }));
  }

  const handleNext = (target) => {
    if (currentIndexByTarget[target] && currentIndexByTarget[target].data) {
      const { data, currentIndex } = currentIndexByTarget[target];
      const nextPageStartIndex = currentIndex + 20;
      if (nextPageStartIndex < data.length) { 
        setCurrentIndexByTarget(prevState => ({
          ...prevState,
          [target]: {
            ...prevState[target],
            currentIndex: nextPageStartIndex
          }
        }));
      } else {
        setError('No more exercises to show.');
      }
    }
  };

  const activeStyle = {
    color: 'black',
  }

  const nonActiveStyle = {
    color: 'white',
    border: '1px solid white',
  };

  return (
  <div className='container' id='cardio-container'>
    <div className="card text-center">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" id='cardio-nav-tabs'>
          {targets.map(target => (
          <li className="nav-item" id='back-nav-item' key={target}>
            <a  className={`nav-link ${activeTab === target ? 'active' : 'non-active'}`} 
                href="javascript:undefined"
                onClick={() => handleTabClick(target)}
                style={activeTab === target ? activeStyle : nonActiveStyle}
                data-testid={`tab-${target}`}
            > 
            {target}  
            </a>
          </li>
          ))}
        </ul>
      </div>
      <div className="card-body">
        {error ? (
          <div className="alert alert-danger"
               data-testid="cardio-error-message">
            {error}
          </div>
        ) : (
          activeTab && fetchedExercisesByTarget[activeTab] && (
            <div className='cardio-card-container'>
              <div className="card-grid-container row">
                {fetchedExercisesByTarget[activeTab].slice(currentIndexByTarget[activeTab]?.currentIndex, currentIndexByTarget[activeTab]?.currentIndex + 20).map((exercise, index) => (
                  <div key={index} className='cardio-card col-6'>
                    <ExpandableCard key={exercise.id} exercise={exercise} />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      <div className="card-footer">
        <button className='cardio-prev' 
                data-testid='cardio-previous-btn'
                onClick={() => handlePrev(activeTab)}
                disabled={currentIndexByTarget[activeTab]?.currentIndex === 0}
        > 
          Prev 
        </button>
        <button className='cardio-next' 
                data-testid='cardio-next-btn'
                onClick={() => handleNext(activeTab)}
        > 
          Next 
        </button>
      </div>   
    </div>
  </div>
  );
};

export default Cardio;