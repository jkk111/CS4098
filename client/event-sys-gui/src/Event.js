import React from 'react';
import './Event.css'
import { connect } from 'react-redux'
import ViewTickets from './ViewTickets'

let mapDispatchToProps = (dispatch) => {
  return {
    show_tracker: (id) => {
      dispatch({ type: 'VIEW_CHANGED', value: 'VIEW_DONATIONS' })
      dispatch({ type: 'TRACK_EVENT', value: id })
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

  render() {
    let { expanded } = this.state;
    let { id, name, description, tickets, venue_id, max_attendees, start_time, end_time, is_admin} = this.props;

    let content = null;
    let admin_content = null;
    let buttons = null;
    let menu = null;

    console.log("Start Time", start_time)

    let startObject = new Date(start_time);
    let startString = startObject.toUTCString();

    let endObject = new Date(end_time);
    let endString = endObject.toUTCString();

    if(expanded) {
      if(is_admin) {
        admin_content = <div>
          <div className='admin-content'>
            <span className='event-content-key'>Event ID</span>
            <span className='event-content-value'>{id}</span>
            <span className='event-content-key'>Venue ID</span>
            <span className='event-content-value'>{venue_id}</span>
          </div>
        </div>
      }

      content = <div>
        <div className='event-content'>
          <span className='event-content-key'>Name:</span>
          <span className='event-content-value'>{name}</span>
          <span className='event-content-key'>Description:</span>
          <span className='event-content-value'>{description}</span>
          <span className='event-content-key'>Capacity:</span>
          <span className='event-content-value'>{max_attendees}</span>
          <span className='event-content-key'>Starts:</span>
          <span className='event-content-value'>{startString}</span>
          <span className='event-content-key'>Ends:</span>
          <span className='event-content-value'>{endString}</span>
        </div>
        <ViewTickets event_id={id} tickets={tickets}/>
      </div>

      menu = <div>
        <div>
          <span className='user-content-button' onClick={this.show_menu}>Show Menu for this event</span>
        </div>
      </div>

      if (is_admin) {
        buttons = <div>
          <div>
            <span className='user-content-button' onClick={this.show_allergens}>Show Guest Allergen Information</span>
          </div>
          <div>
            <span className='user-content-button' onClick={this.show_tracker}>View Live Tracker</span>
          </div>
        </div>
      }
    }

    let event_name_class = expanded ? 'event-name-expanded' : 'event-name-collapsed'

    return <div className='event' >
      <div className={event_name_class} onClick={this.toggle}>{name}</div>
      {admin_content}
      {content}
      {buttons}
      {menu}
    </div>
  }
}

export default connect(null, mapDispatchToProps)(Event);
