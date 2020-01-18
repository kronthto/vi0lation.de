import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/Router'
import createBrowserHistory from 'history/es/createBrowserHistory'

import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import localForage from 'localforage'

import configureStore from './store'
import './style/bulma.css'
import './index.css'
import ScrollToTop from './components/ScrollToTop'
import App from './containers/App'
import * as serviceWorker from './serviceWorker'

import { AsyncComponentProvider } from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'

import toast from './utils/toast'

// If provided by server, use it, else let the reducers handle initial state
// const initialState = window.DATA || {}
export const store = configureStore()

const app = (
  <AsyncComponentProvider
    rehydrateState={window.ASYNC_COMPONENTS_STATE || { resolved: {} }}
  >
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </Router>
    </Provider>
  </AsyncComponentProvider>
)

let asyncBsPromise = asyncBootstrapper(app)

let rehydratePromise = new Promise(resolve => {
  persistStore(store, { storage: localForage }, resolve)
})

const root = document.getElementById('root')
const preloader = document.getElementById('preloader')

Promise.all([asyncBsPromise, rehydratePromise]).then(() => {
  renderApp()
})

function renderApp() {
  if (preloader) {
    ReactDOM.render(app, root)
  } else {
    ReactDOM.hydrate(app, root)
  }
}

serviceWorker.register({
  onUpdate: () =>
    toast.info({
      title: 'Update ready!',
      close: false,
      timeout: false,
      drag: false,
      message:
        'Close all open tabs with this site and reload to apply the latest version.',
      position: 'bottomLeft'
    })
})
