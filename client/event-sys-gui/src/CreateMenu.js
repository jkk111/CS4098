import React from 'react';
import FloatText from './FloatText'
import './CreateMenu.css'

class MenuForm extends React.Component {
  constructor() {
    super();
    this.state = {
      starters: [
        { name: '' , description: '', allergens: ''}
      ],
      mains: [
        { name: '' , description: '', allergens: '' }
      ],
      desserts: [
        { name: '' , description: '', allergens: '' }
      ],
      drinks: [
        {name: '' , description: '', allergens: '' }
      ]
    };
    this.createMenu = this.createMenu.bind(this);
  }

  check(e) {
    let form = e.target;
    let starters = this.state.starters;
    let mains = this.state.mains;
    let desserts = this.state.desserts;
    let drinks = this.state.drinks;
    if(form.menu_name.value === '') {
      this.setState({
        name_error: 'Menu Name Cannot Be Empty'
      })
      return
    }

    if(starters.length === 0 && mains.length && desserts.length && drinks.length) {
      this.setState({
          course_error: 'Name Fields Cannot Be Empty'
      })
      return
    }

    for (let i = 0; i < starters.length; i++) {
      if(starters[i].name === '') {
        this.setState({
          course_error: 'Course Name Fields Cannot Be Empty, Enter "None" If You Dont Wish To Have A Particular Course'
        })
        return
      }
    }

    for (let i = 0; i < mains.length; i++) {
      if(mains[i].name === '') {
        this.setState({
          course_error: 'Course Name Fields Cannot Be Empty, Enter "None" If You Dont Wish To Have A Particular Course'
        })
        return
      }
    }

    for (let i = 0; i < desserts.length; i++) {
      if(desserts[i].name === '' ) {
        this.setState({
          course_error: 'Course Name Fields Cannot Be Empty, Enter "None" If You Dont Wish To Have A Particular Course'
        })
        return
      }
    }

    for (let i = 0; i < drinks.length; i++) {
      if(drinks[i].name === '' ) {
        this.setState({
          course_error: 'Course Name Fields Cannot Be Empty, Enter "None" If You Dont Wish To Have A Particular Course'
        })
        return
      }
    }
    return true;
  }

  async createMenu(e) {
    e.preventDefault();
    if(!this.check(e)) {
      return;
    }
    let form = e.target;
    console.dir(form);
    let menu = {
      name: form.menu_name.value,
      starters: this.state.starters,
      mains: this.state.mains,
      desserts: this.state.desserts,
      drinks: this.state.drinks
    }

    await fetch('/admin/create_menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(menu)
    })

    this.setState({
      starters: [
        { name: '' , description: '', allergens: ''}
      ],
      mains: [
        { name: '' , description: '', allergens: ''}
      ],
      desserts: [
        { name: '' , description: '', allergens: ''}
      ],
      drinks: [
        { name: '' , description: '', allergens: ''}
      ],
      name_error: null,
      course_error: null
    })

    form.reset();
  }

  add_entry(type) {
    return () => {
      let entries = this.state[type];
      this.setState({
        [type]: [ ...entries, { name: '' , description: '', allergens: ''} ]
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
      let modify = (objs, updated) => {
        let before = objs.slice(0, i);
        let after = objs.slice(i + 1);
        this.setState({
          [type]: [ ...before, updated, ...after ]
        })
      }

      let on_name_change = (e) => {
        let items = this.state[type];
        let item = { ...items[i] };
        item.name = e.target.value;
        modify(items, item)
      }

      let on_description_change = (e) => {
        let items = this.state[type];
        let item = { ...items[i] };
        item.description = e.target.value;
        modify(items, item)
      }

      let on_allergen_change = (e) => {
        let items = this.state[type];
        let item = { ...items[i] };
        item.allergens = e.target.value;
        modify(items, item)
      }

      let name_props = { onChange: on_name_change }
      let desc_props = { onChange: on_description_change }
      let allergen_props = { onChange: on_allergen_change }

      return <div className='menu-field' key={i}>
        <FloatText inputProps={name_props} name={`${type}-${i}`} label={`${str} #${i + 1} name`} className='menu' >
        </FloatText>
        <FloatText inputProps={desc_props} description={`${type}-${i}`} label={`${str} #${i + 1} description`} className='menu' >
        </FloatText>
        <FloatText inputProps={allergen_props} allergens={`${type}-${i}`} label={`${str} #${i + 1} allergens`} className='menu' >
          <span className='remove-item' onClick={this.remove_entry(type, i)}>X</span>
        </FloatText>
      </div>
    }
  }

  render_sections(...sections) {
    let {course_error = null} = this.state
    let rendered = [];
    if(course_error) {
      course_error = <div className='error'>
        {course_error}
      </div>
    }
    for(var section of sections) {
      console.log(section, sections)
      let str = section.slice(0, 1).toUpperCase() + section.slice(1, section.length - 1);
      let contents = this.state[section];
      contents = contents.map(this.build_list(section));
      let section_name = section.slice(0, 1).toUpperCase() + section.slice(1);;
      rendered.push(<React.Fragment key={section}>
        {course_error}
        <h1 className='menu-section'>{section_name}</h1>
        {contents}
        <button type='button' onClick={this.add_entry(section)} className='form-button'>Add {str}</button>
      </React.Fragment>)
    }
    return rendered;
  }

  render() {
    let{name_error = null} = this.state
     if(name_error) {
      name_error = <div className='error'>
        {name_error}
      </div>
    }
    return <form onSubmit={this.createMenu} autoComplete="off">
      {name_error}
      <FloatText name="menu_name" label="Menu Name:" />
      {this.render_sections('starters', 'mains', 'desserts', 'drinks')}
      <input type = 'submit' className = 'form-button' value = 'Create Menu'/>
    </form>
  }
}
export default MenuForm
