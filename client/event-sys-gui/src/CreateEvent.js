import React from 'react';
import './Home.css'

let EventForm = ({onSubmit}) => {
  return <div className='event_form'>
    <h1>Create an Event</h1>
    <form onSubmit={onSubmit}>
      <div>
        <label>Event Name:</label>
        <input type="text" name="event_name" />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" name="location" />
      </div>
      <div>
        <label>Date:</label>
        <input type="text" name="date" />
      </div>
      <div>
        <label>Time:</label>
        <input type="text" name="time" />
      </div>
      <div>
        <label>Price:</label>
        <input type="text" name="price" />
      </div>
      <div>
        <label> Event Description:</label>
        <input type="text" name="desp" />
      </div>
      <div>
        <input type="submit" value="Create Event" />
      </div>
    </form>
  </div>
}

export default EventForm