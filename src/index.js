import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/Router'
import createBrowserHistory from 'history/es/createBrowserHistory'

import configureStore from './store'
import './style/bulma.css'
import 'flatpickr/dist/themes/material_blue.css'
import 'izitoast/dist/css/iziToast.min.css'
import './index.css'
import HydratedAppProvider from './containers/HydratedAppProvider'
import ScrollToTop from './components/ScrollToTop'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

// If provided by server, use it, else let the reducers handle initial state
// const initialState = window.DATA || {}
const store = configureStore()

ReactDOM.hydrate(
  <HydratedAppProvider store={store}>
    <Router history={createBrowserHistory()}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
  </HydratedAppProvider>,
  document.getElementById('root')
)
registerServiceWorker()
