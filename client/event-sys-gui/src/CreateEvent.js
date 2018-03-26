import React from 'react';
import './CreateEvent.css'
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger } from './Util'
import { FloatText } from './FloatText'
import { NoFloatNumber } from './NoFloat'
import Dropdown from './Dropdown'
import MultiDropdown from './MultiDropdown'
import { connect } from 'react-redux'

let mapStateToProps = (state) => {
  if(state.event_data === null) {
    return {};
  }
  return {
    ...state.event_data,
    editing: true
  }
}

let TicketSelect = ({ children, value, onChange, removable }) => {
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


  let disabled = removable ? '' : 'disabled';

  let input_props = {
    onChange: count_changed,
    value: value.count,
    disabled
  }

  console.log(input_props, removable, disabled)

  return <div>
    <Dropdown className='ticket-select' value={value.ticket} onChange={ticket_changed} disabled={disabled}>
      {children}
    </Dropdown>
    <NoFloatNumber className='ticket-select-input' value={value.count} label='Ticket Count' inputProps={input_props} />
  </div>
}

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      selectedVenue:'',
      menus: [],
      venues: [],
      startDateTime: 0,
      endDateTime: 0,
      tickets: [],
      selectedTickets: [],
      ticketAmounts: [],
    };
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleVenueChange = this.handleVenueChange.bind(this);
    this.handleTicketsChange = this.handleTicketsChange.bind(this);
    this.startChange = this.startChange.bind(this);
    this.endChange = this.endChange.bind(this);
    this.setMenus();
    this.setTickets();
  }

  async updateEvent(e) {
    let form = e.target;
    let event_id = this.props.id
    let tickets = this.state.selectedTickets.filter((t) => {
      let ticket = this.props.tickets.find(ticket => t.ticket == ticket.id)
      if(ticket) {
        return false;
      }
      return true;
    });
    let description = form.description.value
    let location = form.location.value;
    let start_time = this.state.start_time || this.props.start_time
    let end_time = this.state.end_time || this.props.end_time
    let body = JSON.stringify({ event_id, tickets, description, location, start_time, end_time });
    let resp = await fetch('/admin/update_event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })


    console.log('update', resp);
    form.reset();

    this.setState({
      start_time: new Date(),
      end_time: new Date(),
      selectedMenu: 0,
      selectedTickets: []
    })
  }

  async createEvent(e) {
    e.preventDefault();
    if(this.props.editing) {
      return this.updateEvent(e);
    }
    let form = e.target;
    console.dir(form);
    console.log(form.start);
    console.log(form.end);
    let selectedTickets = this.state.selectedTickets;
    let tickets = [];

    if(form.event_name.value === '') {
      // alert('please give the event a name')
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
      menu_id: this.state.selectedMenu,
      location: form.location.value,
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

    this.setState({
      start_time: new Date(),
      end_time: new Date(),
      selectedMenu: 0,
      selectedTickets: []
    })
  }

  handleMenuChange(value) {
    console.log(value);
    this.setState({ selectedMenu: value })
  }

  handleVenueChange(value) {
    this.setState({ selectedVenue: value })
  }

  handleTicketsChange(value) {
    this.setState({ selectedTickets: value })
    //console.log('selectedTickets', this.state.selectedTickets);
  }


  async setMenus() {
    let response = await fetch('/admin/menus')
    response = await response.json();
    this.setState({menus: response});
    Logger.log("Loaded Menus", response)
  }

  async setTickets() {
    console.log('setting tickets')
    let response = await fetch('/admin/tickets')
    response = await response.json();
    this.setState({tickets: response});
    Logger.log("Loaded Tickets", response)
  }e

  buildMenuList(){
    let menus = this.state.menus;
    let menuList = [<option key="0" value="0">-select menu-</option>]

     if(menus.length !== 0) {
      for (var i = 0; i < menus.length; i++) {
        let name = menus[i].name;
        let id = menus[i].id;
        menuList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return menuList;
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
    let { name, description, location, start_time, end_time, menu_id, tickets = null } = this.props;
    let removable = [];

    if(start_time && end_time) {
      start_time = new Date(start_time)
      end_time = new Date(end_time)
    } else {
      start_time = this.state.start_time || null;
      end_time = this.state.end_time || null;
    }

    if(tickets !== null && tickets.length > 0) {
      tickets = tickets.map(t => ({ ticket: t.ticket_id, count: t.amount }))


      removable = new Array(tickets.length)
      removable.fill(false);
    }

    if(this.state.selectedMenu) {
      menu_id = this.state.selectedMenu
    }

    if(tickets === null || tickets.length < this.state.selectedTickets.length) {
      tickets = this.state.selectedTickets;
    }

    console.log('removable', removable)

    let menuOptions = this.buildMenuList();
    let ticketOptions = this.buildTicketsList();

    let name_props = {};

    if(this.props.editing) {
      name_props.disabled = 'disabled'
    }
    // let ticketAmounts = this.buildTicketAmounts();
    return <div className='event_form'>
      <form onSubmit={this.createEvent} autoComplete="off">
        <FloatText name="event_name" label="Event Name:" defaultValue={name} inputProps={name_props} />
        <FloatText name="description" label="Event Description:" defaultValue={description} />
        <FloatText name="location" label="Event Location:" defaultValue={location} />
        <div className='event_form-input'>
          <DateTime locale='en-ie' name="start" label="Start Date/Time: " onChange={this.startChange} closeOnSelect={true} value={start_time}/>
          <DateTime locale='en-ie' name="end" label="End Date/Time: " onChange={this.endChange} closeOnSelect={true} value={end_time} />
        </div>
        <div className='padding-vert'>
          <Dropdown value={menu_id} onChange={this.handleMenuChange}>
            {menuOptions}
          </Dropdown>
        </div>
        <MultiDropdown removable={removable} value={tickets} onChange={this.handleTicketsChange} prompt='-Select Ticket-' InputEl={TicketSelect} addText='Add A Ticket'>
          {ticketOptions}
        </MultiDropdown>
        <div className='event_form-input'>
          <input type='submit' className='form-button' submit="create_event" value='Create Event' />
        </div>
      </form>
    </div>
  }
}

export default connect(mapStateToProps)(CreateEvent)
