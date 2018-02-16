import React from 'react';
import { Logger } from './Util'

class ViewUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.refresh();

  }

  handleChange(e) {
    this.setState({users: e.currentTarget.value});
  }

  async refresh() {
    let resp = await fetch('/admin/users')
    //console.log(resp);
    resp = await resp.json();

    this.setState({
      users: resp
    })
    console.log(Logger)
    Logger.log("Refresh Users", resp)
  }



  render() {
    //let data = this.props.users;
    //console.log(this.state.users.length)
    let data = this.state.users
    console.log(data.length);
    var rows = [];
    for (var i=0; i<data.length; i++){
      rows.push(
        <tr>
          <td>{data[i].id}</td>
          <td>{data[i].f_name}</td>
          <td>{data[i].l_name}</td>
        </tr>
      );
    }
    return <div>
      <div className='view-users'>
        <p>Here an admin can see list of all guests to all events ever</p>

        <p>To see guests for a specific event, go to that event and view the guestlist</p>
        <table>
          <thead><tr><td>ID</td><td>First Name</td><td>Last Name</td></tr></thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  }
}


export default ViewUsers
