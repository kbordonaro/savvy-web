import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-class';

import moment from 'moment';

import './Event.less';

class Event extends Component {
  constructor(props, context) {
    super(props, context);

    // Initialize the state.
    this.state = {
      error: (props.event.registered > props.event.total),
      isPast: (props.event.start.getTime() < Date.now()),
      isFull: (props.event.registered == props.event.total)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      error: (props.event.registered > props.event.total),
      isPast: (props.event.start.getTime() < Date.now()),
      isFull: (props.event.registered == props.event.total)
    });
  }

  render() {
    return (
      <div className={
        'savvy-event' +
        (this.state.isFull ? ' full' : '') +
        (this.state.isPast ? ' past' : '') +
        (this.state.error ? ' error' : '')}>
      	  <div className='title'>
            {this.props.event.name}
          </div>
          <div className='time'>
            {this.props.event.registered} / {this.props.event.total}
          </div>
      </div>
    );
  }
}

export default Event;