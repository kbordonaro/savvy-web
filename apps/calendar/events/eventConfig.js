import moment from 'moment';

import {DateTypes, EventDate} from './EventDate';

const createDateTime = (date, time) => {
    let result = moment(date.format('MM-DD-YYYY') + ' ' + time, 'MM-DD-YYYY hh:mm A').toDate();

    return result;
};

// Configuration object of events.
export default (id, dateType, dateValue, startTime, endTime, name, price, desc) => {
  let eventDate = new EventDate(dateType, dateValue);

  let idx = id.indexOf('_');
  let type = (idx !== -1) ? id.substring(0, idx) : id;

  return {
    getEvent(date) {
      if(eventDate.equals(date)) {
        return {
          id,
          type,
          title: '',
          start: createDateTime(date, startTime),
          end: createDateTime(date, endTime),
          name: name,
          price: price,
          desc: desc,
          priority: dateType
        }
      }

      return undefined;
    }
  };
}