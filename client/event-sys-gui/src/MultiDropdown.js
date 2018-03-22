import React from 'react'
import Dropdown from './Dropdown'
import './MultiDropdown.css'

const DEFAULT_ADD_TEXT = 'Add New Item'

let MultiDropdown = ({ unique, children, value = [ 0 ], InputEl = Dropdown, onChange, prompt = '', addText = DEFAULT_ADD_TEXT }) => {
  let available_children = [ ...children ]

  let add = null;
  let remove = null;

  if(value.length < children.length) {
    let _add = () => {
      let last_value = { };

      onChange([ ...value, last_value ]);
    }
    add = <button className="form-button" onClick={_add}>
      {addText}
    </button>
  }

  let inputs = value.map((v, i) => {
    let _onChange = (val) => {
      let before = value.slice(0, i);

      let after = value.slice(i + 1);

      onChange([ ...before, val, ...after ]);
    }

    let _remove = () => {
      let before = value.slice(0, i);

      let after = value.slice(i + 1);

      console.log(i, value, before, after)

      onChange([ ...before, ...after ]);
    }

    console.log(value);

    if(value.length > 1) {
      remove = <div onClick={_remove} className='remove-item remove-item-dropdown'>
        X
      </div>
    }

    let el_children = [ ...available_children ];
    available_children = available_children.filter((item, index) => {
      return item.props.value != v;
    })

    return <div key={i} className='multidropdown-input-el'>
      <InputEl value={v} key={i} onChange={_onChange}>
        <option value='-1'>{prompt}</option>
        {el_children}
      </InputEl>
      {remove}
    </div>
  });

  return <div className='multi-dropdown'>
    {inputs}
    {add}
  </div>
}

export default MultiDropdown
