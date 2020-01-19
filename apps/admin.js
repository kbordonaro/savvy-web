import React from 'react';
import { render } from 'react-dom';

import Admin from './admin/components/Admin';

// Get the DOM Element that will host our React application
const root = document.getElementById('admin');

if(module.hot) {
  module.hot.accept();
}

// Render the React application to the DOM
render(
  <Admin />,
  root
);