import React, { Component } from 'react'

import { Helmet } from 'react-helmet'
import { renderRoutes } from 'react-router-config'
import routes from '../routes'

class App extends Component {
  render() {
    return (
      <div>
        <Helmet defaultTitle="Cool app" titleTemplate="%s - Cool app">
          <meta
            name="description"
            content="This is the default meta description"
          />
        </Helmet>

        {renderRoutes(routes)}
      </div>
    )
  }
}

export default App
