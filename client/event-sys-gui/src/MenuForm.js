import React from 'react';
import './Home.css'
import Nav from './Nav'

let MenuForm = ({ onSubmit }) => {
  return <div className="event-form">
    <h1>Create a Menu</h1>
    <h2>Starters</h2>
    <form onSubmit={onSubmit}>
      <div>
        <label>Starter One:</label>
        <input type="text" name="starter1" />
      </div>
      <div>
        <label>Starter Two:</label>
        <input type="text" name="starter2" />
      </div>
      <div>
        <label>Starter Three:</label>
        <input type="text" name="starter3" />
      </div>
      <div>
	<h3>Main Course</h3>
        <label>Main One:</label>
        <input type="text" name="Main1" />
      </div>
      <div>
        <label>Main Two:</label>
        <input type="text" name="Main2" />
      </div>
      <div>
        <label>Main Three:</label>
        <input type="text" name="Main3" />
      </div>
      <div>
	<h4>Dessert</h4>
        <label>Sweet One:</label>
        <input type="text" name="dessert1" />
      </div>
      <div>
        <label>Sweet Two:</label>
        <input type="text" name="dessert2" />
      </div>
      <div>
        <label>Sweet Three:</label>
        <input type="text" name="dessert3" />
      </div>
      <div>
        <input type="submit" value="Create Event" />
      </div>
    </form>
  </div>
}

export default MenuForm