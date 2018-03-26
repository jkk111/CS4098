import React from 'react';
import './Menu.css'
//import { Logger } from './Util'

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    let { expanded } = this.state;
    let { id, name, starters, mains, desserts, drinks, is_admin} = this.props;

    let content = null;
    let admin_content = null;

    let startersContent = []
    for (let starter of starters) {
      startersContent.push(<div>
        <span className='menu-content-key'>{starter.name}</span>
        <span className='menu-content-value'>{starter.description}</span>
      </div>)
    }

    let mainsContent = []
    for (let main of mains) {
      mainsContent.push(<div>
        <span className='menu-content-key'>{main.name}</span>
        <span className='menu-content-value'>{main.description}</span>
      </div>)
    }

    let dessertsContent = [];
    for (let dessert of desserts) {
      dessertsContent.push(<div>
        <span className='menu-content-key'>{dessert.name}</span>
        <span className='menu-content-value'>{dessert.description}</span>
      </div>)
    }

    let drinksContent = [];
    for (let drink of drinks) {
      drinksContent.push(<div>
        <span className='menu-content-key'>{drink.name}</span>
        <span className='menu-content-value'>{drink.description}</span>
      </div>)
    }

    if(expanded) {
      if(is_admin) {
        admin_content = <div className='admin-content'>
          <span className='menu-content-key'>Menu ID</span>
          <span className='menu-content-value'>{id}</span>
        </div>
      }
      content = <div className='menu-content'>
        <h3>Starters</h3>
        {startersContent}
        <h3>Mains</h3>
        {mainsContent}
        <h3>Desserts</h3>
        {dessertsContent}
        <h3>Drinks</h3>
        {drinksContent}
      </div>
    }

    let menu_class = expanded ? 'menu-expanded' : 'menu-collapsed'
    let clickable = (name!=null) ? name : <div className="user-content-button">view the menu</div>

    return <div className='menu' >
      <div className={menu_class} onClick={this.toggle}>{clickable}</div>
      {admin_content}
      {content}
    </div>
  }
}

export default Menu;
