import React from 'react';
import FloatText from './FloatText'
import './CreateMenu.css'

class MenuForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      allergens: '',
      starters: [{ name: '' , description: '', allergens: ''}],
      sides: [{ name: '' , description: '', allergens: '' }],
      mains: [{ name: '' , description: '', allergens: '' }],
      desserts: [{ name: '' , description: '', allergens: ''}],
      drinks: [{name: '' , description: '', allergens: '' }]
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let {starters, sides, mains, desserts, drinks } = this.state;
    alert(` Added: ${starters.length} starters`+
    	  `\n Added: ${sides.length} sides`+
          `\n Added: ${mains.length} mains`+
          `\n Added: ${desserts.length} desserts`+
          `\n Added: ${drinks.length} drinks`);
  }

  add_entry(type) {
    return () => {
      let entries = this.state[type];
      this.setState({
        [type]: [ ...entries, { name: '' } ]
      })
    }
  }

  remove_entry(type, index) {
    return () => {
      let entries = this.state[type];
      let before = entries.slice(0, index);
      let after = entries.slice(index + 1);
      this.setState({
        [type]: [ ...before, ...after ]
      });
    }
  }

  build_list(type) {
    let str = type.slice(0, 1).toUpperCase() + type.slice(1, type.length - 1);
    return (item, i) => {
      return <div className='menu-field' key={i}>
        <FloatText name={`${type}-${i}`} label={`${str} #${i + 1} name`} >
        </FloatText>
        <FloatText description={`${type}-${i}`} label={`${str} #${i + 1} description`} >
        </FloatText>
        <FloatText allergens={`${type}-${i}`} label={`${str} #${i + 1} allergens`} >
          <span className='remove-item' onClick={this.remove_entry(type, i)}>X</span>
        </FloatText>
      </div>
    }
  }

  render_sections(...sections) {
    let rendered = [];
    for(var section of sections) {
      console.log(section, sections)
      let str = section.slice(0, 1).toUpperCase() + section.slice(1, section.length - 1);
      let contents = this.state[section];
      contents = contents.map(this.build_list(section));
      rendered.push(<React.Fragment key={section}>
        <h4>{section}</h4>
        {contents}
        <button type='button' onClick={this.add_entry(section)} className='form-button'>Add {str}</button>
      </React.Fragment>)
    }
    return rendered;
  }

  render() {
    return <form onSubmit={this.handleSubmit}>
      {this.render_sections('starters', 'sides', 'mains', 'desserts', 'drinks')}
      <div>
        <input type = 'submit' className = 'form-button' value = 'Create Menu'/>
      </div>
    </form>
  }

  // render() {
  //   let { starters, sides, mains, desserts } = this.state;
  //   starters = starters.map(this.build_list('starters'))
  //   sides = sides.map(this.build_list('sides'))
  //   mains = mains.map(this.build_list('mains'))
  //   desserts = desserts.map(this.build_list('desserts'))
  //   console.log(starters)
  //   return (
  //     <form onSubmit={this.handleSubmit}>
  //       <h4>Starters</h4>
  //       {starters}
  //       <button type="button" onClick={this.handleAddStarter} className="form-button">Add Starter</button>


  //       <h4>Sides</h4>
  //       {sides}
  //       <button type="button" onClick={this.handleAddSide} className="form-button">Add Side</button>


  //       <h4>Mains</h4>
  //       {mains}
  //       <button type="button" onClick={this.handleAddMain} className="form-button">Add Main</button>


  //       <h4>Desserts</h4>
  //       {desserts}
  //       <button type="button" onClick={this.handleAddDessert} className="form-button">Add Dessert</button>

  //       <div>

  //         <button>Confirm Selection</button>
  //       </div>
  //     </form>

  //   )
  // }
}
export default MenuForm
