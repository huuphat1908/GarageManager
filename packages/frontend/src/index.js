import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { BrowserRouter as Router } from 'react-router-dom'

axios.defaults.baseURL = 'http://localhost:8080/';
axios.defaults.withCredentials = true

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);