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
      </div>
    );
  }
}

export default App;
