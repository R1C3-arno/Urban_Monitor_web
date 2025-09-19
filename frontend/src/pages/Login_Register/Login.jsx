import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'
function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:1910/login', values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/');
        } else {
          alert(res.data.Error);
        }
      })
      .then(res => console.log(res))
  }
  return (
    <div className='login_range'>
      <div className='login_form'>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'><strong>Email</strong></label>
            <input
              type='email'
              placeholder='Enter Email'
              name='email'
              onChange={e => setValues({ ...values, email: e.target.value })}
              className='form-control rounded-0'
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password'><strong>Password</strong></label>
            <input
              type='password'
              placeholder='Enter Password'
              name='password'
              onChange={e => setValues({ ...values, password: e.target.value })}
              className='form-control rounded-0'
            />
          </div>
          <div className="signup_signin">
            <Link to="/register" className='login_form'>
              Create Account
            </Link>
            <button type='submit' className='login_form'>
              Log in
            </button>
          </div>
          <p>You are agree to aour terms and policies</p>
        </form>
      </div>
    </div>
  )
}

export default Login
