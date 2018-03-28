import React from 'react';
import './CreateAuctionItem.css'
import 'moment/locale/en-ie'
import { Logger, isNatural } from './Util'
import { FloatText, FloatNumber } from './FloatText'
import Dropdown from './Dropdown'

class CreateAuctionItem extends React.Component {
  constructor() {
    super();
    this.state = {
      auctions: [],
      selectedAuction: ''
    };
    this.createAuctionItem = this.createAuctionItem.bind(this);
    this.handleAuctionChange = this.handleAuctionChange.bind(this);
    this.setAuctions();
  }

  handleAuctionChange(value) {
    this.setState({ selectedAuction: value })
  }

  async setAuctions() {
    let response = await fetch('/auctions')
    response = await response.json();
    this.setState({auctions: response});
    Logger.log("Loaded Auctions", response)
  }

  buildAuctionList() {
    let auctions = this.state.auctions;
    let auctionList = [
      <option key="0" value="0">-select auction-</option>
    ]

    if(auctions.length !== 0) {
      for (var i = 0; i < auctions.length; i++) {
        let name = auctions[i].name;
        let id = auctions[i].id;
        auctionList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return auctionList;
  }

  async createAuctionItem(e) {
    e.preventDefault();
    let form = e.target;

    if(!form.name.value) {
      this.setState({
        name_error: 'Item Name Cannot Be Empty'
      })
      return;
    }

    if(!form.description.value) {
      this.setState({
        description_error: 'Item Description Cannot Be Empty'
      })
      return;
    }

    if(!isNatural(form.price.value)) {
      this.setState({
        price_error: "Price Must Be A Valid Number"
      })
      return;
    }

    if(!this.state.selectedAuction) {
      this.setState({
        auction_error: "Auction Item Must Have An Associated Auction"
      })
      return
    }

    let body = {
      name: form.name.value,
      description: form.description.value,
      starting_price: form.price.value * 1000,
      auction_id: this.state.selectedAuction
    }

    let resp = await fetch('/admin/create_auction_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    Logger.log("Create Item Response", await resp.json())
    form.reset();

    this.setState({
      name_error: null,
      description_error: null,
      price_error: null,
      auction_error: null,
      selectedAuction: 0
    })
  }

  render() {
    let { name_error = null, description_error = null, price_error = null, auction_error = null } = this.state;

    if(name_error) {
      name_error = <div className='error'>
        {name_error}
      </div>
    }

    if(description_error) {
      description_error = <div className='error'>
        {description_error}
      </div>
    }

    if(price_error) {
      price_error = <div className='error'>
        {price_error}
      </div>
    }

    if(auction_error) {
      auction_error = <div className='error'>
        {auction_error}
      </div>
    }

    let auctionOptions = this.buildAuctionList();
    return <div className='auction_item_form'>
      <form onSubmit={this.createAuctionItem} autoComplete="off">
        {name_error}
        <FloatText name="name" label="Item Name:" />
        {description_error}
        <FloatText name="description" label="Item Description:" />
        {price_error}
        <FloatNumber name="price" label="Starting Price:" />
        {auction_error}
        <Dropdown value={this.state.selectedAuction} onChange={this.handleAuctionChange}>
          {auctionOptions}
        </Dropdown>
        <div className='item_form-input'>
          <input type='submit' className='form-button' submit="create_auction_item" value='Create Item'/>
        </div>
      </form>
    </div>
  }
}

export default CreateAuctionItem
