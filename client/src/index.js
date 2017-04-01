/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import './styles/index.css';

const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = 'https://safe-cliffs-78756.herokuapp.com/';

export const APP_HOST = PROD_HOST;

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <BrowserRouter>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </BrowserRouter>,
      document.getElementById('root')
    );
  });
}
