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
    };

    this.createEvent = this.createEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setVenues();
  }

  async createEvent(e){
    e.preventDefault();
    let form = e.target;

    let body = {
      event_name: form.event_name.value,
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

  handleChange(event){
    this.setState({selectedVenue: event.target.value})
  }

  async setVenues() {
    console.log('setting venues');
    let response = await fetch('/admin/venues')
    response = await response.json();

    /**************************/

    /**************************/

    this.setState({venues: response});
    Logger.log("Loaded Venues", response)
  }

  buildVenueList(){
    //let venues = this.state.venues;
    let venues = [
      {"name": "sample one", "id": "1"},
      {"name": "sample 2", "id": "2"},
      {"name": "sample C", "id": "3"}
    ]
    let venueList = [<option key="0" value="0">-please select-</option>]
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
        select a venue
          <select value={this.state.value} onChange={this.handleChange} id="selectVenue">
            {venueOptions}
          </select>
        </label>
        <div className='event_form-input'>
          <DateTime locale='en-ie' label="Start Date: "/>
        </div>
        <div className='event_form-input'>
          <input type='submit' className='form-button' submit="create_event" value='Create Event'/>
        </div>
      </form>
    </div>
  }
}

export default CreateEvent
