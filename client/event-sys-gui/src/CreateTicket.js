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
      this.setState({
        name_error: 'Ticket Name Cannot Be Empty'
      })
      return;
    }

    if(!form.description.value) {
      this.setState({
        description_error: 'Ticket Description Cannot Be Empty'
      })
      return;
    }

    if(!isNatural(form.price.value)) {
      this.setState({
        price_error: "Price Must Be A Valid Number"
      })
      return;
    }

    let body = {
      name: form.name.value,
      description: form.description.value,
      price: (form.price.value * 100),
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

    this.setState({
      name_error: null,
      description_error: null,
      price_error: null
    })
    form.reset();
  }

  render() {
    let { name_error = null, description_error = null, price_error = null } = this.state;

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

    return <div className='ticket_form'>
      <form onSubmit={this.createTicket} autoComplete="off">
        {name_error}
        <FloatText name="name" label="Ticket Name:" />
        {description_error}
        <FloatText name="description" label="Ticket Description:" />
        {price_error}
        <FloatText name="price" label="Ticket Price:" />
        <div className='ticket_form-input'>
          <input type='submit' className='form-button' submit="create_ticket" value='Create Ticket'/>
        </div>
      </form>
    </div>
  }
}

export default CreateTicket
