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
    })
  }
}

class Nav extends React.Component {
  render() {
    let { is_admin, onLogout } = this.props;
    return <div className='nav'>
      <div className='nav-item'>Home</div>
      <div className='nav-item' onClick={logout(onLogout)}>Logout</div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);