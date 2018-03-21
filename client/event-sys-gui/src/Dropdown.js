import React from 'react';
import './Dropdown.css'

let Dropdown = ({ value, onChange, children }) => {
  return <div className='dropdown'>
    <select className='dropdown-input' value={value} onChange={onChange}>
      {children}
    </select>
  </div>
}

export default Dropdown