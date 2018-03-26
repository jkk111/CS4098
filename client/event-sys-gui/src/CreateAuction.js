import React from 'react';
import './CreateAuction.css'
import 'moment/locale/en-ie'
import DateTime from './react-datetime'
import { Logger } from './Util'
import FloatText from './FloatText'

class CreateAuction extends React.Component {
  constructor() {
    super();
    this.state = {
      startDateTime:'',
      endDateTime:''
    };
    this.createAuction = this.createAuction.bind(this);
    this.startChange = this.startChange.bind(this);
    this.endChange = this.endChange.bind(this);
  }

  async createAuction(e) {
    e.preventDefault();
    let form = e.target;

    if(form.auction_name.value === '') {
      this.setState({
        name_error: 'Auction Name Cannot Be Empty'
      })
      return
    }

    if(!this.state.start_time) {
      this.setState({
        start_error: 'Event Must Have A Start Time'
      })
      return
    }

    if(!this.state.end_time) {
      this.setState({
        end_error: 'Event Must Have An End Time'
      })
      return
    }

    if(this.state.start_time > this.state.end_time) {
      this.setState({
        start_error: 'Woah Hold On There Time Traveller, The Beginning Must Come Before The End',
        end_error: 'Woah Hold On There Time Traveller, The Beginning Must Come Before The End'
      })
      return
    }


    let body = {
      name: form.auction_name.value,
      description: form.description.value,
      start_time: this.state.start_time,
      end_time: this.state.end_time
    }

    Logger.log('creating auction', body);
    let resp = await fetch('/admin/create_auction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    Logger.log("Create Auction Response", await resp.json())
    form.reset();

    this.setState({
      name_error: null,
      start_error: null,
      end_error: null
    })
  }

  startChange(e) {
    this.setState({
      start_time: e.unix() * 1000
    });
  }

  endChange(e) {
    this.setState({
      end_time: e.unix() * 1000
    });
  }

  render() {
    let { name_error = null, start_error = null, end_error = null } = this.state;

    if(name_error) {
      name_error = <div className='error'>
        {name_error}
      </div>
    }

    if(start_error) {
      start_error = <div className='error'>
        {start_error}
      </div>
    }

    if(end_error) {
      end_error = <div className='error'>
        {end_error}
      </div>
    }

    return <div className='event_form'>
      <form onSubmit={this.createAuction} autoComplete="off">
        {name_error}
        <FloatText name="auction_name" label="Auction Name:" />
        <FloatText name="description" label="Auction Description:" />
        <div className='event_form-input'>
          {start_error}
          <DateTime locale='en-ie' name="start" label="Start Date/Time: " onChange={this.startChange} closeOnSelect={true} />
          {end_error}
          <DateTime locale='en-ie' name="end" label="End Date/Time: " onChange={this.endChange} closeOnSelect={true} />
        </div>
        <div className='event_form-input'>
          <input type='submit' className='form-button' submit="create_auction" value='Create Auction'/>
        </div>
      </form>
    </div>
  }
}

export default CreateAuction
