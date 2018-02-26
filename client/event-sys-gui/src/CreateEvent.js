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
      selectedVenue:'',
      venues:'',
      startDateTime:'',
      endDateTime:'',
      tickets:'',
      selectedTickets: [],
      ticketAmounts: [],
    };
    this.createEvent = this.createEvent.bind(this);
    this.handleVenueChange = this.handleVenueChange.bind(this);
    this.handleTicketsChange = this.handleTicketsChange.bind(this);
    this.setVenues();
    this.setTickets();
  }

  async createEvent(e){
    e.preventDefault();
    let form = e.target;
    let selectedTickets = this.state.selectedTickets;
    let tickets = [];
    let start = form.start.value;
    let end = form.end.value;

    for (var i=0; i<selectedTickets.length; i++){
      let id = selectedTickets[i].id;
      let count = form["ticketAmount" + id].value;
      tickets.push({ id: id, count: count})
    }

    let body = {
      name: form.event_name.value,
      description: form.description.value,
      venue_id: this.state.selectedVenue,
      max_attendees: form.capacity.value,
      start_time: start,
      end_time: end,
      tickets: tickets
    }

    Logger.log('creating event', body);
    let resp = await fetch('/admin/create_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    Logger.log("Create Event Response", await resp.json())
    form.reset();
  }

  handleVenueChange(event){
    this.setState({selectedVenue: event.target.value})
  }

  handleTicketsChange(event){
    let ticket = this.state.tickets[event.target.value-1];
    let selectedTickets = this.state.selectedTickets;
    if (selectedTickets.includes(ticket)){
      let i = selectedTickets.indexOf(ticket);
        selectedTickets.splice(i, 1);
    } else {
      selectedTickets.push(ticket);
    }
    this.setState({selectedTickets: selectedTickets})
    //console.log('selectedTickets', this.state.selectedTickets);
  }

  async setVenues() {
    //console.log('setting venues');
    let response = await fetch('/admin/venues')
    response = await response.json();
    this.setState({venues: response});
    Logger.log("Loaded Venues", response)
  }

  async setTickets(){
    console.log('setting tickets')
    let response = await fetch('/admin/tickets')
    response = await response.json();
    this.setState({tickets: response});
    Logger.log("Loaded Tickets", response)
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

  buildTicketsList(){
    let tickets = this.state.tickets;
    let ticketsList = [<option key="0" value="0">-select tickets-</option>]
    if (tickets.length !== 0){
      for (var i=0; i<tickets.length; i++){
        let name = tickets[i].name;
        let id = tickets[i].id;
        ticketsList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return ticketsList;
  }

  buildTicketAmounts(){
    let tickets = this.state.selectedTickets;
    let theList = []
    if (tickets.length !== 0){
      for (var i=0; i<tickets.length; i++){
        let name = tickets[i].name;
        let id = tickets[i].id;
        let inputName = "amount of " + name + " tickets:";
        let inputId = "ticketAmount" + id;
        theList.push(<div key={i}><FloatText name={inputId} label={inputName}/></div>)
      }
    }
    return theList;
  }

  render() {
    let venueOptions = this.buildVenueList();
    let ticketOptions = this.buildTicketsList();
    let ticketAmounts = this.buildTicketAmounts();
    return <div className='event_form'>
      <form onSubmit={this.createEvent} autoComplete="off">
        <FloatText name="event_name" label="Event Name:" />
        <FloatText name="description" label="Event Description:" />
        <FloatText name="capacity" label="Event Capacity:"/>
        <select value={this.state.venue} onChange={this.handleVenueChange} id="selectVenue">
          {venueOptions}
        </select>
        <select value={this.state.tickets} onChange={this.handleTicketsChange} id="selectTickets">
          {ticketOptions}
        </select>
        {ticketAmounts}
        <div className='event_form-input'>
          <DateTime locale='en-ie' name="start" label="Start Date/Time: "/>
          <DateTime locale='en-ie' name="end" label="End Date/Time: "/>
        </div>
        <div className='event_form-input'>
          <input type='submit' className='form-button' submit="create_event" value='Create Event'/>
        </div>
      </form>
    </div>
  }
}

export default CreateEvent
