import React from 'react';
import './CreateEvent.css'
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger } from './Util'
import FloatText from './FloatText'

class CreateEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedVenue: '',
      venues: '',
      selectedDateTime: ''
    };
    this.createEvent = this.createEvent.bind(this);
    this.handleVenueChange = this.handleVenueChange.bind(this);
    // this.handleDateTimeChange = this.handleDateTimeChange(this);
    this.setVenues();
  }

  async createEvent(e){
    e.preventDefault();
    let form = e.target;
    let body = {
      name: form.event_name.value,
      description: form.description.value,
      venue_id: this.state.selectedVenue
    }
    console.log('creating event', body);
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

  handleVenueChange(event){
    this.setState({selectedVenue: event.target.value})
  }

  // handleDateTimeChange(event){
  //   this.setState({selectedDateTime: event.target.value});
  //   console.log('reeee' + this.state.selectedDateTime);
  // }

  async setVenues() {
    console.log('setting venues');
    let response = await fetch('/admin/venues')
    response = await response.json();
    this.setState({venues: response});
    Logger.log("Loaded Venues", response)
  }

  buildVenueList(){
    let venues = this.state.venues;
    let venueList = [<option key="0" value="0">-select venue-</option>]
    if (venues.length !== 0){
      for (var i=0; i<venues.length; i++){
        let name = venues[i].name;
        let id = venues[i].id;
        venueList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return venueList;
  }

  render() {
    let venueOptions = this.buildVenueList();
    return <div className='event_form'>
      <form onSubmit={this.createEvent} autoComplete="off">
        <FloatText name="event_name" label="Event Name:" />
        <FloatText name="description" label="Event Description:" />
        <label>
          <select value={this.state.value} onChange={this.handleVenueChange} id="selectVenue">
            {venueOptions}
          </select>
        </label>
        <div className='event_form-input'>
          <DateTime value={this.state.selectedDateTime} onChange={this.handleDataTimeChange} locale='en-ie' label="Start Date: "/>
        </div>
        <div className='event_form-input'>
          <input type='submit' className='form-button' submit="create_event" value='Create Event'/>
        </div>
      </form>
    </div>
  }
}

export default CreateEvent
