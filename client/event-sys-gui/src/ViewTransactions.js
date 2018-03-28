import React from 'react';
import { connect } from 'react-redux'
import './ViewTransactions.css'

let mapStateToProps = (state) => {
  return { id: state.active_event }
}

class ViewTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      transactions: []
    });
    this.fetchTransactions = this.fetchTransactions.bind(this);
    this.fetchTransactions();
  }

  async fetchTransactions(){
    let { id } = this.props;

    console.log('event_id: ', id);
    console.log('fetching transactions');

    let body = {
      event_id: id
    }
    let resp = await fetch('/admin/event_income_breakdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    resp = await resp.json();

    this.setState({
      transactions: resp
    })

    console.log('transactions: ', resp);
  }

  render() {
    let { transactions } = this.state;
    let { id } = this.props;

    if (transactions.length !== 0){
      transactions = transactions.map((transaction, i) => {
        let { id, user_id, amount, type } = transaction
        return <tr key={i}>
          <td>{id}</td>
          <td>{user_id}</td>
          <td>{amount}</td>
          <td>{type}</td>
        </tr>
      })

      return <div>
        <h3>Transactions for event {id}</h3>
        <table className="transactions">
        <thead>
          <tr className="titles">
            <td>ID</td>
            <td>USER ID</td>
            <td>AMOUNT</td>
            <td>TYPE</td>
          </tr>
        </thead>
        <tbody>
          {transactions}
        </tbody>
      </table>
      </div>
    } else {
      return <div>
        There are currently no transactions for the selected event
      </div>
    }
  }
}

export default connect(mapStateToProps)(ViewTransactions)
