import React from 'react';
import './Contact.css'
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
    <h1> If you wish to get in contact with us, please fill in the following
    fields, and we will reply to you via e-mail as soon as possible </h1>
      <form onSubmit={this.sendContact} autoComplete="off">
        <FloatText name="name" label="Your Name:"  />
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
