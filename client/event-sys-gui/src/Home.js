import React from 'react';
import './Home.css'
import Nav from './Nav'

let Home = ({ is_admin }) => {
  return <div className='home'>
    <Nav />
  </div>
}

export default Home