import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Function from './pages/Function/Function'
import PlaceData from './pages/PlaceData/PlaceData'
import Login from './pages/Login_Register/Login'
import Register from './pages/Login_Register/Register'
import './App.css'

const App = () => { 

  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        < Route path='/' element={<Home />} />
        < Route path='/function' element={<div className="route-container"><Function /> </div>} />
        < Route path='/place_data' element={<div className="route-container"><PlaceData /> </div>} />
        < Route path='/Login' element={<div className="route-container"> <Login /> </div>} />
          < Route path='/Register' element={<div className="route-container"> <Register /> </div>} />
      </Routes>
    </div>
  )
}

export default App
