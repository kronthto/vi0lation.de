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

import { AsyncComponentProvider } from './vendor/react-async-component'

import toast from './utils/toast'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core'

const baseTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#006488'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#080325'
    }
  }
})

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
          <ThemeProvider theme={baseTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <App />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </ScrollToTop>
      </Router>
    </Provider>
  </AsyncComponentProvider>
)

let rehydratePromise = new Promise(resolve => {
  persistStore(store, { storage: localForage }, resolve)
})

const root = document.getElementById('root')
const preloader = document.getElementById('preloader')

Promise.all([rehydratePromise]).then(() => {
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
