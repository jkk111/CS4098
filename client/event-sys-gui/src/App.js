import React, { Component, Fragment } from 'react';
import './App.css';
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import EventForm from './CreateEvent'
import CreateMenu from './CreateMenu'
import { connect } from 'react-redux'
import Home from './Home'
import Nav from './Nav'
import CreateUser from './CreateUser'
import Tracker from './Tracker'
import Settings from './Settings'
import EventList from './EventList'
import ViewUsers from './ViewUsers'
import CreateTicket from './CreateTicket'
import Contact from './Contact'
import ViewMenus from './ViewMenus'
import Payment from './Payment'
import CreateAuctionItem from './CreateAuctionItem'
import CreateAuction from './CreateAuction'
import ViewAuctions from './ViewAuctions'
import CreateTable from './CreateTable'
import DonationTracker from './DonationTracker'
import SingleEventView from './SingleEventView'
import ViewTransactions from './ViewTransactions'
import PayBid from './PayBid'

let mapStateToProps = (state) => {
  return {
    logged_in: state.logged_in,
    view: state.active_view.current
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
  VIEW_TRACKER: Tracker,
  VIEW_DONATIONS: DonationTracker,
  SETTINGS: Settings,
  EVENT_LIST: EventList,
  CREATE_EVENT: EventForm,
  CREATE_MENU: CreateMenu,
  VIEW_USERS: ViewUsers,
  CREATE_TICKET: CreateTicket,
  CONTACT: Contact,
  VIEW_MENUS: ViewMenus,
  CREATE_AUCTION_ITEM: CreateAuctionItem,
  CREATE_AUCTION: CreateAuction,
  VIEW_AUCTIONS: ViewAuctions,
  CREATE_TABLE: CreateTable,
  VIEW_TRANSACTIONS: ViewTransactions
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
//    this.CreateMenu = this.CreateMenu.bind(this);
  }

  componentDidMount() {
    Payment.Init();
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

    if(resp.error === 'INVALID_AUTH') {
      this.setState({
        loginError: "Invalid Username/Password"
      })
    }
    else {
      this.setState({
        loginError: null,
        registerError: null
      })
    }

    set_cookie(resp.id)
  }

  async logout() {
    await fetch('/logout');
    window.location.href = '/';
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
    set_cookie(resp.id);
    if(resp.success) {
      this.setState({ registerError: null, loginError: null });
      this.props.set_logged_in('USER')
    }
    else{
      this.setState({ registerError: 'Username or Email already exists' });
      return;
    }
  }

  async getTestResults() {
    let resp = await fetch('/tests')
    let data = await resp.json();
    this.setState({ test_results: data })
  }

  render() {
    let { registerError, loginError } = this.state;
    if(this.props.view === 'SINGLE_EVENT_VIEW') {
      return <SingleEventView />
    }

    if(this.props.view === 'PAY_BID') {
      return <PayBid />
    }

    if(this.props.logged_in !== 'UNAUTH') {
      let View = views[this.props.view] || views.HOME
      return <Fragment>
        <Nav />
        <View />
      </Fragment>
    } else {
      return <div className="App">
        <header className="App-header">
          <h1 className="App-title">Event-Management-System</h1>
        </header>
        <LoginForm loginError={loginError} onSubmit={this.login} />
        <SignupForm registerError={registerError} onSubmit={this.register} />
      </div>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
