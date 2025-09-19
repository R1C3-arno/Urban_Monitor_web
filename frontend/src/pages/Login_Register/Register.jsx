import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Register.css'

function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:1910/register', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/login')
                } else {
                    alert("Error");
                }
            })
            .then(res => console.log(res))
    }
    return (
        <div className='register_range'>
            <div className='register_form'>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input
                            type='text'
                            placeholder='Enter Name'
                            name='name'
                            onChange={e => setValues({ ...values, name: e.target.value })}
                            className='form-control rounded-0'
                        />
                    </div>

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
                    <div className="signin_signup">
                        <Link to="/login" className='register_form'>Sign in</Link>
                        <button type='submit' className='register_form' >Sign up</button>
                    </div>
                    <p>You agree to our terms and policies</p>
                </form>
            </div>
        </div>
    )
}

export default Register
