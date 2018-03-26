import React from 'react';
import Event from './Event'
import { connect } from 'react-redux'

let mapStateToProps = (state) => {
  return {
    id: state.active_event,
    logged_in: state.logged_in !== 'UNAUTH'
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    close: () => {
      dispatch({ type: 'VIEW_CHANGED', value: 'HOME' })
    }
  }
}

class SingleEventView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.load = this.load.bind(this);
    this.close = this.close.bind(this);
    this.load()
  }

  async load() {
    let { id } = this.props;
    let resp = await fetch(`/event/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    let data = await resp.json();

    this.setState({
      data
    })
  }

  close() {
    if(this.props.close) {
      this.props.close();
    }
  }

  render() {
    let { data } = this.state;
    return <div>
      <Event { ...data} logged_in={this.props.logged_in} single_view={true} />
      <div className='form-button' onClick={this.close}>Back</div>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleEventView);