import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import configureStore from './store'
import './index.css'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

// If provided by server, use it, else let the reducers handle initial state
const initialState = window.DATA ? window.DATA : {}
const store = configureStore(initialState)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
