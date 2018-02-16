import React, { Component, Fragment } from 'react';
import './App.css';
import Test from "./Test"
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import EventForm from './CreateEvent'
import MenuForm from './MenuForm'
import { connect } from 'react-redux'
import Home from './Home'
import Nav from './Nav'
import CreateUser from './CreateUser'
import Settings from './Settings'
import EventList from './EventList'
//import ViewGuests from './ViewGuests'


let mapStateToProps = (state) => {
  return {
    logged_in: state.logged_in,
    view: state.active_view
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    set_logged_in: (logged_in) => {
      dispatch({
        type: 'LOGIN_STATE_CHANGED',
        value: logged_in
      })
    }
  }
}

// Dev Only, localhost + ips don't agree with cookies :(
let set_cookie = (id) => {
  let expires = new Date();
  expires.setYear(expires.getUTCFullYear() + 1);
  let c_str = `id=${id}; expires=` + expires;
  document.cookie = c_str;
}

const views = {
  HOME: Home,
  CREATE_USER: CreateUser,
  SETTINGS: Settings,
  EVENT_LIST: EventList,
  CREATE_EVENT: EventForm,
  CREATE_MENU: MenuForm,
  //VIEW_GUESTS: ViewGuests
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    if(this.props.test_view) {
      this.getTestResults();
    }

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.CreateEvent = this.CreateEvent.bind(this);
    this.CreateMenu = this.CreateMenu.bind(this);
  }

  async login(e) {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value
    let body = JSON.stringify({ username, password });
    let resp = await fetch('/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    resp = await resp.json();
    this.props.set_logged_in(resp.auth_level);
    set_cookie(resp.id)
  }

  async logout(){
    let resp = await fetch('/logout');
    resp = await resp.json();

    console.log(resp);

    this.props.set_logged_in('UNAUTH');
  }

  async register(e) {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    let password_confirm = e.target.password_confirm.value;
    if(password !== password_confirm) {
      this.setState({ registerError: 'Passwords Must Match' });
      return;
    }
    let f_name = e.target.f_name.value;
    let l_name = e.target.l_name.value;
    let email = e.target.email.value;
    let body = JSON.stringify({ username, password, f_name, l_name, email });
    let resp = await fetch('/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    resp = await resp.json();
    set_cookie(resp.id)
  }

 async CreateEvent(e) {
    e.preventDefault();
    let event_name = e.target.event_name.value;
    let location = e.target.location.value;
    let date = e.target.date.value;
    let time = e.target.time.value;
    let desp = e.target.desp.value;
    let body = JSON.stringify({ event_name, location, date, time, desp });
    let resp = await fetch('/CreateEvent', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    resp = await resp.json();
    set_cookie(resp.id)
  }


 async CreateMenu(e) {
    e.preventDefault();
    let starter1 = e.target.starter1.value;
    let starter2 = e.target.starter2.value;
    let starter3 = e.target.starter3.value;
    let main1 = e.target.main1.value;
    let main2 = e.target.main2.value;
    let main3 = e.target.main3.value;
    let dessert1 = e.target.dessert1.value;
    let dessert2 = e.target.dessert2.value;
    let dessert3 = e.target.dessert3.value;
    let body = JSON.stringify({ starter1, starter2, starter3, main1, main2, main3, dessert1, dessert2, dessert3 });
    let resp = await fetch('/CreateMenu', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    resp = await resp.json();
    set_cookie(resp.id)
  }

  async getTestResults() {
    let resp = await fetch('/tests')
    let data = await resp.json();
    this.setState({ test_results: data })
  }

  render() {
    let { registerError, loginError, menuError,eventError } = this.state;
    if(this.props.test_view) {
      return <Test results={this.state.test_results} />
    }

    if (this.props.logged_in !== 'UNAUTH'){
      let View = views[this.props.view] || views.HOME

      return <Fragment>
        <Nav />
        <View />
      </Fragment>
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Event-Management-System</h1>
          </header>
          <p className="App-intro">
            <code>// TODO</code>
            <br />
            Want to see the test results? <a href="?tests" >Click Here</a>
          </p>
          <LoginForm error={loginError} onSubmit={this.login} />
          <SignupForm error={registerError} onSubmit={this.register} />
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

/////        //<EventForm error={eventError} onSubmit={this.CreateEvent}/>
        //<MenuForm error={menuError} onSubmit={this.CreateMenu}/>