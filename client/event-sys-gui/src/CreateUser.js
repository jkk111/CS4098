import React from 'react';
//TODO Remove this
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger } from './Util'

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
      <div className='create-user-input'>
        <label>First Name:</label>
        <input type='text' autoComplete="off" name='f_name' />
      </div>
      <div className='create-user-input'>
        <label>Last Name:</label>
        <input type='text' autoComplete="off" name='l_name' />
      </div>
      <div className='create-user-input'>
        <label>Email:</label>
        <input type='text' autoComplete="off" name='email' />
      </div>
      <div className='create-user-input'>
        <DateTime locale='en-ie' />
      </div>
      <div className='create-user-input'>
        <input type='submit' />
      </div>
    </form>
  </div>
}

export default CreateUser