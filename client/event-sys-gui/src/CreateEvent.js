import React from 'react';
import './CreateEvent.css'
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger, isNatural } from './Util'
import { FloatText, FloatNumber } from './FloatText'
import { NoFloatNumber } from './NoFloat'
import Dropdown from './Dropdown'
import MultiDropdown from './MultiDropdown'

let TicketSelect = ({ children, value, onChange }) => {
  let ticket_changed = (e) => {
    let next = { ...value }
    next.ticket = e;
    onChange(next);
  }

  let count_changed = (e) => {
    let next = { ...value }
    next.count = e.target.value;
    onChange(next);
  }

  let input_props = {
    onChange: count_changed,
    value: value.count
  }

  return <div>
    <Dropdown className='ticket-select' value={value.ticket} onChange={ticket_changed}>
      {children}
    </Dropdown>
    <NoFloatNumber className='ticket-select-input' value={value.count} label='Ticket Count' inputProps={input_props} />
  </div>
}

class CreateEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedVenue:'',
      venues: [],
      startDateTime: 0,
      endDateTime: 0,
      tickets: [],
      selectedTickets: [],
      ticketAmounts: [],
    };
    this.createEvent = this.createEvent.bind(this);
    this.handleVenueChange = this.handleVenueChange.bind(this);
    this.handleTicketsChange = this.handleTicketsChange.bind(this);
    this.startChange = this.startChange.bind(this);
    this.endChange = this.endChange.bind(this);
    this.setVenues();
    this.setTickets();
  }

  async createEvent(e) {
    e.preventDefault();
    let form = e.target;
    let selectedTickets = this.state.selectedTickets;
    let tickets = [];

    if(form.event_name.value === '') {
      // alert('please give the event a name')
      return
    }

    if(!isNatural(form.capacity.value)) {
      // alert('capacity must be a number');
      return
    }

    if(!this.state.start_time || !this.state.end_time) {
      // alert('please select start and end times');
      return
    }

    console.log(selectedTickets)

    for (var i = 0; i < selectedTickets.length; i++) {
      let id = selectedTickets[i].ticket;
      let count = selectedTickets[i].count;
      tickets.push({ id: id, count: count})
    }

    let body = {
      name: form.event_name.value,
      description: form.description.value,
      venue_id: this.state.selectedVenue,
      max_attendees: form.capacity.value,
      timezone: form.timezone.value,
      start_time: this.state.start_time,
      end_time: this.state.end_time,
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

  handleVenueChange(value) {
    this.setState({selectedVenue: value})
  }

  handleTicketsChange(value) {
    this.setState({selectedTickets: value})
    //console.log('selectedTickets', this.state.selectedTickets);
  }

  async setVenues() {
    //console.log('setting venues');
    let response = await fetch('/admin/venues')
    response = await response.json();
    this.setState({venues: response});
    Logger.log("Loaded Venues", response)
  }

  async setTickets() {
    console.log('setting tickets')
    let response = await fetch('/admin/tickets')
    response = await response.json();
    this.setState({tickets: response});
    Logger.log("Loaded Tickets", response)
  }

  buildVenueList() {
    let venues = this.state.venues;
    let venueList = [
      <option key="0" value="0">-select venue-</option>
    ]
    if(venues.length !== 0) {
      for (var i = 0; i < venues.length; i++) {
        let name = venues[i].name;
        let id = venues[i].id;
        venueList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return venueList;
  }

  buildTicketsList() {
    let tickets = this.state.tickets;
    let ticketsList = []
    if(tickets.length !== 0) {
      for (var i = 0; i < tickets.length; i++) {
        let name = tickets[i].name;
        let id = tickets[i].id;
        ticketsList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return ticketsList;
  }

  // buildTicketAmounts() {
  //   let selected = this.state.selectedTickets;
  //   let count = []
  //   if(tickets.length !== 0) {
  //     for (var i = 0; i < tickets.length; i++) {
  //       let name = tickets[i].name;
  //       let id = tickets[i].id;
  //       let inputName = "amount of " + name + " tickets:";
  //       let inputId = "ticketAmount" + id;
  //       theList.push(<div key={i}><FloatText name={inputId} label={inputName}/></div>)
  //     }
  //   }
  //   return theList;
  // }

  startChange(e) {
    this.setState({
      start_time: e.unix() * 1000
    });
  }

  endChange(e) {
    this.setState({
      end_time: e.unix() * 1000
    });
  }

  render() {
    let venueOptions = this.buildVenueList();
    let ticketOptions = this.buildTicketsList();
    // let ticketAmounts = this.buildTicketAmounts();
    return <div className='event_form'>
      <form onSubmit={this.createEvent} autoComplete="off">
        <FloatText name="event_name" label="Event Name:" />
        <FloatText name="description" label="Event Description:" />
        <FloatNumber name="capacity" label="Event Capacity:"/>
        <Dropdown value={this.state.venue} onChange={this.handleVenueChange} id="selectVenue">
          {venueOptions}
        </Dropdown>
        <MultiDropdown value={this.state.selectedTickets} onChange={this.handleTicketsChange} prompt='-Select Ticket-' InputEl={TicketSelect} addText='Add Ticket Type'>
          {ticketOptions}
        </MultiDropdown>
        {/*{ticketAmounts}*/}
        <div className='event_form-input'>
          <DateTime locale='en-ie' name="start" label="Start Date/Time: " onChange={this.startChange} closeOnSelect={true}/>
          <DateTime locale='en-ie' name="end" label="End Date/Time: " onChange={this.endChange} closeOnSelect={true}/>
        </div>
        <input name="timezone" type='hidden' value='Europe/Dublin' />
        <div className='event_form-input'>
          <input type='submit' className='form-button' submit="create_event" value='Create Event'/>
        </div>
      </form>
    </div>
  }
}

export default CreateEvent
