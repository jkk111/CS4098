import React from 'react'
import { connect } from 'react-redux'

let UserSettings = ({ ref, onBack, onSubmit, onChangePassword, defaults = {} }) => {
  console.log(defaults)
  return <form ref={ref} onSubmit={onSubmit}>
    <div>
      <label>First Name:</label>
      <input type='text' name='f_name' autoComplete='off' defaultValue={defaults.f_name} />
    </div>
    <div>
      <label>Last Name:</label>
      <input type='text' name='l_name' autoComplete='off' defaultValue={defaults.l_name} />
    </div>
    <div>
      <label>Email:</label>
      <input type='text' name='email' autoComplete='off' defaultValue={defaults.email} />
    </div>
    <div className='form-button' onClick={onChangePassword}>Change Password</div>
    <div>
      <input type='submit' />
    </div>
  </form>
}

let PasswordSettings = ({ onSubmit, onBack }) => {
  return <form onSubmit={onSubmit} >
    <div>
      <label>Current Password:</label>
      <input type='password' name='current' />
    </div>
    <div>

      <label>New Password:</label>
      <input type='password' name='password' />
    </div>
    <div>
      <label>Confirm Password:</label>
      <input type='password' name='confirm' />
    </div>

    <div>
      <button onClick={onBack}>Cancel</button>
    </div>

    <div>
      <input type='submit' />
    </div>
  </form>
}

let mapStateToProps = (state) => {
  return {
    info: state.info
  }
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'INFO'
    }

    this.change_password = this.change_password.bind(this);
    this.change_settings = this.change_settings.bind(this);
    this.reset = this.reset.bind(this);
    this.show_change_password = this.show_change_password.bind(this);
  }

  change_settings(e) {
    e.preventDefault();
  }

  async change_password(e) {
    e.preventDefault();
    let form = e.target;
    let password = form.password.value;
    let confirm = form.confirm.value;
    let current = form.current.value;



    if(password === confirm) {
      this.setState({
        view: 'INFO'
      })

      let body = JSON.stringify({
        currentPassword: current,
        newPassword: password
      })

      console.log(body);

      let resp = await fetch('/user/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });
      resp = await resp.json();

    } else {
      this.setState({ change_password_error: 'Passwords must match' })
    }
  }

  show_change_password(e) {
    e.preventDefault();
    this.setState({
      view: 'PASSWORD'
    })
  }

  reset(e) {
    e.preventDefault();
    this.setState({
      view: 'INFO'
    })
  }

  render() {
    if(this.state.view === 'INFO') {
      return <UserSettings onSubmit={this.change_settings} onBack={this.reset} defaults={this.props.info} onChangePassword={this.show_change_password} />
    } else {
      return <PasswordSettings onSubmit={this.change_password} onBack={this.reset} />
    }
  }
}

export default connect(mapStateToProps)(Settings)
export {
  UserSettings
}