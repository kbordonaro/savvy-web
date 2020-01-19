/**
 * The type of events mapped to there priority.
 */
const DateTypes = {
  // Occurs every day
  daily: 0,

  // Occurs every week
  weekly: 1,

  // Occurs every month
  monthly: 2,

  // Occurs on a given date
  date: 3
};

// value format:
// daily = undefined
// weekly = 'Sunday'|'Monday'|...
// monthly = {week: 1|2|3|4, day: 'Sunday'|'Monday'|...}
// date = moment

class EventDate {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  // True, if the date an event date. 
  equals(moment) {
    let result;

    switch(this.type) {
      case DateTypes.daily:
        result = true;
        break;
      case DateTypes.weekly:
        let date = moment.format('dddd');
        if(this.value.length) {
          result = (this.value.indexOf(date) != -1);
        } else {
          result = (date === this.value);
        }
        break;
      case DateTypes.monthly:
        result =
            (Math.ceil(moment.date() / 7) === this.value.week) &&
            (moment.format('dddd') === this.value.day);
        break;
      case DateTypes.date:
        result = moment.isSame(this.value, 'd');
        break;
      default:
        console.error("Unsupported type: " + this.type);
        break;
    }

    return result;
  }
}

export { DateTypes, EventDate };
