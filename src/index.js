import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/Router'
import createBrowserHistory from 'history/es/createBrowserHistory'

import './style/bulma.css'
import './index.css'
import ScrollToTop from './components/ScrollToTop'
import App from './containers/App'
import * as serviceWorker from './serviceWorker'

import toast from './utils/toast'

const app = (

      <Router history={createBrowserHistory()}>
        <ScrollToTop>
              <App />
        </ScrollToTop>
      </Router>
)

const root = document.getElementById('root')

  renderApp()

function renderApp() {
    ReactDOM.render(app, root)
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
