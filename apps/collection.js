import React from 'react';
import {render} from 'react-dom';

import View from 'collection/components/View';
import {titles} from 'common/tags';

// Get the DOM Element that will host our React application
const root = document.getElementById('collection');

const tag = root.getAttribute('tag');

if(module.hot) {
  module.hot.accept();
}

// Render the React application to the DOM
render(
  <View tags={tag ? [tag] : undefined} />,
  root
);