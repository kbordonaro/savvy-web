import React from 'react';
import Component from 'react-class';

import MediaQuery from 'react-responsive';

import moment from 'moment';

import './Toolbar.less';

class Toolbar extends Component {
  constructor(props, context) {
    super(props, context);

    // The dates.
    this.dates = [];

    for(let m=0; m < this.props.months; m++) {
      this.dates.push(moment().add(m, 'M'));
    };

    this.state = {
      selected: this.props.date
    }
  }

  onSelect(date) {
    this.setState({selected: date});
    this.props.onSelect(date);
  }

  renderButtons() {
    return this.dates.map((date, idx) => {
      let isSelected = (date.isSame(this.state.selected, 'month'));

      return (
        <div className='btn-group' role='group' key={'month' + idx}>
          <button type='button'
            disabled={isSelected}
            onClick={this.onSelect.bind(this, date)}
            className={'btn btn-cta ' + (isSelected ? 'btn-cta-primary' : 'btn-cta-secondary')}>
              {date.format('MMMM YYYY')}
          </button>
        </div>
      );
    });
  }

  render() {
    return (
    	<div className='savvy-toolbar'>
        <h2 className='savvy-title'>{this.state.selected.format('MMMM')} Workshops</h2>

        <MediaQuery
          minWidth={480}
          className='btn-group btn-group-justified'
          role='group'
          aria-label='Months'>
            {this.renderButtons()}
        </MediaQuery>
        <MediaQuery
          maxWidth={479}
          className='btn-group btn-group-vertical'
          role='group'
          aria-label='Months'>
            {this.renderButtons()}
        </MediaQuery>
      </div>
    );
  }
}

Toolbar.PropTypes = {
  date: React.PropTypes.object.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  months: React.PropTypes.number.isRequired
};

export default Toolbar;