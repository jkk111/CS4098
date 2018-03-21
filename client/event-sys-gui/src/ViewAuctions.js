import React from 'react';
import { Logger } from './Util'
import Auction from './Auction'

class ViewAuctions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auctions: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.refresh();
  }

  handleChange(e) {
    this.setState({auctions: e.currentTarget.value});
  }

  async refresh() {
    let resp = await fetch('/admin/auctions')
    resp = await resp.json();

    this.setState({
      auctions: resp
    })

    Logger.log("Refresh Auctions", resp)
  }

  render() {
    let { auctions } = this.state;

    auctions = auctions.map((auction, i) => <Auction refresh={this.refresh} {...auction} key={i} />)
    return auctions
  }
}

export default ViewAuctions
