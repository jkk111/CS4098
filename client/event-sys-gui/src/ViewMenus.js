import React from 'react';
import ViewMenu from './ViewMenu'


class ViewMenus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: []
    }
  }

  get_menus() {
    let resp = await fetch('/admin/menus');
    let menus = await resp.json();
    this.setState({
      menus
    });
  }

  menu_selected() {

  }

  render() {

  }
}

export default ViewMenus