import React from 'react';
import './Home.css'
import Nav from './Nav'

let ViewGuests = ({is_admin}) => {
  return <div className='view_guests'>
    <p>Here an admin can see list of all guests to all events ever</p>
    <p>to see guests for a specific event, go to that event and view the guestlist</p>
    //<button onClick={this.fetchUserList}>Click Me!</button>
  </div>
}

// async fetchUserList(){
//   let resp = await fetch('/admin/users')
//   resp = await resp.json();
//   console.log(resp);
// }

export default ViewGuests
