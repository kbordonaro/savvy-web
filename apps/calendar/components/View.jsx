import React from 'react';
import Component from 'react-class';
import createHistory from 'history/createHashHistory';
import moment from 'moment';
import Ecwid from 'ecwid';

import Calendar from './Calendar';
import Workshop from './Workshop';

import workshops, {MONTHS} from '../events/workshops';
import url from 'common/url';

const history = createHistory({
  hashType: 'noslash'
});

// Main view of the Workshop Calendar.
class View extends Component {
  constructor(props, context) {
    super(props, context);

    // Map from hash value to event.
    this.eventMap = {};

    this.state = {
      selected: false,
      events: [],
      date: moment()
    };

    history.listen(() => {
      this.setState({
        selected: this.getWorkshop()
      }, () => {
        window.scrollTo(0, 0);
      });
    });
  }

  getWorkshop() {
    return location.hash ? this.eventMap[location.hash.substring(1)] : undefined;
  }

  componentWillMount() {
    this.getWorkshops();

    let getWorkshops = this.getWorkshops;
    Ecwid.OnAPILoaded.add(() => {
      Ecwid.OnOrderPlaced.add(() => {
        setTimeout(getWorkshops, 1000);
      });
    });
  }

  getWorkshops() {
    workshops(events => {
      events.forEach(event => {
        this.eventMap[event.id + '/' + event.start.getTime()] = event;
      });

     this.setState({
        events: events,
        selected: this.getWorkshop()
      });
    }, response => {
      this.setState({
        error: response
      });
    });
  }

  // Handle a month selection event from the toolbar.
  onMonth(date) {
    this.setState({
      date: date
    });
  }

  // Switch to the view to a an workshop view.
  onWorkshop(workshop) {
    this.setState({
      selected: workshop
    }, () => {
      window.scrollTo(0, 0);
      location.hash = (workshop.id + '/' + workshop.start.getTime());
    });
  }

  // Switch to the calendar view.
  onCalendar() {
    this.setState({
      selected: false
    }, () => {
      window.scrollTo(0, 0);
      location.hash = '';
    });
  }

  render() {
    if(this.state.error) {
      return (
        <div>
          <h1>Error Occured</h1>
          <h4>{this.state.error.status} - {this.state.error.statusText}</h4>
        </div>
      );
    } else {
      return (
        <div>
          {this.state.selected ? (
            <Workshop
              workshop={this.state.selected}
              onClose={this.onCalendar} />
          ) : (
            <Calendar
              months={MONTHS}
              date={this.state.date}
              events={this.state.events}
              onMonth={this.onMonth}
              onEvent={this.onWorkshop} />
          )}
        </div>
      );
    }
  }
}

export default View;