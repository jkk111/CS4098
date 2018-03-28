import React from 'react';
import Menu from './Menu'
class ViewMenus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      selected: false
    }

    this.menu_selected = this.menu_selected.bind(this);
    this.get_menus();
  }

  async get_menus() {
    let resp = await fetch('/admin/menus');
    let menus = await resp.json();
    this.setState({
      menus
    });
  }

  menu_selected(index) {
    return (e) => {
      this.setState({
        selected: index
      })
    }
  }

  render() {
    let { menus } = this.state;

    menus = menus.map((menu, i) => <Menu refresh={this.refresh} {...menu} key={i} />)
    return menus
  }
}

export default ViewMenus
