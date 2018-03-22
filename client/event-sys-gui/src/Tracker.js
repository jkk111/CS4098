import React from 'react';
let {Component} = React;

class Tracker extends Component {
  constructor(props){
    super(props);
    this.state = {
      number: this.props.number || 0
    }
  }

  render(){
    let {number} = this.state;
    return(
      <div>
        <h2> Current amount raised = {number} </h2>
        
      </div>
    );
  }
}
  

export default Tracker