import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './styles/Navbar.css';
import { UserContext } from '../UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Navbar() {
  const { currentUser, setCurrentUser }= useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      const token = localStorage.getItem('token')
      setCurrentUser(null);
      localStorage.removeItem('token');

      if (!token) {
        navigate('/login'); 
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('Error logging out', err)
    }
  }
  
  const scrollToCarousel = () => {
    const exerciseCarouselSection = document.getElementById   ('exercise-carousel-section');
    exerciseCarouselSection.scrollIntoView({ behavior: 'smooth' });
    const cardioCarouselSection = document.getElementById('cardio-carousel-section');
    cardioCarouselSection.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav className='navbar bg-dark border-bottom border-body' data-bs-theme='dark'>
      <nav className='navbar navbar-expand-lg bg-body-tertiary'>
        <div className='container-fluid'>
          <Link className='navbar-brand' href='/'> <b> Get Fit </b> </Link>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              {!currentUser ? (
                <>
                  <li className='nav-item'>
                    <Link className='nav-link' 
                          data-testid='register-link'
                          to='register'> 
                      Register 
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link className='nav-link' 
                          data-testid='login-link' 
                          to='/login'> 
                      Login 
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className='nav-item'>
                    <Link className='nav-link' 
                          data-testid='dashboard-link' 
                          to='/dashboard'> 
                      Dashboard 
                    </Link>
                  </li>
                  {location.pathname === '/dashboard' && (
                    <>
                      <li className='nav-item'>
                        <Link className='nav-link' 
                              data-testid='bmi-link' 
                              to='/bmi'> 
                          BMI 
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link className='nav-link' 
                              data-testid='calendar-link' 
                              to='/calendar'> 
                          Calendar 
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link className='nav-link' 
                              data-testid='lifestyle-changes-link'
                              to='/lifestyleChanges'> 
                          Lifestyle Changes 
                        </Link>
                      </li>
                      <li className="nav-item dropdown">
                        <a  className="nav-link dropdown-toggle" 
                            href="#" 
                            id="navbarDropdownMenuLink" 
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false">
                          Exercises
                        </a>

                        <ul className="dropdown-menu">
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='cardio-link' 
                                  to="/cardio"> 
                              Cardio 
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='arms-link' 
                                  to="/arms"> 
                              Arms 
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='back-link' 
                                  to="/back"> 
                              Back 
                            </Link>
                            </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='legs-link'
                                  to="/legs"> 
                              Legs 
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='neck-link'
                                  to="/neck"> 
                              Neck 
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='abs-link'
                                  to="/abs"> 
                              Abs 
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='shoulders-link'
                                  to="/shoulders"> 
                              Shoulders 
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" 
                                  data-testid='chest-link'
                                  to="/chest"> 
                              Chest 
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}
                </>
              )}

              {location.pathname === '/dashboard' && (
                <li className='nav-item'>
                  <Link className='nav-link' to='#' onClick={scrollToCarousel}> Cardio Info </Link>
                </li>
                
              )}
                
            </ul>

            {currentUser ? (
              <div className='d-flex align-items-center'> 
                <span className='navbar-text me-3'> Hello, {currentUser.username} </span>
                <button className='btn btn-outline-light' 
                        data-testid = 'logout-btn'
                        onClick={handleLogout} > Logout 
                </button>
              </div>
            ) : null}
          </div>    
        </div>
      </nav>
    </nav> 
  );
}

export default Navbar;