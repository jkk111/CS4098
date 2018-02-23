import React from 'react';
import FloatText from './FloatText'
import './CreateMenu.css'

class MenuForm extends React.Component {
  constructor() {
    super();
    this.state = {
      //name: '',
      //description: '',
      //allergens: '',
      starters: [{ name: '' , description: '', allergens: ''}],
      mains: [{ name: '' , description: '', allergens: '' }],
      desserts: [{ name: '' , description: '', allergens: ''}],
      drinks: [{name: '' , description: '', allergens: '' }]
    };
    this.createMenu = this.createMenu.bind(this);
  }

  async createMenu(e){
    e.preventDefault();
      let {starters, mains, desserts, drinks } = this.state;
      alert(` Added: ${starters.length} starters.map`+
            `\n Added: ${mains.length} mains`+
            `\n Added: ${desserts.length} desserts`+
            `\n Added: ${drinks.length} drinks`);
    let form = e.target;
    let body = {
      menu_name: form.menu_name.value
    }
    console.log('creating menu', body);
    let resp = await fetch('/admin/create_menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    console.log(resp);
    //Logger.log("Create Menu Response", await resp.json())
    form.reset();
  }

//  handleSubmit = (e) => {
//    e.preventDefault();
//    let {starters, sides, mains, desserts, drinks } = this.state;
//    alert(` Added: ${starters.length} starters`+
//          `\n Added: ${mains.length} mains`+
//          `\n Added: ${desserts.length} desserts`+
//          `\n Added: ${drinks.length} drinks`);
//  }

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
    return <form onSubmit={this.createMenu} autoComplete="off">
      <FloatText name="menu_name" label="Menu Name:" />
      {this.render_sections('starters', 'mains', 'desserts', 'drinks')}
      <input type = 'submit' className = 'form-button' value = 'Create Menu'/>
      <div classname = "mine">
      <h1> 1. Cereals containing gluten, namely: wheat (such as spelt and khorasan wheat), rye, barley, 
      oats or their hybridised strains, and products thereof, except:

(a) wheat based glucose syrups including dextrose
(b) wheat based maltodextrins
(c) glucose syrups based on barley
(d) cereals used for making alcoholic distillates including ethyl alcohol of agricultural origin

2. Crustaceans and products thereof

3. Eggs and products thereof

4. Fish and products thereof, except:

(a) fish gelatine used as carrier for vitamin or carotenoid preparations
(b) fish gelatine or Isinglass used as fining agent in beer and wine

5. Peanuts and products thereof

6. Soybeans and products thereof, except:

(a) fully refined soybean oil and fat
(b) natural mixed tocopherols (E306), natural D-alpha tocopherol, natural D-alpha tocopherol acetate, 
and natural D-alpha tocopherol succinate from soybean sources
(c) vegetable oils derived phytosterols and phytosterol esters from soybean sources
(d) plant stanol ester produced from vegetable oil sterols from soybean sources

7. Milk and products thereof (including lactose), except:

(a) whey used for making alcoholic distillates including ethyl alcohol of agricultural origin
(b) lactitol

8. Nuts, namely: almonds (Amygdalus communis L.), hazelnuts (Corylus avellana), walnuts (Juglans regia),
 cashews (Anacardium occidentale), pecan nuts (Carya illinoinensis (Wangenh.) K. Koch), Brazil nuts 
 (Bertholletia excelsa), pistachio nuts (Pistacia vera), macadamia or Queensland nuts (Macadamia ternifolia),
  and products thereof, except for nuts used for making alcoholic distillates including ethyl alcohol of agricultural origin

9. Celery and products thereof

10. Mustard and products thereof

11. Sesame seeds and products thereof

12. Sulphur dioxide and sulphites at concentrations of more than 10 mg/kg or 10 mg/litre in terms of the 
total SO2 which are to be calculated for products as proposed ready for consumption or as reconstituted 
according to the instructions of the manufacturers

13. Lupin and products thereof

14. Molluscs and products thereof

 </h1>
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
