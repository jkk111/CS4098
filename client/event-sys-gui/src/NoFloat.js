import React from 'react';
import './FloatText.css'

let merge_classes = (base, added) => `${base} ${added}-${base}`

let Text = ({ name, label, className = '', defaultValue = '', inputProps = {}, children }) => {
  let el_class = merge_classes('float-text', className)
  let input_class = merge_classes('float-input', className)
  inputProps.type = inputProps.type || 'text';
  return <div className={el_class}>
    <input className={input_class} name={name} placeholder={label} defaultValue={defaultValue} {...inputProps} />
    {children}
  </div>
}

let NoFloatNumber = (props = {}) => {
  let mod_props = Object.assign({}, props)


  if(mod_props.inputProps) {
    mod_props.inputProps.type = 'number';
    mod_props.inputProps.min = 1;
  } else {
    mod_props.inputProps = {
      type: 'number',
      min: 1
    }
  }
  return <Text {...mod_props} />
}

let Password = ({ name, label, className, defaultValue }) => {
  let el_class = merge_classes('float-text', className)
  let input_class = merge_classes('float-input', className)

  return <div className={el_class}>
    <input className={input_class} type='password' name={name} placeholder={label} defaultValue={defaultValue} />
  </div>
}

export default Text

export {
  Text,
  NoFloatNumber,
  Password
}