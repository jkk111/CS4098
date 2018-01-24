import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      test_view: window.location.search.indexOf("tests") > -1
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Event-Management-System</h1>
        </header>
        <p className="App-intro">
          <code>// TODO</code>
        </p>
      </div>
    );
  }
}

export default App;
