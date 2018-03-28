import React from 'react';
import './Event.css'
import { connect } from 'react-redux'
import ViewTickets from './ViewTickets'
import Menu from './Menu'
import Donate from './Donate'

const TABLE_SIZE = 10;
console.log(TABLE_SIZE)

let mapStateToProps = (state) => {
  return {
    is_admin: !state.admin_info.pending,
    logged_in: state.logged_in
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    show_tracker: (id) => {
      dispatch({ type: 'VIEW_CHANGED', value: 'VIEW_DONATIONS' })
      dispatch({ type: 'TRACK_EVENT', value: id })
    },

    view_transactions: (id) => {
      dispatch({ type: 'VIEW_CHANGED', value: 'VIEW_TRANSACTIONS' })
      dispatch({ type: 'TRACK_EVENT', value: id })
    },

    edit_event: (data) => {
      dispatch({ type: 'VIEW_CHANGED', value: 'CREATE_EVENT' })
      dispatch({ type: 'SET_EVENT_DATA', value: data })
    }
  }
}

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
    this.show_tracker = this.show_tracker.bind(this);
    this.view_transactions = this.view_transactions.bind(this);
    this.edit_event = this.edit_event.bind(this);
    this.export_allergens = this.export_allergens.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  show_tracker() {
    if(this.props.show_tracker) {
      this.props.show_tracker(this.props.id)
    }
  }

  view_transactions(){
    if(this.props.view_transactions){
      this.props.view_transactions(this.props.id)
    }
  }

  edit_event() {
    this.props.edit_event(this.props);
  }

  export_allergens() {
    let { attendees = [] } = this.props;

    let filtered = attendees.filter(attendee => {
      return (attendee.accessibility || '').trim() !== '' || attendee.allergens.length > 0
    })

    filtered = filtered.map((attendee, i) => {
      let table = (Math.floor(i / TABLE_SIZE)) + 1;
      let seat = (i % TABLE_SIZE) + 1;
      let { allergens = [], accessibility = '' } = attendee;
      allergens = allergens.length > 0 ? allergens.join(' ') : 'None';
      accessibility = accessibility.trim() === '' ? 'None' : accessibility.trim();
      return `Table: ${table}, Seat: ${seat}, Allergens: ${allergens}, Access/Other Dietary: ${accessibility}`
    })

    filtered = filtered.join('\r\n');

    let link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(filtered);
    link.download = 'AllergensAndAccessibilty.txt'

    link.style.display = 'none'
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
  }

  render() {
    let { expanded } = this.state;
    let { single_view, logged_in, id, name, description, tickets, menu = null, start_time, end_time, is_admin} = this.props;

    let admin_buttons = null;
    let content = null;
    let user_buttons = null;
    let menu_content = null;
    let donate_content = null;

    console.log("Start Time", start_time)

    let startObject = new Date(start_time);
    let startString = startObject.toUTCString();

    let endObject = new Date(end_time);
    let endString = endObject.toUTCString();

    if(expanded || single_view) {
      if(is_admin && !single_view) {
        admin_buttons = <div>
          <div>
            <span className='user-content-button' onClick={this.export_allergens}>Export Attendee Allergen / Access Information</span>
          </div>
          <div>
            <span className='user-content-button' onClick={this.edit_event}>Edit this Event</span>
          </div>
          <div>
            <span className='user-content-button' onClick={this.show_tracker}>View Live Tracker</span>
          </div>
          <div>
            <span className="user-content-button" onClick={this.view_transactions}>View Transactions</span>
          </div>
        </div>

      }

      content = <div>
        <div className='event-content'>
          <span className='event-content-key'>Name:</span>
          <span className='event-content-value'>{name}</span>
          <span className='event-content-key'>Description:</span>
          <span className='event-content-value'>{description}</span>
          <span className='event-content-key'>Starts:</span>
          <span className='event-content-value'>{startString}</span>
          <span className='event-content-key'>Ends:</span>
          <span className='event-content-value'>{endString}</span>
        </div>
        <ViewTickets event_id={id} tickets={tickets}/>
      </div>

      user_buttons = <div>

      </div>

      if (menu !== null){
        menu_content = <div>
          <Menu {...menu}/>
        </div>
      }

      console.log(logged_in, single_view)

      if(logged_in && !single_view) {
        donate_content = <div>
          <Donate id={id} />
        </div>
      }
    }

    let event_name_class = expanded ? 'event-name-expanded' : 'event-name-collapsed'

    return <div className='event' >
      <div className={event_name_class} onClick={this.toggle}>{name}</div>
      {content}
      {admin_buttons}
      {user_buttons}
      {donate_content}
      {menu_content}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);
