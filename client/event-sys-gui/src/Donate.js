import React from 'react';
import Payment from './Payment'
import './Donate.css'
import Dropdown from './Dropdown'

class Donate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
    this.donate = this.donate.bind(this);
    this.buildAmountList = this.buildAmountList.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  donate(){
    let { donationAmount } = this.state;
    Payment.CreateDonation(donationAmount * 100, this.props.id);
  }

  handleAmountChange(value) {
    this.setState({donationAmount: value})
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  buildAmountList(){
    let amounts = [ 1, 2, 5, 10, 20, 50, 100, 500, 1000 ];
    amounts = amounts.map((amount, i) => {
      return <option key={i} value={amount}>{amount}</option>
    });

    let amountList = [
      <option key="-1" value="-1">-select amount-</option>,
      ...amounts
    ]

    return amountList;
  }

  render() {
    let { expanded, donationAmount } = this.state;
    let content = null;
    let amountList = this.buildAmountList();
    let donateButton = null;

    if (donationAmount > 0){
      donateButton = <button className="buy-button" onClick={this.donate}>Donate €{donationAmount}</button>
    }

    if(expanded) {
      content = <div>
        <Dropdown value={this.state.donationAmount} onChange={this.handleAmountChange}>
          {amountList}
        </Dropdown>
        {donateButton}
      </div>
    }

    return <div>
      <button className="buy-button" onClick={this.toggle}>Make A Donation</button>
      {content}
    </div>
  }
}

export default Donate;
