import React, { Component } from 'react'

import { Helmet } from 'react-helmet'
import { renderRoutes } from 'react-router-config'
import routes from '../routes'

import Navi from '../components/Navi'
import Footer from '../components/Footer'

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

class App extends Component {
  render() {
    return (
      <div>
        {defaultMeta()}

        <header role="banner">
          <Navi />
        </header>

        <main className="section">
          <div className="container content">{renderRoutes(routes)}</div>
        </main>

        <Footer />
      </div>
    )
  }
}

export default App
