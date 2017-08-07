import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Helmet } from 'react-helmet'
import routes from '../routes'
import NoMatch from '../components/NoMatch'

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

        <Switch>
          {routes.map(route => <Route key={route.path} {...route} />)}
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}

export default App
