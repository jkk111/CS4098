import React from 'react';
import './CreateVenue.css'
import 'moment/locale/en-ie'
import { Logger } from './Util'
import FloatText from './FloatText'

class CreateVenue extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      address_1: '',
      address_2:'',
      city:'',
      country:'',
      capacity:''
    };
    this.createVenue = this.createVenue.bind(this);
  }

  async createVenue(e){
    e.preventDefault();
    let form = e.target;
    let body = {
      name: form.name.value,
      description: form.description.value,
      address_1: form.address_1.value,
      address_2: form.address_2.value,
      city: form.city.value,
      country: form.country.value,
      capacity: form.capacity.value
    }
    console.log('creating venue', body);
    let resp = await fetch('/admin/create_venue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    console.log(resp);
    Logger.log("Create Venue Response", await resp.json())
    form.reset();
  }

  render() {
    return <div className='venue_form'>
      <form onSubmit={this.createVenue} autoComplete="off">
        <FloatText name="name" label="Venue Name:" />
        <FloatText name="description" label="Description of Venue:" />
        <FloatText name="address_1" label="Address Line 1:" />
        <FloatText name="address_2" label="Address Line 2:" />
        <FloatText name="city" label="City:" />
        <input name="country" type='hidden' value='IE' />
        <FloatText name="capacity" label="Venue Capacity:" />
        <div className='venue_form-input'>
          <input type='submit' className='form-button' submit="create_venue" value='Create Venue'/>
        </div>
      </form>
    </div>
  }
}

export default CreateVenue
