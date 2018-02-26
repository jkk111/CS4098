import React from 'react';
import ViewMenu from './ViewMenu'


class ViewMenus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      selected: false
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
    let { selected, menus } = this.state;

    if(selected !== false) {
      return <ViewMenu {...menus[selected]} />
    } else {
      menus = menus.map((menu, i) => {
        return <div key={i}>{menu.name}</div>
      });
      return menus;
    }
  }
}

export default ViewMenus