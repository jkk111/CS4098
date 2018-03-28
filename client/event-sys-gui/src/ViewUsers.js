import React from 'react';
import { Logger } from './Util'
import User from './User'

class ViewUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      mode: 'ALL',
      minimum: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.setMin = this.setMin.bind(this);
    this.refresh();
  }

  handleChange(e) {
    this.setState({users: e.currentTarget.value});
  }

  async refresh() {
    let { minimum = '' } = this.state;
    minimum = `${minimum}`;
    if(minimum.trim() === '') {
      minimum = 0;
    } else {
      minimum = parseInt(minimum, 10);
    }

    let resp = null;

    if(this.state.mode === 'ALL') {
      resp = await fetch('/admin/users')
    } else if(this.state.mode === 'BIG_SPENDER') {
      let body = JSON.stringify({
        minimum
      })
      resp = await fetch('/admin/big_spenders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
    } else if(this.state.mode === 'REGULAR_SPENDER') {
      let body = JSON.stringify({
        minimum
      })
      resp = await fetch('/admin/regular_spenders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
    }

    resp = await resp.json();
    this.setState({
      users: resp
    })

    Logger.log("Refresh Users", resp)
  }

  changeMode(mode) {
    return () => {
      this.setState({
        mode,
        minimum: 0
      }, () => {
        this.refresh();
      })
    }
  }

  setMin(e) {
    this.setState({
      minimum: e.target.value
    }, () => {
      this.refresh()
    })
  }

  render() {
    let { users, mode } = this.state;

    users = users.map((user, i) => <User refresh={this.refresh} {...user} key={i} />)

    let min_input = <input type='number' min='0' placeholder='Minimum' onChange={this.setMin} value={this.state.minimum} />

    let modes = [
      {
        name: 'All',
        value: 'ALL'
      },
      {
        name: 'Big Spenders',
        value: 'BIG_SPENDER',
        extra: min_input
      },
      {
        name: 'Regular Spenders',
        value: 'REGULAR_SPENDER',
        extra: min_input
      }
    ]

    let modeItem = modes.find(m => {
      return m.value === mode
    })

    let avail_modes = modes.filter(m => m.value !== mode).map(m => {
      return <button key={m.name} onClick={this.changeMode(m.value)}>{m.name}</button>
    });

    console.log(modes, modeItem)

    return <div>
      <div className='user-mode-select'>
        Mode: {modeItem.name} {modeItem.extra || null}
        {avail_modes}
      </div>
      {users}
    </div>
  }
}

export default ViewUsers
