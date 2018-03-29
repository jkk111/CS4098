import React from 'react';
import './Seating.css'

class Seating extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      expanded: false
    })
    this.toggle = this.toggle.bind(this);
    this.buildTable = this.buildTable.bind(this);
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  buildTable(){
    let { attendees } = this.props;
    let out = [];
    if (attendees.length !== 0){
      for (let i=0; i<attendees.length; i++){
        let name = attendees[i].f_name + " " + attendees[i].l_name
        let id = attendees[i].user_id
        let tableNumber = (Math.floor (i / 10)) + 1
        let seatNumber = (i % 10) + 1
        out.push(
          <tr key={i}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{tableNumber}</td>
            <td>{seatNumber}</td>
          </tr>
        )
      }
    }
    return out
  }

  render() {
    let { attendees } = this.props;
    let { expanded } = this.state;
    let content = null;
    let button = null;

    if (attendees.length === 0){
      content = <p>This event has no attendees</p>
    } else {
      button = <div className="user-content-button" onClick={this.toggle}>Show Seating Arrangements</div>
      if (expanded){
        let tableData = this.buildTable();
        content = <div>
          <h3>Seating for event </h3>
          <table className="seating">
            <thead>
              <tr className="titles">
                <td>USER ID</td>
                <td>NAME</td>
                <td>TABLE NUMBER</td>
                <td>SEAT NUMBER</td>
              </tr>
            </thead>
            <tbody>
              {tableData}
            </tbody>
            </table>
          </div>
        }
      }

    return <div>
    {button}
      {content}
    </div>
  }
}

export default Seating
