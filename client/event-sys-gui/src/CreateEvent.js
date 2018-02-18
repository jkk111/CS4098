import React from 'react';
import './Home.css'
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger } from './Util'
import FloatText from './FloatText'

let create_event = async(e) => {
  e.preventDefault();
  let form = e.target;

  let body = {
    event_name: form.event_name.value,
    location: form.location.value,
    price: form.price.value,
    desp: form.desp.value
  }

  let resp = await fetch('/admin/create_event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  resp = await resp.json();

  Logger.log("Create Event Response", resp)

  form.reset();
}

let EventForm = () => {
  return <div className='event_form'>
    <form onSubmit={create_event} autoComplete="off">
      <FloatText name="event_name" label="Event Name:" />
      <FloatText name="location" label="Location:" />
      <FloatText name="price" label="Price:" />
      <FloatText name="desp" label="Event Description:" />
      <div className='event_form-input'>
        <DateTime locale='en-ie' label="Start Date: "/>
      </div>
      <div className='event_form-input'>
      	<h3>Upload an Event Image</h3>
        <input type='file' className='file-button' value='Choose Image'/>
      </div>
      <div className='event_form-input'>
        <input type='submit' className='form-button' value='Create Event'/>
      </div>
    </form>
  </div>
}


export default EventForm