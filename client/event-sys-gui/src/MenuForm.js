import React from 'react';

class MenuForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      starters: [{ name: '' }],
      sides: [{ name: '' }],
      mains: [{ name: '' }],
      desserts: [{ name: '' }],
    };
  }

  // ...

  handleStarterNameChange = (idx) => (evt) => {
    const newStarters = this.state.starters.map((starter, sidx) => {
      if (idx !== sidx) return starter;
      return { ...starter, name: evt.target.value };
    });

    this.setState({ starters: newStarters });
  }

  handleSideNameChange = (idx) => (evt) => {
    const newSides = this.state.sides.map((side, sidx) => {
      if (idx !== sidx) return side;
      return { ...side, name: evt.target.value };
    });

    this.setState({ sides: newSides });
  }

  handleMainNameChange = (idx) => (evt) => {
    const newMains = this.state.mains.map((main, sidx) => {
      if (idx !== sidx) return main;
      return { ...main, name: evt.target.value };
    });

    this.setState({ mains: newMains });
  }

  handleDessertNameChange = (idx) => (evt) => {
    const newDesserts = this.state.desserts.map((dessert, sidx) => {
      if (idx !== sidx) return dessert;
      return { ...dessert, name: evt.target.value };
    });

    this.setState({ desserts: newDesserts });
  }

  handleSubmit = (evt) => {
    const { name, starters, sides, mains, desserts } = this.state;
    alert(`Added: ${name} with ${starters.length} starters`);
    alert(`Added: ${name} with ${sides.length} sides`);
    alert(`Added: ${name} with ${mains.length} mains`);
    alert(`Added: ${name} with ${desserts.length} desserts`);
  }

  handleAddStarter = () => {
    this.setState({
      starters: this.state.starters.concat([{ name: '' }])
    });
  }

  handleAddSide = () => {
    this.setState({
      sides: this.state.sides.concat([{ name: '' }])
    });
  }

  handleAddMain = () => {
    this.setState({
      mains: this.state.mains.concat([{ name: '' }])
    });
  }

  handleAddDessert = () => {
    this.setState({
      desserts: this.state.desserts.concat([{ name: '' }])
    });
  }

  handleRemoveStarter = (idx) => () => {
    this.setState({
      starters: this.state.starters.filter((s, sidx) => idx !== sidx)
    });
  }

  handleRemoveSide = (idx) => () => {
    this.setState({
      sides: this.state.sides.filter((s, sidx) => idx !== sidx)
    });
  }

  handleRemoveMain = (idx) => () => {
    this.setState({
      mains: this.state.mains.filter((s, sidx) => idx !== sidx)
    });
  }

  handleRemoveDessert = (idx) => () => {
    this.setState({
      desserts: this.state.desserts.filter((s, sidx) => idx !== sidx)
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* ... */}
        <h4>Starters</h4>

        {this.state.starters.map((starter, idx) => (
          <div className="starter">
            <input
              type="text"
              placeholder={`Starter #${idx + 1} name`}
              value={starter.name}
              onChange={this.handleStarterNameChange(idx)}
            />
            <button type="button" onClick={this.handleRemoveStarter(idx)} className="small">-</button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddStarter} className="small">Add Starter</button>
        <button>Confirm Selection</button>

        <h4>Mains</h4>

        {this.state.sides.map((side, idx) => (
          <div className="side">
            <input
              type="text"
              placeholder={`Side #${idx + 1} name`}
              value={side.name}
              onChange={this.handleSideNameChange(idx)}
            />
            <button type="button" onClick={this.handleRemoveSide(idx)} className="small">-</button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddSide} className="small">Add Side</button>
        <button>Confirm Selection</button>

        <h4>Sides</h4>

        {this.state.mains.map((main, idx) => (
          <div className="main">
            <input
              type="text"
              placeholder={`Main #${idx + 1} name`}
              value={main.name}
              onChange={this.handleMainNameChange(idx)}
            />
            <button type="button" onClick={this.handleRemoveMain(idx)} className="small">-</button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddMain} className="small">Add Main</button>
        <button>Confirm Selection</button>

        <h4>Desserts</h4>

        {this.state.desserts.map((dessert, idx) => (
          <div className="dessert">
            <input
              type="text"
              placeholder={`Dessert #${idx + 1} name`}
              value={dessert.name}
              onChange={this.handleDessertNameChange(idx)}
            />
            <button type="button" onClick={this.handleRemoveDessert(idx)} className="small">-</button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddDessert} className="small">Add Dessert</button>
        <button>Confirm Selection</button>
      </form>

    )
  }
}
export default MenuForm