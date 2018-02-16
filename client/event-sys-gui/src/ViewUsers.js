import React from 'react';
import { Logger } from './Util'

class ViewUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }

    this.refresh = this.refresh.bind(this)
    this.refresh();
  }

  async refresh() {
    let resp = await fetch('/admin/users')
    resp = await resp.json();

    this.setState({
      users: resp
    })
    console.log(Logger)
    Logger.log("Refresh Users", resp)
  }

  render() {
    return <div className='view-users'>
      Here an admin can see list of all guests to all events ever

      to see guests for a specific event, go to that event and view the guestlist
    </div>
  }
}


export default ViewUsers
