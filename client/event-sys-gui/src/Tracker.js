import React from 'react';
import './Event.css'
let {Component} = React;

class Tracker extends Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: false,
      count: this.props.count || 0
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render(){

    let { expanded } = this.state;
    let { count } = this.state;
    let { name } = this.props;

    let content = null;

     if(expanded) {
      
      content = <div className='event-content'>
        <span className='event-content-key'>Name</span>
        <span className='event-content-value'>{name}</span>
        <h1> Current amount raised = {count} </h1>
      </div>
    }

    let event_name_class = expanded ? 'event-name-expanded' : 'event-name-collapsed'


   return <div className='event' >
      <div className={event_name_class} onClick={this.toggle}>{name}</div>
      {content}
    </div>
  }
}


export default Tracker