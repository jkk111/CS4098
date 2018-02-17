import React from 'react';
import { Logger } from './Util'
import User from './User'

class ViewUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.refresh();

  }

  handleChange(e) {
    this.setState({users: e.currentTarget.value});
  }

  async refresh() {
    let resp = await fetch('/admin/users')
    resp = await resp.json();

    this.setState({
      users: resp
    })

    Logger.log("Refresh Users", resp)
  }



  render() {
    let { users } = this.state;

    users = users.map((user, i) => <User refresh={this.refresh} {...user} key={i} />)
    return users
  }
}


export default ViewUsers
