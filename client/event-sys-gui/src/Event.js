import React from 'react';
import './Event.css'
import { connect } from 'react-redux'
import ViewTickets from './ViewTickets'
import Menu from './Menu'

let mapStateToProps = (state) => {
  return {
    is_admin: !state.admin_info.pending
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    show_tracker: (id) => {
      dispatch({ type: 'VIEW_CHANGED', value: 'VIEW_DONATIONS' })
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
    this.edit_event = this.edit_event.bind(this);
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

  edit_event() {
    this.props.edit_event(this.props);
  }

  render() {
    let { expanded } = this.state;
    let { id, name, description, tickets, menu, start_time, end_time, is_admin} = this.props;

    let admin_buttons = null;
    let content = null;
    let user_buttons = null;
    let menu_content = null;

    console.log("Start Time", start_time)

    let startObject = new Date(start_time);
    let startString = startObject.toUTCString();

    let endObject = new Date(end_time);
    let endString = endObject.toUTCString();

    if(expanded) {
      if(is_admin) {
        admin_buttons = <div>
          <div>
            <span className='user-content-button' onClick={this.show_allergens}>Export Attendee Allergen Information</span>
          </div>
          <div>
            <span className='user-content-button' onClick={this.edit_event}>Edit this Event</span>
          </div>
          <div>
            <span className='user-content-button' onClick={this.show_tracker}>View Live Tracker</span>
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

        <div>
        <span className='user-content-button'>Donate</span>
        </div>
      </div>

      if (!(menu == null)){
        menu_content = <div>
          <Menu {...menu}/>
        </div>
      }
    }

    let event_name_class = expanded ? 'event-name-expanded' : 'event-name-collapsed'

    return <div className='event' >
      <div className={event_name_class} onClick={this.toggle}>{name}</div>
      {content}
      {admin_buttons}
      {user_buttons}
      {menu_content}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Event);
