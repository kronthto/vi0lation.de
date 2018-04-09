import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Helmet } from 'react-helmet'
import renderRoutes from 'react-router-config/renderRoutes'
import routes from '../routes'

import Navi from '../components/Navi'
import Footer from '../components/Footer'

import { fetchCmsIfNeeded } from '../actions/cms'

const defaultMeta = () => {
  return (
    <Helmet defaultTitle="Vi0" titleTemplate="%s - Vi0">
      <meta
        name="description"
        content="Vi0lation brigade website and AirRivals ranking"
      />
    </Helmet>
  )
}

export const queryData = dispatch => {
  return dispatch(fetchCmsIfNeeded('all'))
}

class App extends Component {
  static fetchData(store) {
    return queryData(store.dispatch)
  }

  componentDidMount() {
    this.context.rehydrated.then(() => {
      queryData(this.props.dispatch)
    })
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
            {renderRoutes(routes)}
          </div>
        </main>

        <Footer />
      </div>
    )
  }
}

App.contextTypes = {
  rehydrated: PropTypes.object.isRequired
}

export default connect(null, null, null, { pure: false })(App)
