import React from 'react';
import './Nav.css'
import { connect } from 'react-redux';
import { logout } from './Util';

let mapStateToProps = (state) => {
  return {
    is_admin: !state.admin_info.pending
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch({
      type: 'LOGIN_STATE_CHANGED',
      value: 'UNAUTH'
    }),

    set_view: (view, cb) => () => {
      dispatch({
        type: 'VIEW_CHANGED',
        value: view
      })
      if(typeof cb === 'function') {
        cb();
      }
    }
  }
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    let { is_admin, onLogout, set_view } = this.props;
    let nav_toggle_class = 'nav-toggle ' + (this.state.open ? 'nav-toggle-open' : 'nav-toggle-closed')
    let user_nav_items = null;
    let admin_nav_items = null;
    console.log(is_admin)
    let nav_item_class = this.state.open ? 'nav-item' : 'nav-item-idle'

    user_nav_items = <div>
      <div className={nav_item_class} onClick={set_view('HOME', this.toggle)}>Home</div>
      <div className={nav_item_class} onClick={set_view('EVENT_LIST', this.toggle)}>View Events</div>
      <div className={nav_item_class} onClick={set_view('VIEW_AUCTIONS', this.toggle)}>View Auctions</div>
    </div>

    if(is_admin) {
      admin_nav_items = <div>
        <div className={nav_item_class} onClick={set_view('VIEW_USERS', this.toggle)}>View Users</div>
        <div className={nav_item_class} onClick={set_view('VIEW_MENUS', this.toggle)}>View Menus</div>
        <div className={nav_item_class} onClick={set_view('CREATE_USER', this.toggle)}>Create Users</div>
        <div className={nav_item_class} onClick={set_view('CREATE_EVENT', this.toggle)}>Create Events</div>
        <div className={nav_item_class} onClick={set_view('CREATE_MENU', this.toggle)}>Create Menus</div>
        <div className={nav_item_class} onClick={set_view('CREATE_TICKET', this.toggle)}>Create Tickets</div>
        <div className={nav_item_class} onClick={set_view('CREATE_AUCTION', this.toggle)}>Create Auction</div>
        <div className={nav_item_class} onClick={set_view('CREATE_AUCTION_ITEM', this.toggle)}>Create Auction Items</div>
        <div className={nav_item_class} onClick={set_view('CREATE_TABLE', this.toggle)}>Create Tables</div>
      </div>
    }

    return <div className='nav'>
      {user_nav_items}
      {admin_nav_items}
      <div className={nav_item_class} onClick={set_view('SETTINGS', this.toggle)}>Settings</div>
      <div className={nav_item_class} onClick={logout(onLogout)}>Logout</div>
      <div className={nav_toggle_class} onClick={this.toggle}>Menu</div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
