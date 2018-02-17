import React from 'react';
//TODO Remove this
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger } from './Util'
import FloatText from './FloatText'

let create_user = async(e) => {
  e.preventDefault();
  let form = e.target;

  let body = {
    f_name: form.f_name.value,
    l_name: form.l_name.value,
    email: form.email.value
  }

  let resp = await fetch('/admin/create_user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  resp = await resp.json();

  Logger.log("Create User Response", resp)

  form.reset();
}

let CreateUser = () => {
  return <div className='create-user form'>
    <form onSubmit={create_user} autoComplete="off">
      <FloatText name="f_name" label="First Name:" />
      <FloatText name="l_name" label="Last Name:" />
      <FloatText name="email" label="Email:" />
      <div className='create-user-input'>
        <DateTime locale='en-ie' label="Start Date: "/>
      </div>
      <div className='create-user-input'>
        <input type='submit' className='form-button' value='Save'/>
      </div>
    </form>
  </div>
}

export default CreateUser