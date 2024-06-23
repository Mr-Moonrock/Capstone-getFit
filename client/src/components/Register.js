import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Alert from "../common/Alert";
import axios from 'axios';
// import GetFit from '../api/GetFit';
import logoImage from '../images/logoImage.jpg';
import './styles/Register.css';

function Register() {

  const navigate = useNavigate();
  const [userRegisterData, setUserRegisterData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  
  const { username, password, firstName, lastName, email } = userRegisterData;

  async function handleSubmit(evt) {
    evt.preventDefault();
    try{
      const res= await axios.post('http://localhost:5000/auth/register', userRegisterData);
      localStorage.setItem('token', res.data.jwtToken);
      navigate('/login')
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setUserRegisterData((prevData)=> ({ ...prevData, [name]: value }));
  }

  return (
    <div className='register-background-element'> 
      <div className="RegisterForm">
        <div className="card-body" id='register-card-body'>
          <div className="card" id='register-card'>
            <div className='register-logo-and-title'>
              <img  src={logoImage}
                    alt='logoImage' 
                    className='register-logoImage'
              />
              <div className='register-divider'></div>
              <h2 className='register-title'> Get Fit </h2>
            </div>  
            <h2 className='text-center mb-3' id='register-header'> Register </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group" id='register-form-group'>
                <input
                  name="username"
                  placeholder='username'
                  className="form-control"
                  id='register-input-form-control'
                  value={username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" id='register-form-group'>
                <input
                  type="password"
                  name="password"
                  placeholder='password'
                  className="form-control"
                  id='register-input-form-control'
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" id='register-form-group'>
                <input
                  name="firstName"
                  placeholder='first name'
                  className="form-control"
                  id='register-input-form-control'
                  value={firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" id='register-form-group'>
                <input
                  name="lastName"
                  placeholder='last name'
                  className="form-control"
                  id='register-input-form-control'
                  value={lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" id='register-form-group'>
                <input
                  type="email"
                  name="email"
                  placeholder='e-mail'
                  className="form-control"
                  id='register-input-form-control'
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary mx-auto d-block"
                id='register-btn'
                onSubmit={handleSubmit}>
                Register
              </button>
              <p className='register-paragraph'> Already a member?
                <Link to='/login' className='login-link'> Login </Link>
              </p>
            </form>  
          </div>
        </div>
      </div>
    </div>
    );
  }
export default Register;