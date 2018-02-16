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

    set_view: (view) => () => dispatch({
      type: 'VIEW_CHANGED',
      value: view
    })
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
      <div className={nav_item_class} onClick={set_view('HOME')}>Home</div>
      <div className={nav_item_class} onClick={set_view('SETTINGS')}>Settings</div>
    </div>

    if(is_admin) {
      admin_nav_items = <div>
        <div className={nav_item_class} onClick={set_view('CREATE_USER')}>Create User</div>
      </div>
    }

    return <div className='nav'>
      {user_nav_items}
      {admin_nav_items}
      <div className={nav_item_class} onClick={logout(onLogout)}>Logout</div>
      <div className={nav_toggle_class} onClick={this.toggle}>Menu</div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);