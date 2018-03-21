import React from 'react';
import './CreateAuctionItem.css'
import 'moment/locale/en-ie'
import { Logger, isNatural } from './Util'
import FloatText from './FloatText'

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

  handleAuctionChange(event){
    this.setState({selectedAuction: event.target.value})
  }

  async setAuctions() {
    let response = await fetch('/admin/auctions')
    response = await response.json();
    this.setState({auctions: response});
    Logger.log("Loaded Auctions", response)
  }

  buildAuctionList(){
    let auctions = this.state.auctions;
    let auctionList = [<option key="0" value="0">-select auction-</option>]
    if (auctions.length !== 0){
      for (var i=0; i<auctions.length; i++){
        let name = auctions[i].name;
        let id = auctions[i].id;
        auctionList.push(<option key={id} value={id}>{name}</option>);
      }
    }
    return auctionList;
  }

  async createAuctionItem(e){
    e.preventDefault();
    let form = e.target;

    if (!form.name.value){
      alert('please give the item a name');
      return;
    }

    if (!isNatural(form.price.value)){
      alert('please enter a starting price for the item');
      return;
    }

    let body = {
      name: form.name.value,
      description: form.description.value,
      starting_price: form.price.value,
      auction_id: this.state.selectedAuction
    }

    console.log('creating auction item', body);
    let resp = await fetch('/admin/create_auction_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    console.log(resp);
    Logger.log("Create Item Response", await resp.json())
    form.reset();
  }

  render() {
    let auctionOptions = this.buildAuctionList();
    return <div className='auction_item_form'>
      <form onSubmit={this.createAuctionItem} autoComplete="off">
        <FloatText name="name" label="Item Name:" />
        <FloatText name="description" label="Item Description:" />
        <FloatText name="price" label="Starting Price:" />
        <select value={this.state.auction} onChange={this.handleAuctionChange} id="selectAuction">
          {auctionOptions}
        </select>
        <div className='item_form-input'>
          <input type='submit' className='form-button' submit="create_auction_item" value='Create Item'/>
        </div>
      </form>
    </div>
  }
}

export default CreateAuctionItem
