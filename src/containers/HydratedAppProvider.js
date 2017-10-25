import React, { Component } from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { persistStore } from 'redux-persist'
import localForage from 'localforage'

class HydratedAppProvider extends Component {
  getChildContext() {
    return { rehydrated: this.rehydrated }
  }

  componentWillMount() {
    this.rehydrated = new Promise(resolve => {
      persistStore(this.props.store, { storage: localForage }, () => {
        resolve()
      })
    })
  }

  render() {
    return <Provider store={this.props.store}>{this.props.children}</Provider>
  }
}

HydratedAppProvider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

HydratedAppProvider.childContextTypes = {
  rehydrated: PropTypes.object.isRequired
}

export default HydratedAppProvider
