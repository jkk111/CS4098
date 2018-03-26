import React from 'react';
import Payment from './Payment'
import './Donate.css'

class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
    this.donation = this.donation.bind(this);
  }

  donation(amount){
    //let { id } = this.props;
    Payment.CreateDonation(amount);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    let { expanded } = this.state;

    let content = null;

    if(expanded) {
      content = <div>
      	<button className="buy-button" onClick={this.donation(1000)}>Donate 10 euro</button>
      	<button className="buy-button" onClick={this.donation(2500)}>Donate 25 euro</button>
      	<button className="buy-button" onClick={this.donation(5000)}>Donate 50 euro</button>
      	<button className="buy-button" onClick={this.donation(10000)}>Donate 100 euro</button>
      	<button className="buy-button" onClick={this.donation(50000)}>Donate 500 euro</button>
    </div>
    }

    return <div>
      <button className ="buy-button" onClick={this.toggle}>Donate</button>
      {content}
    </div>
  }
}

export default Donate;