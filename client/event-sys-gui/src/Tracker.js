import React from 'react';
let {Component} = React;

class Tracker extends Component {
  constructor(props){
    super(props);
    this.state = {
      count: this.props.count || 0
    }
  }

  render(){
    let { count } = this.state;
    return <div>
      <h1> Current amount raised = {number} </h1>
    </div>
  }
}


export default Tracker