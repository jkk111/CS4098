import React from 'react';
import './CreateTicket.css'
import 'moment/locale/en-ie'
import FloatText from './FloatText'

class Contact extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      message: '',
    };
  }

  render() {
    return <div className='contact_form'>
      <form onSubmit={this.sendContact} autoComplete="off">
        <FloatText name="name" label="Your Name:" />
        <FloatText name="email" label="Your Email:" />
        <FloatText name="message" label="Your Message:" />
        <div className='contact_form-input'>
          <input type='submit' className='form-button' submit="send_contact" value='Send Message'/>
        </div>
      </form>
    </div>
  }
}

export default Contact
