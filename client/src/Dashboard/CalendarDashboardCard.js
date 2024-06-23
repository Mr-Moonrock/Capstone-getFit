import React from 'react';
import './styles/CalendarDashboardCard.css';

function CalendarDashboardCard ({ workout }) {

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col-sm-6 mb-3 mb-sm-0">
        <div className="card" id="dashboard-calendar-card-card">
          <div className="card-body">
            <h5 className="card-title text-center" id='calendar-dashboard-card-title'>
              {workout.name}
            </h5>
            <h6 className="card-subtitle mb-2 text-body-secondary text-center"
                id="calendar-dashboard-card-subtitle"
            >
              <b>Equipment:</b> {workout.equipment || 'N/A'}
            </h6>
            {workout.gifUrl ? (
              <div className="calendar-dashboard-gif-container">
                <img className="calendar-dashboard-gif"
                    src={workout.gifUrl}
                    alt="Exercise GIF"
                />
              </div>
              ) : (
              <div className="calendar-dashboard-gif-container">
                <p>No GIF available</p>
              </div>
              )}
              <div>
            </div>
          </div>
        </div>
      </div>
   </div>
  )
}

export default CalendarDashboardCard;

