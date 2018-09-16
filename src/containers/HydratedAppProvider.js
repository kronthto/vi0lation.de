import React, { Component } from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import { persistStore } from 'redux-persist'
import localForage from 'localforage'
import toast from '../utils/toast'

class HydratedAppProvider extends Component {
  getChildContext() {
    // TODO: Use new context API
    return { rehydrated: this.rehydrated }
  }

  componentWillMount() {
    let resolved = false
    this.rehydrated = new Promise(resolve => {
      let success = () => {
        resolve()
        resolved = true
      }
      persistStore(this.props.store, { storage: localForage }, () => {
        success()
      })
      let errorHandler = () => {
        if (!resolved) {
          toast.warning({
            timeout: false,
            message:
              "Could not connect to your device's storage to store data for offline-usage of this site. Please check the storage permissions and cookie settings or disable incognito-mode."
          })
          success()
        }
      }
      localForage.ready().catch(errorHandler)
      setTimeout(errorHandler, 9000)
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
