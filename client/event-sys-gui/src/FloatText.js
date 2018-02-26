import React from 'react';
import './FloatText.css'

let merge_classes = (base, added) => `${base} ${added}-${base}`

let FloatText = ({ name, label, className = '', defaultValue = '', inputProps = {}, children }) => {
  let el_class = merge_classes('float-text', className)
  let input_class = merge_classes('float-input', className)
  let label_class = merge_classes('float-label', className)
  inputProps.type = inputProps.type || 'text';
  return <div className={el_class}>
    <input className={input_class} name={name} placeholder=' ' defaultValue={defaultValue} {...inputProps} />
    <label className={label_class} htmlFor={name}>{label}</label>
    {children}
  </div>
}

let FloatNumber = (props = {}) => {
  if(props.inputProps) {
    props.inputProps.type = 'number';
    props.inputProps.min = 1;
  } else {
    props.inputProps = {
      type: 'number',
      min: 1
    }
  }
  return <FloatText {...props} />
}

let FloatPassword = ({ name, label, className, defaultValue }) => {
  let el_class = merge_classes('float-text', className)
  let input_class = merge_classes('float-input', className)
  let label_class = merge_classes('float-label', className)

  return <div className={el_class}>
    <input className={input_class} type='password' name={name} placeholder=' ' defaultValue={defaultValue} />
    <label className={label_class} htmlFor={name}>{label}</label>
  </div>
}

export default FloatText

export {
  FloatText,
  FloatNumber,
  FloatPassword
}