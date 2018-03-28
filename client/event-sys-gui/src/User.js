import React from 'react';
import './User.css'
import { Logger } from './Util'

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
    this.grant_admin = this.grant_admin.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  grant_admin(id) {
    return async() => {
      let body = JSON.stringify({ id })
      let resp = await fetch('/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })

      resp = resp.json();
      this.props.refresh();
      Logger.log('Promote User', resp)
    }
  }

  render() {
    let { expanded } = this.state;
    let { id, f_name, l_name, email, phone = '', accessibility = 'None', registered, subscribed, email_verified, is_admin } = this.props;

    let content = null;

    if(expanded) {


      let grant_admin = null;

      if(!is_admin) {
        grant_admin = <span className='user-content-button' onClick={this.grant_admin(id)}>
          Grant Admin
        </span>
      }

      subscribed = subscribed ? "Subscribed" : "Not Subscribed";
      email_verified = email_verified ? "Verified" : "Not Verified";
      is_admin = is_admin ? "Admin" : "Not Admin"
      registered = registered ? "Registered" : "Not Registered"

      content = <div className='user-content'>
        <span className='user-content-key'>Email:</span>
        <span className='user-content-value'>{email}</span>
        <span className='user-content-key'>Phone:</span>
        <span className='user-content-value'>{phone}</span>
        <span className='user-content-key'>Accessibility Requirements/Dietary Preference:</span>
        <span className='user-content-value'>{accessibility}</span>
        <span className='user-content-key'>Registration Status:</span>
        <span className='user-content-value'>{registered}</span>
        <span className='user-content-key'>Subscribed:</span>
        <span className='user-content-value'>{subscribed}</span>
        <span className='user-content-key'>Email Verified:</span>
        <span className='user-content-value'>{email_verified}</span>
        <span className='user-content-key'>Admin Status:</span>
        <span className='user-content-value'>
          <span>{is_admin}</span>
          {grant_admin}
        </span>
      </div>
    }

    let name = `${f_name} ${l_name}`;


    let user_name_class = expanded ? 'user-name-expanded' : 'user-name-collapsed'

    return <div className='user' >
      <div className={user_name_class} onClick={this.toggle}>{name}</div>
      {content}
    </div>
  }
}

export default User;