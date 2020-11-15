import React, { Component } from 'react'

import { renderRoutes } from 'react-router-config'
import routes from '../routes'

import Navi from '../components/Navi'
import ErrorBoundary from '../components/ErrorBoundary'

class App extends Component {
  render() {
    return (
      <div>
        <header role="banner">
          <Navi />
        </header>

        <main className="section">
          <div className="container content">
            <ErrorBoundary>{renderRoutes(routes)}</ErrorBoundary>
          </div>
        </main>
      </div>
    )
  }
}

export default App
