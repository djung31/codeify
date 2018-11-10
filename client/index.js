import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import './style.css'
import 'bulma/css/bulma.css'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

// establishes socket connection
// import './socket'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
