import React, { useState, useContext, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import './styles/Login.css';
import logoImage from '../images/logoImage.jpg';

function Login () {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [userLoginData, setUserLoginData]= useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  
  const { username, password } = userLoginData;

  const loginData = {
    username: userLoginData.username,
    password: userLoginData.password
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true); 
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/auth/login', loginData);
      
      const { jwtToken } = res.data;
      localStorage.setItem('token', jwtToken)
      const userRes = await axios.post('http://localhost:5000/auth/user', {}, {
        headers: {
          Authorization: `Bearer ${res.data.jwtToken}`
        }
      });
      const userData = userRes.data;
      setCurrentUser({
        username: userData.user_username,
        id: userData.user_id
      });

      navigate('/dashboard')
    } catch (error) {
      console.error('Error logginig in:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  function handleChange(evt) {
    const { name, value } = evt.target;
    setUserLoginData(prevState => ({ ...prevState, [name]: value }))
  }

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }
  
  return (
  <div className='background-element'> 
    <div className='LoginForm' >         
      <div className='card-body' id='login-card-body'>
        <div className='card' id='login-card'>  
          <div className='login-logo-and-title'>
            <img  src={logoImage} 
                  alt='logoImage' 
                  className='login-logoImage' 
            />
            <div className='login-divider'></div>
            <h2 className='login-title'> Get Fit</h2>
          </div>
          <h2 className='text-center mb-3' id='login-header'> Login </h2>
          {error && <p className="error-message">{error}</p>} 
          <form onSubmit={handleSubmit}>
            <div className='form-group' id='login-form-group'>
              <input 
                name='username'
                placeholder='username'
                className='form-control'
                id='login-input-form-control'
                value={username}
                onChange={handleChange}
                autoComplete='username'
                required 
              />
            </div>
            <div className='form-group' id='login-form-group'>
              <input 
                type='password'
                name='password'
                placeholder='password'
                className='form-control'
                id='login-input-form-control'
                value={password}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type='submit'
              className='btn btn-primary mx-auto d-block'
              id='login-btn'
              disabled={loading}
              onSubmit={handleSubmit}
              >
              
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <p className='register-paragraph'> Don't have an account?
              <Link to='/register' className='register-link'> Register </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login;