import React from 'react';
import './FloatText.css'

let merge_classes = (base, added) => `${base} ${base}-${added}`

let FloatText = ({ name, label, className = '', defaultValue = '' }) => {
  let el_class = merge_classes('float-text', className)
  let input_class = merge_classes('float-input', className)
  let label_class = merge_classes('float-label', className)
  return <div className={el_class}>
    <input className={input_class} type='text' name={name} placeHolder=' ' defaultValue={defaultValue} />
    <label className={label_class} htmlFor={name}>{label}</label>
  </div>
}

let FloatPassword = ({ name, label, className, defaultValue }) => {
  let el_class = merge_classes('float-text', className)
  let input_class = merge_classes('float-input', className)
  let label_class = merge_classes('float-label', className)
  return <div>
    <input className={input_class} type='password' name={name} placeHolder=' ' defaultValue={defaultValue} />
    <label className={label_class} htmlFor={name}>{label}</label>
  </div>
}

export default FloatText

export {
  FloatText,
  FloatPassword
}