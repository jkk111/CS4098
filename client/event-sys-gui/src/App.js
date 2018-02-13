import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from "./Test"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    if(this.props.test_view) {
      this.getTestResults();
    }
  }

  async getTestResults() {
    let resp = await fetch('/tests')
    let data = await resp.json()

    this.setState({ test_results: data })
  }

  render() {

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
        <LoginForm/>
        <SignupForm/>
      </div>
    );
  }
}

class LoginForm extends React.Component {
  render() {
    return (
      <div className="login-form">
        <h1>Already Have An Account? / Log In</h1>
        <form>
          <label>
            Username:<input type="text" name="loginUsername" />
          </label>
          <br/>
          <label>
            Password:<input type="text" name="loginPassword" />
          </label>
          <br/>
          <input type="submit" value="Log In" />
        </form>
      </div>
    );
  }
}

class SignupForm extends React.Component {
  render() {
    return (
      <div className="signup-form">
        <h1>Sign Up / Create An Account</h1>
        <form>
          <label>
            First Name:<input type="text" name="signupFirstName" />
          </label>
          <br/>
          <label>
            Last Name:<input type="text" name="signupLastName" />
          </label>
          <br/>
          <label>
            Username:<input type="text" name="signupUsername" />
          </label>
          <br/>
          <label>
            Email:<input type="text" name="signupEmail" />
          </label>
          <br/>
          <label>
            Password:<input type="text" name="signupPassword" />
          </label>
          <br/>
          <label>
            Confirm Password:<input type="text" name="signUpPasswordConfirm" />
          </label>
          <br/>
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    );
  }
}

export default App;
