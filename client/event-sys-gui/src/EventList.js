import React from 'react';
import { Logger } from './Util'
import Event from './Event.js'


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
    let resp = await fetch('/user/events')
    resp = await resp.json();
    this.setState({events: resp})
    Logger.log("Refresh Events", resp)
  }

  render() {
    let { events } = this.state;
    console.log(events)
    events = events.map((event, i) => <Event refresh={this.refresh} {...event} key={i} />)
    return events
  }
}

export default EventList
