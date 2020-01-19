import React from 'react';
import Component from 'react-class';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Toolbar from './Toolbar';
import Event from './Event';
import './Calendar.less';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class Calendar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      now: Date.now()
    };

    this.components = {
      event: this.props.comp || Event
    };
  }

  // True if the event is disabled
  isDisabled(event) {
    let isPast = (event.start.getTime() < this.state.now);
    let isFull = (event.total <= event.registered);

    return !this.props.alwaysEnable && (isPast || isFull);
  }

  onEvent(event) {
    if(!this.isDisabled(event)) {
      this.props.onEvent(event);
    }
  }

  onNavigate() {
  }

  getEventProps(event) {
    return {
      className: (this.isDisabled(event) ? 'disabled' : event.type)
    }
  }

  render() {
    return (
      <div className='savvy-calendar'>
        <Toolbar
          date={this.props.date}
          onSelect={this.props.onMonth}
          months={this.props.months} />
        <BigCalendar
          className="big"
          defaultView='month'
          views={['month']}
          timeslots={1}
          toolbar={false}
          events={this.props.events}
          min={this.min}
          max={this.max}
          onSelectEvent={false}
          eventPropGetter={this.getEventProps}
          components={this.components}
          onNavigate={this.onNavigate}
          onSelectEvent={this.onEvent}
          date={this.props.date.toDate()} />
      </div>
    );
  }
}

Calendar.PropTypes = {
  events: React.PropTypes.array,
  date: React.PropTypes.object,
  onEvent: React.PropTypes.func,
  onMonth: React.PropTypes.func,
  months: React.PropTypes.number.isRequired,
  alwaysEnable: React.PropTypes.bool,
  comp: React.PropTypes.func
};

export default Calendar;