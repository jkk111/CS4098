import React from 'react';
import './CreateTicket.css'
import 'moment/locale/en-ie'
import { Logger, isNatural } from './Util'
import FloatText from './FloatText'

class CreateTicket extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      price: '',
      currency:''
    };
    this.createTicket = this.createTicket.bind(this);
  }

  async createTicket(e) {
    e.preventDefault();
    let form = e.target;

    if(!form.name.value) {
      // alert('please give the ticket a name');
      return;
    }

    if(!isNatural(form.price.value)) {
      // alert('please enter a number for the ticket price');
      return;
    }

    let body = {
      name: form.name.value,
      description: form.description.value,
      price: form.price.value,
      currency: 'EUR'
    }
    console.log('creating ticket', body);
    let resp = await fetch('/admin/create_ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    console.log(resp);
    Logger.log("Create Ticket Response", await resp.json())
    form.reset();
  }

  render() {
    return <div className='ticket_form'>
      <form onSubmit={this.createTicket} autoComplete="off">
        <FloatText name="name" label="Ticket Name:" />
        <FloatText name="description" label="Ticket Description:" />
        <FloatText name="price" label="Ticket Price:" />
        <div className='ticket_form-input'>
          <input type='submit' className='form-button' submit="create_ticket" value='Create Ticket'/>
        </div>
      </form>
    </div>
  }
}

export default CreateTicket
