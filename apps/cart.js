import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Get the DOM Element that will host our React application
const root = document.getElementById('cart');

if(module.hot) {
  module.hot.accept();
}

// Render the React application to the DOM
render(
  <AppContainer>
    <div>Shopping Cart</div>
  </AppContainer>,
  root
);