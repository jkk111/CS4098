import React from 'react';
import './Dropdown.css'

let merge_classes = (base, added = '') => `${base} ${added}-${base}`

let Dropdown = ({ value, onChange, children, className, disabled = '' }) => {
  let el_class = merge_classes('dropdown', className)
  let input_class = merge_classes('dropdown-input', className)
  return <div className={el_class}>
    <select disabled={disabled} className={input_class} value={value} onChange={(e) => onChange(e.target.value)} placeholder='testing'>
      {children}
    </select>
  </div>
}

export default Dropdown