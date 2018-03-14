import React from 'react';
import './Event.css'
//import { Logger } from './Util'

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    let { expanded } = this.state;
    let { id, name, description, venue_id, max_attendees, start_time, end_time, is_admin} = this.props;

    let content = null;
    let admin_content = null;

    console.log("Start Time", start_time)

    let startObject = new Date(start_time);
    let startString = startObject.toUTCString();

    let endObject = new Date(end_time);
    let endString = endObject.toUTCString();

    if(expanded) {
      if (is_admin){
        admin_content = <div className='admin-content'>
          <span className='event-content-key'>Event ID</span>
          <span className='event-content-value'>{id}</span>
          <span className='event-content-key'>Venue ID</span>
          <span className='event-content-value'>{venue_id}</span>
        </div>
      }
      content = <div className='event-content'>
        <span className='event-content-key'>Name</span>
        <span className='event-content-value'>{name}</span>
        <span className='event-content-key'>Description</span>
        <span className='event-content-value'>{description}</span>
        <span className='event-content-key'>Capacity</span>
        <span className='event-content-value'>{max_attendees}</span>
        <span className='event-content-key'>Starts</span>
        <span className='event-content-value'>{startString}</span>
        <span className='event-content-key'>Ends</span>
        <span className='event-content-value'>{endString}</span>
      </div>
    }

    let event_name_class = expanded ? 'event-name-expanded' : 'event-name-collapsed'

    return <div className='event' >
      <div className={event_name_class} onClick={this.toggle}>{name}</div>
      {admin_content}
      {content}
    </div>
  }
}

export default Event;
