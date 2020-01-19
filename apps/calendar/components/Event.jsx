import React from 'react';
import ReactDOM from 'react-dom';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import Truncate from 'react-truncate';
import Component from 'react-class';

import moment from 'moment';

import './Event.less';

class Event extends Component {
  constructor(props, context) {
    super(props, context);

    // Initialize the state.
    this.state = {
      start: undefined,
      end: undefined,
      placement: undefined,
      disabled: undefined,
      popup: undefined
    };

    // Initialize the popover placement.
    switch(props.event.start.getDay()) {
      case 0:
        this.state.placement = 'right';
        break;
      case 6:
        this.state.placement = 'left';
        break;
      default:
        this.state.placement = 'top'
        break;
    }

    // Initialze the time.
    let timeFormat = 'h A';
    this.state.start = moment(this.props.event.start).format(timeFormat);
    this.state.end = moment(this.props.event.end).format(timeFormat);

    // Initialize the popover message
    let openSeats = props.event.total - props.event.registered;
    let isPast = (props.event.start.getTime() < Date.now());
    let isFull = (openSeats <= 0);

    // The cell is diabled if it is in the past or fill.
    this.state.disabled = (isPast || isFull) ? 'disabled' : undefined;
    let className = 'savvy-hover ' + (this.state.disabled || props.event.type);

    let message = undefined;
    if(isPast) {
      message = <p className='closed'>Sorry, Registration has Closed!</p>;
    } else if(isFull) {
      message = <p className='closed'>Sorry, this Workshop is Full!</p>;
    } else {
      message = <p className='open'>{openSeats} seat{openSeats === 1 ? ' is' : 's are'} open!</p>;
    }

    this.state.popover = (
      <Popover
        className={className}
        id={'event-' + props.event.start.getTime()}
        title={props.event.name}>
          <div className='content'>
            <h4>{moment(props.event.start).format('ddd. MMM. DD, YYYY')}</h4>
            <h5>{this.state.start} - {this.state.end}</h5>
            {message}
            <Truncate lines={3} ellipsis={<span>...</span>}>
              <div className='desc'>
                {props.event.desc}
              </div>
            </Truncate>
          </div>
      </Popover>
    );
  }

  render() {
    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement={this.state.placement}
        overlay={this.state.popover}>
          <div className='savvy-event'>
        	  <div className='title'>
              {this.props.event.name}
            </div>
            <div className='time'>
              {this.state.start} - {this.state.end}
            </div>
          </div>
      </OverlayTrigger>
    );
  }
}

export default Event;