import moment from 'moment';

import data from './eventData';

let getEvents = (month) => {
  let days = month.daysInMonth();
  let result = [];
  for(let d = 1; d <= days; d++) {
    month.date(d);

    let exclude = data.excludes.some(ex => ex.equals(month));
    if(!exclude) {
      let events = [];

      data.events.forEach(next => {
        let newEvent = next.getEvent(month);

        if(newEvent) {
          // The event is valid for this day, determine if it is conflicts
          // with any other date.

          let conflicts = events.some((oldEvent, idx) => {
            if(moment(newEvent.start).isBetween(oldEvent.start, oldEvent.end) ||
               moment(newEvent.end).isBetween(oldEvent.start, oldEvent.end)) {
              // The events conflict, determine is the new date overwrites the old date.
              if(newEvent.priority > oldEvent.priority) {
                // The new event has priority, replace the old event.
                events[idx] = newEvent;
              }

              // No other dates should conflict, we are done.
              return true;
            }

            return false;
          });

          if(!conflicts) {
            // No conflict found, add the new event.
            events.push(newEvent);
          }
        }
      });

      if(events.length > 0) {
        // Add the events.
        result = result.concat(events);
      }
    }
  }

  return result;
};

export default (months) => {
  let result = [];
  for(let m=0; m<months; m++) {
    result = result.concat(getEvents(moment().add(m, 'M')));
  }

  return result;
};