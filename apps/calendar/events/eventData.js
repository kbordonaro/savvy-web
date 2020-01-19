import React from 'react';

import moment from 'moment';

import config from './eventConfig';
import {DateTypes, EventDate} from './EventDate';

export default {
  events: [
    config('byop',
      DateTypes.weekly, 'Saturday',
      '12:00 PM', '3:00 PM',
      'BYOP Workshop', 75.00,
      <div>
        <p>
          Breathe new life into an old tattered piece of furniture. Bring a piece of furniture
          you can carry with one hand (small side table, chair, picture frame, etc…) and learn
          how to use the Country Chic chalk/clay style furniture paints and finishes.  Our
          trained instructor will guide you while you paint and wax your masterpiece.  All
          furniture must be pre-approved prior to class. The workshop includes instructions,
          guidance and all supplies needed to complete your piece.
        </p>
      </div>
    ), config('byop_week',
      DateTypes.weekly, ['Wednesday', 'Thursday', 'Friday'],
      '4:00 PM', '7:00 PM',
      'BYOP Workshop', 75.00,
      <div>
        <p>
          Breathe new life into an old tattered piece of furniture. Bring a piece of furniture
          you can carry with one hand (small side table, chair, picture frame, etc…) and learn
          how to use the Country Chic chalk/clay style furniture paints and finishes.  Our
          trained instructor will guide you while you paint and wax your masterpiece.  All
          furniture must be pre-approved prior to class. The workshop includes instructions,
          guidance and all supplies needed to complete your piece.
        </p>
      </div>
    ), config('paint-101',
      DateTypes.weekly, ['Wednesday', 'Thursday', 'Friday', 'Sunday'],
      '12:00 PM', '3:00 PM',
      'Furniture Paint 101', 75.00,
      <div>
        <p>
          Do you have a worn piece of furniture or d&eacute;cor in need of a fresh facelift,
          but not sure how to approach it? Then come join us for this fun and exciting workshop.
          Learn all about the Country Chic’s paints and finishes and leave inspired.
          This workshop covers several different paint techniques on sample boards. You will
          also have the opportunity to experiment with the many waxes and finishes that
          Country Chic Paint has to offer.
        </p>
      </div>
    )
  ],
  excludes: [
    new EventDate(DateTypes.weekly, 'Monday'),
    new EventDate(DateTypes.date, moment('12/24', 'MM/DD')),
    new EventDate(DateTypes.date, moment('12/25', 'MM/DD')),
    new EventDate(DateTypes.date, moment('12/31', 'MM/DD')),
    new EventDate(DateTypes.date, moment('01/01', 'MM/DD')),
    new EventDate(DateTypes.date, moment('05/21/2017', 'MM/DD/YYYY')),
    new EventDate(DateTypes.date, moment('06/11/2017', 'MM/DD/YYYY')),
    new EventDate(DateTypes.date, moment('01/01', 'MM/DD').add(1, 'year'))
  ]
}