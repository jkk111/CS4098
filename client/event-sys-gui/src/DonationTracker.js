import React from 'react';
import { connect } from 'react-redux'
import './DonationTracker.css'


const REFRESH_FREQ = 5000;

let mapStateToProps = (state) => {
  return { event_id: state.active_event }
}

class DonationTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { total: 0 }
    this.refresh = this.refresh.bind(this);
    this.refresh();
  }

  componentDidMount() {
    this.poll_timer = setInterval(this.refresh, REFRESH_FREQ);
  }

  componentWillUnmount() {
    clearInterval(this.poll_timer);
  }

  async refresh() {
    let { event_id } = this.props;
    let body = JSON.stringify({
      event_id
    })
    let resp = await fetch('/counter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    let { total } = await resp.json();

    this.setState({ total })
  }

  render() {
    let { total } = this.state;
    let raised = (total / 100).toFixed(2);
    return <div className='donation-tracker'>
      €{raised}
    </div>
  }
}

export default connect(mapStateToProps)(DonationTracker)