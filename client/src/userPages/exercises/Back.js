import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpandableCard from './ExpandableCard';
import './styles/Back.css';

function Back () {
  const targets = [ 'upper back', 'lats', 'spine', 'traps']
  const [currentIndexByTarget, setCurrentIndexByTarget] = useState({});
  const [fetchedExercisesByTarget, setFetchedExercisesByTarget] = useState({});
  const [lastPageNotification, setLastPageNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('upper back');
  const [error, setError] = useState(null);
    
  const fetchDataForTarget = (target) => {
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
        setLastPageNotification(true);
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
  <div className='container' id='back-container'>
    <div className="card text-center">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" id='back-nav-tabs'>
          {targets.map(target => (
          <li className="nav-item" id='back-nav-item' key={target}>
            <a  className={`nav-link ${activeTab === target ? 'active' : 'non-active'}`} 
                href="#" 
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
          <div className="alert alert-danger" data-testid="back-error-message">
          {error}
        </div>
        ) : (
          activeTab && fetchedExercisesByTarget[activeTab] && (
            <div className='back-card-container'>
              <div className="card-grid-container row">
                {fetchedExercisesByTarget[activeTab].slice(currentIndexByTarget[activeTab]?.currentIndex, currentIndexByTarget[activeTab]?.currentIndex + 20).map((exercise, index) => (
                <div key={index} className='back-card col-6'>
                  <ExpandableCard key={exercise.id} exercise={exercise} />
                </div>
              ))}
          </div>
        </div>
          )
        )}
      </div>
      <div className="card-footer">
        <button className='back-prev' 
                data-testid='back-previous-btn'
                onClick={() => handlePrev(activeTab)}
                disabled={currentIndexByTarget[activeTab]?.currentIndex === 0}
        > Prev 
        </button>
        <button className='back-next' 
                data-testid='back-next-btn'
                onClick={() => handleNext(activeTab)}
        > Next 
        </button>
      </div>   
    </div>
  </div>
  );
};

export default Back;