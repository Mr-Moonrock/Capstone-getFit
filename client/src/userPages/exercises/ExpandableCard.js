import React, { useState } from 'react';
import './styles/ExpandableCard.css';

function ExpandableCard({ exercise }) {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  if (!exercise) {
    return null;
  }
  
  const instructions = Array.isArray(exercise.instructions)
    ? exercise.instructions
    : typeof exercise.instructions === 'string'
    ? JSON.parse(exercise.instructions) 
    : []; 

  const secondaryMuscles = Array.isArray(exercise.secondaryMuscles)
    ? exercise.secondaryMuscles
    : typeof exercise.secondaryMuscles === 'string'
    ? JSON.parse(exercise.secondaryMuscles) 
    : []; 

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col-sm-6 mb-3 mb-sm-0">
        <div className="card" id="expandable-card-card">
          <div className="card-body">
            {!showInstructions && (
              <>
                <h5 className="card-title text-center" id="expandable-card-title" data-testid='expandable-card-exercise-name'>
                  {exercise.name}
                </h5>
                <h6 className="card-subtitle mb-2 text-body-secondary text-center" data-testid='expandable-card-equipment' id="expandable-card-subtitle">
                  <b>Equipment:</b> {exercise.equipment}
                </h6>
                {secondaryMuscles.length > 0 && (
                  <h6 className="card-subtitle mb-2 text-body-secondary" data-testid='expandable-secondary-muscles'>
                    <b>Secondary Muscles:</b> {secondaryMuscles.join(', ')}
                  </h6>
                )}
                <div className="gif-container">
                  <img
                    className={`gif ${showInstructions ? 'hidden' : ''}`}
                    src={exercise.gifUrl}
                    alt='Exercise GIF'
                    data-testid='expandable-exercise-gif'
                  />
                </div>
                <div className="expandable-card-btn-container">
                  <button
                    className={`expandable-card-instructions-btn`}
                    onClick={toggleInstructions}
                    data-testid='expandable-instructions-btn'
                  >
                    View Instructions
                  </button>
                </div>
              </>
            )}
            {showInstructions && (
              <div className="instructions-overlay">
                <div className='scrollable-textbox'>
                  <ul>
                    {instructions.map((instruction, index) => (
                      <li key={index} className="expandable-card-card-text" data-testid='expandable-card-instructions-display'>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="expandable-card-back-btn-container">
                  <button
                    className="back-button"
                    onClick={toggleInstructions}
                    data-testid='expandable-back-btn'
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpandableCard;