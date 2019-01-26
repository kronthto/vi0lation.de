import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/Router'
import createBrowserHistory from 'history/es/createBrowserHistory'

import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import localForage from 'localforage'

import configureStore from './store'
import './style/bulma.css'
import 'flatpickr/dist/themes/material_blue.css'
import 'izitoast/dist/css/iziToast.min.css'
import './index.css'
import ScrollToTop from './components/ScrollToTop'
import App from './containers/App'
import * as serviceWorker from './serviceWorker'

// If provided by server, use it, else let the reducers handle initial state
// const initialState = window.DATA || {}
const store = configureStore()

// async-bootstrap init -> Add Promise to all stack

let rehydratePromise = new Promise(resolve => {
  persistStore(store, { storage: localForage }, resolve)
})

const root = document.getElementById('root')
let history = createBrowserHistory()

Promise.all([rehydratePromise]).then(() => {
  renderApp()
})

function renderApp() {
  ReactDOM.hydrate(
    <Provider store={store}>
      <Router history={history}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </Router>
    </Provider>,
    root
  )
}

serviceWorker.register()
