import React from 'react';
import './User.css'

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    let { expanded } = this.state;
    let { f_name, l_name, email, subscribed } = this.props;

    let content = null;

    if(expanded) {

      subscribed = subscribed ? "Subscribed" : "Not Subscribed";

      content = <div className='user-content'>
        <span className='user-content-key'>Email</span>
        <span className='user-content-value'>{email}</span>
        <span className='user-content-key'>Subscribed</span>
        <span className='user-content-value'>{subscribed}</span>
        <span className='user-content-key'>Email Verified</span>
        <span className='user-content-value'>Nah man</span>
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