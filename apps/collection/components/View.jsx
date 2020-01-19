import React from 'react';
import Component from 'react-class';
import createHistory from 'history/createHashHistory';

import Collection from './Collection';

import {titles} from 'common/tags';

const history = createHistory({
  hashType: 'noslash'
});

// Main view of the Workshop Calendar.
class View extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = this.parseHash();

    history.listen(() => {
      this.setState(this.parseHash(), () => {
        window.scrollTo(0, 0);
      });
    });
  }

  parseHash() {
    let result = {};

    if(location.hash) {
      result.enlarge = {id: location.hash.substring(1)};
    }

    return result;
  }

  render() {
    return (
      <Collection {...this.state} {...this.props} />
    );
  }
}

View.PropTypes = {
  tags: React.PropTypes.array
};

export default View;