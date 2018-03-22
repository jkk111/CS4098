import React from 'react'
import { connect } from 'react-redux'
import { FloatPassword, FloatText } from './FloatText'
import { Logger } from './Util'

import './Settings.css'


const ALLERGEN_NAMES = [
  "Gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Peanuts",
  "Soybeans",
  "Milk",
  "Nuts",
  "Celery",
  "Mustard",
  "Sesame",
  "Sulphur Dioxide",
  "Lupin",
  "Molluscs"
]

let CheckBox = ({ name, label, value }) => {
  return <div className='checkbox'>
    <label className='checkbox-label'>{label}</label>
    <input name={name} type='checkbox' defaultChecked={value} />
  </div>
}

let resend = () => {
  fetch('/user/resend_confirmation', {})
}

let UserSettings = ({ ref, onBack, onSubmit, onChangePassword, handleAllergenSelected, selectedAllergens, defaults = {} }) => {
  console.log(defaults)
  let prompt = null;

  if(!defaults.email_verified) {
    prompt = <div onClick={resend} className='resend-confirmation'>
      Resend Confirmation Email
    </div>
  }

  let allergenOptions = buildAllergenList();
  let selectedAllergensList = buildSelectedAllergensList(selectedAllergens);

  return <form ref={ref} onSubmit={onSubmit} className='form'>
    <FloatText name='f_name' label='First Name:' defaultValue={defaults.f_name} />
    <FloatText name='l_name' label='Last Name:' defaultValue={defaults.l_name} />
    <FloatText name='email' label='Email:' defaultValue={defaults.email} />
    <FloatText name='phone' label='Phone:' defaultValue={defaults.phone} />
    <select value="0" onChange={handleAllergenSelected} id="selectVenue">
      <option value="0">-Let us know if you have any Allergies-</option>
      {allergenOptions}
    </select>
    <div>{selectedAllergensList}</div>
    <CheckBox name='subscribed' label='Subscribe To Mailing List' value={defaults.subscribed} />
    {prompt}
    <div className='form-button form-field' onClick={onChangePassword}>Change Password</div>
    <input className='form-button' type='submit' value='Save'/>
  </form>
}

let buildAllergenList = () => {
  let allergenList = []
  for (var i = 0; i < ALLERGEN_NAMES.length; i++) {
    let name = `${(i + 1)}. ${ALLERGEN_NAMES[i]}`;
    let value = i + 1;
    allergenList.push(<option key={value} value={value}>{name}</option>);
  }
  return allergenList;
}

let buildSelectedAllergensList = (selectedAllergens) => {
  if(selectedAllergens.length === 0) {
    return <p>No Allergens Selected</p>
  }

  let out = [
    <p key={'00'}>Your Allergens <h5> Reselect a selected Allergen from the dropdown to delete that allergen. </h5> </p>
  ]


  for (var i = 0; i < selectedAllergens.length; i++) {
    let name = `${(selectedAllergens[i] + 1)}. ${ALLERGEN_NAMES[selectedAllergens[i]]}`;
    out.push(<p key={i}>{name}</p>)
  }
  return out;
}

let PasswordSettings = ({ onSubmit, onBack }) => {
  let _onBack = (...args) => {
    let e = args[0]
    e.preventDefault() // We want to stop submitting the form
    e.target.form.reset();
    if(onBack) {
      onBack(...args);
    }
  }

  return <form onSubmit={onSubmit} className='form' >
    <FloatPassword name='current' label="Current Password:" />
    <FloatPassword name='password' label="New Password:" />
    <FloatPassword name='confirm' label="Confirm New Password:" />

    <div>
      <input type='submit' className='form-button' value='Save Changes' />
    </div>
    <div>
      <input type='submit' className='form-button' value='Cancel' onClick={_onBack} />
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
      view: 'INFO',
      selectedAllergens: this.props.info.allergens
    }

    this.change_password = this.change_password.bind(this);
    this.change_settings = this.change_settings.bind(this);
    this.reset = this.reset.bind(this);
    this.show_change_password = this.show_change_password.bind(this);
    this.handleAllergenSelected = this.handleAllergenSelected.bind(this);
  }

  handleAllergenSelected(event) {
    console.log("allergen ", event.target.value-1, " selected")
    let allergen = event.target.value-1;
    let selectedAllergens = this.state.selectedAllergens;
    if(selectedAllergens.includes(allergen)) {
      let i = selectedAllergens.indexOf(allergen);
        selectedAllergens.splice(i, 1);
    } else {
      selectedAllergens.push(allergen);
    }
    this.setState({selectedAllergens: selectedAllergens})
    console.log("selected so far", selectedAllergens);
  }


  async change_settings(e) {
    e.preventDefault();

    let form = e.target;
    let f_name = form.f_name.value;
    let l_name = form.l_name.value;
    let email = form.email.value;
    let phone = form.phone.value;
    let subscribed = form.subscribed.checked;
    let allergens = this.state.selectedAllergens;

    console.log(subscribed)

    let body = {
      f_name,
      l_name,
      email,
      phone,
      subscribed,
      allergens
    }

    console.log(body);

    let resp = await fetch('/user/update_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    resp = await resp.json();

    Logger.log("Change Settings", resp)
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

      Logger.Log("Change Password", resp)
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
      return <UserSettings onSubmit={this.change_settings} onBack={this.reset} defaults={this.props.info} onChangePassword={this.show_change_password} handleAllergenSelected={this.handleAllergenSelected} selectedAllergens={this.state.selectedAllergens}/>
    } else {
      return <PasswordSettings onSubmit={this.change_password} onBack={this.reset} />
    }
  }
}

export default connect(mapStateToProps)(Settings)
export {
  UserSettings
}
