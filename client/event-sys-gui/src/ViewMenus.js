import React from 'react';
import ViewMenu from './ViewMenu'


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
    let { selected, menus } = this.state;

    if(selected !== false) {
      return <ViewMenu {...menus[selected]} />
    } else {
      menus = menus.map((menu, i) => {
        return <div key={i} onClick={this.menu_selected(i)}>{menu.name}</div>
      });
      console.log(menus);
      return menus;
    }
  }
}

export default ViewMenus