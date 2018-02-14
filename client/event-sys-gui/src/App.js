import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from "./Test"
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import { connect } from 'react-redux'

let mapStateToProps = (state) => {
  return {
    logged_in: state.logged_in
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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    if(this.props.test_view) {
      this.getTestResults();
    }

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async login(e) {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value
    let body = JSON.stringify({ username, password });
    let resp = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    resp = await resp.json();
    this.props.set_logged_in(resp.success);
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
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
  }

  async getTestResults() {
    let resp = await fetch('/tests')
    let data = await resp.json();
    this.setState({ test_results: data })
  }

  render() {
    let { registerError, loginError } = this.state;
    if(this.props.test_view) {
      return <Test results={this.state.test_results} />
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
