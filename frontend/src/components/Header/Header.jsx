import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='header'>
      <img src={assets.header_background} alt="" />
      <div className='header-contents'>
        <h2>Explore your bussiness!</h2>
        <p>Optimize your income and outcome</p>
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header
