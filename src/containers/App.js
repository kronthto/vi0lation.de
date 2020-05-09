import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Helmet } from 'react-helmet'
import { renderRoutes } from 'react-router-config'
import routes from '../routes'

import Navi from '../components/Navi'
import Footer from '../components/Footer'
import ErrorBoundary from '../components/ErrorBoundary'

import { isBrowser } from '../utils/env'
import { canUsePush, push_updateSubscription } from '../utils/pushUtils'

const defaultMeta = () => {
  return (
    <Helmet defaultTitle="ChromeRivals-Tools" titleTemplate="%s - CR-Tools">
      <meta
        name="description"
        content="Tools, statistics and tracking of ChromeRivals"
      />
    </Helmet>
  )
}

class App extends Component {
  componentDidMount() {
    if (isBrowser && canUsePush() && navigator.onLine) {
      push_updateSubscription(() => {})
    }
  }

  render() {
    return (
      <div>
        {defaultMeta()}

        <header role="banner">
          <Navi />
        </header>

        <main className="section">
          <div className="container content">
            <noscript>
              <div className="notification is-warning">
                Please enable JavaScript in your browser to be able to use all
                features of the site.
              </div>
            </noscript>
            <ErrorBoundary>{renderRoutes(routes)}</ErrorBoundary>
          </div>
        </main>

        <Footer />
      </div>
    )
  }
}

export default connect(null, null, null, { pure: false })(App)
