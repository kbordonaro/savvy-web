import moment from 'moment';

import url from 'common/url';
import events from './events';

export const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const MONTHS = 3;

export default (success, failure) => {
  $.ajax({
    method: 'GET',
    url: url('scripts/workshop.php')
  }).done((workshops) => {
    // Make a map from date to workshop.
    let workshopMap = {};
    if(workshops) {
      workshops = JSON.parse(workshops).forEach(workshop => {
        workshopMap[workshop.date] = workshop.count;
      });
    }

    // Process the events for the coming months.
    let allEvents = events(MONTHS);

    allEvents.forEach((event) => {
      switch(event.id) {
        case 'paint-101':
          event.total = 8;
          break;
        case 'byop':
          event.total = 4;
          break;
        default:
          event.total = 4;
          break;
      }

      event.registered = workshopMap[moment(event.start).format(DATE_FORMAT)] || 0;
    });

    success(allEvents);
  }).fail(failure);
}
