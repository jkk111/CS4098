import React from 'react';
import { Logger } from './Util'
//import Event from './Event'


class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.refresh();
  }

  handleChange(e) {
    this.setState({events: e.currentTarget.value});
  }

  async refresh() {
    let resp = await fetch('/admin/events')
    resp = await resp.json();

    this.setState({
      events: resp
    })

    Logger.log("Refresh Events", resp)
  }

  render() {
    let { events } = this.state;
    console.log('events', events);
    let rows = []
    if (events.length === 0){
      rows.push(<p>There are currently no events in the system</p>)
    } else {
      for (var i=0; i<events.length; i++){
        rows.push(<p>{events[i].name}</p>)
      }
    }
    return rows
  }
}

export default EventList
