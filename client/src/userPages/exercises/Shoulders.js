import React, { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard';
import axios from 'axios';
import './styles/Shoulders.css';

function Shoulders() {
  const targets = [ 'delts']
  const [currentIndexByTarget, setCurrentIndexByTarget] = useState({});
  const [fetchedExercisesByTarget, setFetchedExercisesByTarget] = useState({});
  const [lastPageNotification, setLastPageNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('delts');
  const [error, setError] = useState(null);
    
  const fetchDataForTarget = (target) => {
    axios.get(`https://exercisedb.p.rapidapi.com/exercises/target/${target}`, {
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
          currentIndex: 0 }
      }));
      setError(null);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    });
  };

  useEffect(() => {
    fetchDataForTarget(activeTab);
  }, [activeTab]);

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
        console.log('No more exercises to fetch');
        setLastPageNotification(true);
      }
    }
  };

  return (
    <div className='container' id='shoulders-container'>
      <div className="card text-center">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" id='shoulders-nav-tabs'>
            {targets.map(target => (
            <li className="nav-item" id='shoulders-nav-item' key={target}>
              <a  className={`nav-link ${activeTab === target ? 'active' : 'non-active'}`} 
                  href="#" 
                  onClick={() => handleTabClick(target)}
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
          <div className="alert alert-danger" data-testid="shoulders-error-message">
            {error}
          </div>
        ) : (
          activeTab && fetchedExercisesByTarget[activeTab] && (
            <div className='shoulders-card-container'>
              <div className="card-grid-container row">
                {fetchedExercisesByTarget[activeTab].slice(currentIndexByTarget[activeTab]?.currentIndex, currentIndexByTarget[activeTab]?.currentIndex + 20).map((exercise, index) => (
                <div key={index} className='shoulders-card col-6'>
                  <ExpandableCard key={exercise.id} exercise={exercise} />
                </div>
              ))}
            </div>
          </div>
            )
          )}
        </div>
        <div className="card-footer">
          <button className='shoulders-prev' 
                  data-testid='shoulders-previous-btn'
                  onClick={() => handlePrev(activeTab)}
                  disabled={currentIndexByTarget[activeTab]?.currentIndex === 0}
          > Prev 
          </button>
          <button className='shoulders-next' 
                  data-testid='shoulders-next-btn'
                  onClick={() => handleNext(activeTab)}
          > Next 
          </button>
        </div>   
      </div>
    </div>
    );
};

export default Shoulders;