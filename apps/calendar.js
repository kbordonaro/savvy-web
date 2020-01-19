import React from 'react';
import { render } from 'react-dom';
import View from './calendar/components/View';

// Get the DOM Element that will host our React application
const root = document.getElementById('calendar');

if(module.hot) {
  module.hot.accept();
}

// Render the React application to the DOM
render(
  <View />,
  root
);