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

    let startersContent = [<h3>Starters</h3>,<h3></h3>]
    for (let starter of starters) {
      startersContent.push(<span className='menu-content-key'>{starter.name}</span>)
      startersContent.push(<span className='menu-content-value'>{starter.description}</span>)
    }

    let mainsContent = [<h3>Mains</h3>,<h3></h3>]
    for (let main of mains) {
      mainsContent.push(<span className='menu-content-key'>{main.name}</span>)
      mainsContent.push(<span className='menu-content-value'>{main.description}</span>)
    }

    let dessertsContent = [<h3>Desserts</h3>,<h3></h3>];
    for (let dessert of desserts) {
      dessertsContent.push(<span className='menu-content-key'>{dessert.name}</span>)
      dessertsContent.push(<span className='menu-content-value'>{dessert.description}</span>)
    }

    let drinksContent = [<h3>Drinks</h3>,<h3></h3>];
    for (let drink of drinks) {
      drinksContent.push(<span className='menu-content-key'>{drink.name}</span>)
      drinksContent.push(<span className='menu-content-value'>{drink.description}</span>)
    }

    if(expanded) {
      if (is_admin){
        admin_content = <div className='admin-content'>
          <span className='menu-content-key'>Menu ID</span>
          <span className='menu-content-value'>{id}</span>
        </div>
      }
      content = <div className='menu-content'>
        {startersContent}
        {mainsContent}
        {dessertsContent}
        {drinksContent}
      </div>
    }

    let menu_class = expanded ? 'menu-expanded' : 'menu-collapsed'

    return <div className='menu' >
      <div className={menu_class} onClick={this.toggle}>{name}</div>
      {admin_content}
      {content}
    </div>
  }
}

export default Menu;
