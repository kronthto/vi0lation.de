import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  generateSubscriptionBody,
  checkServiceWorkerSupported,
  checkPushNotificationsSupported,
  checkNotificationsSupported,
  checkNotificationDeniedByUser,
  push_updateSubscription,
  push_subscribe,
  sendPushToServer
} from '../utils/pushUtils'
import LoadBlock from './LoadBlock'
import classNames from 'classnames'
import { isNode } from '../utils/env'

const POSSIBLE_EVENTS = [
  { key: 'sp', name: 'Strategic Point (up to 4 min after spawn)' },
  { key: 'ms', name: 'Mothership (1 hour in advance)' },
  { key: 'op', name: 'Outpost (1 hour in advance)' },
  { key: 'nke', name: 'Nation Kill Event (up to 4 min after start)' },
  { key: 'custom', name: 'Custom/Manual notifications' }
]

class PushSub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonDisabled: false,
      isPushEnabled: null,
      buttonContent: 'Enable Notifications',
      errorMessage: null
    }
  }

  componentDidMount() {
    if (isNode) {
      return
    }
    if (!checkServiceWorkerSupported()) {
      this.changePushButtonState('incompatible')
      this.setState({
        errorMessage: 'Service workers are not supported by this browser!'
      })
      return
    }

    if (!checkPushNotificationsSupported()) {
      this.changePushButtonState('incompatible')
      this.setState({
        errorMessage: 'Push notifications are not supported by this browser!'
      })
      return
    }

    if (!checkNotificationsSupported()) {
      this.changePushButtonState('incompatible')
      this.setState({
        errorMessage: 'Notifications are not supported by this browser!'
      })
      return
    }

    if (!checkNotificationDeniedByUser()) {
      this.changePushButtonState('incompatible')
      this.setState({ errorMessage: 'Notifications are denied by the user!' })
      return
    }

    push_updateSubscription(this.changePushButtonState.bind(this))
  }

  render() {
    const {
      buttonDisabled,
      buttonContent,
      errorMessage,
      isPushEnabled
    } = this.state

    if (errorMessage) {
      return (
        <p className="notification is-danger">
          <strong>Not supported:</strong> Your browser doesn't provide all the
          features required to use push notifications.
          <br />
          Error: {errorMessage}
        </p>
      )
    }
    if (isPushEnabled === null) {
      return <LoadBlock height="250px" />
    }
    return (
      <div>
        <button
          className="button is-primary"
          disabled={buttonDisabled}
          onClick={this.changePushSubscriptionButton.bind(this)}
        >
          {buttonContent}
        </button>
        <hr />
        <div>
          {isPushEnabled ? (
            <div className="list is-hoverable">
              {POSSIBLE_EVENTS.map(eventDef => {
                const isActive =
                  this.props.subEvents.indexOf(eventDef.key) !== -1
                return (
                  <a
                    key={eventDef.key}
                    className={classNames('list-item', {
                      'is-active': isActive
                    })}
                    onClick={() => {
                      let newEvents = [...this.props.subEvents]
                      if (isActive) {
                        newEvents.splice(newEvents.indexOf(eventDef.key), 1)
                      } else {
                        newEvents.push(eventDef.key)
                      }
                      this.props.dispatch({
                        type: 'SET_EVENTS',
                        events: newEvents
                      })
                      sendPushToServer('PUT', this.state.pushSubCredBody)
                    }}
                  >
                    {eventDef.name}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  changePushSubscriptionButton() {
    if (this.state.isPushEnabled) {
      this.push_unsubscribe()
    } else {
      push_subscribe(this.changePushButtonState.bind(this))
    }
  }

  changePushButtonState(state, body) {
    switch (state) {
      case 'enabled':
        this.setState({
          buttonDisabled: false,
          buttonContent: 'Disable Notifications',
          isPushEnabled: true,
          pushSubCredBody: body
        })
        break
      case 'disabled':
        this.setState({
          buttonDisabled: false,
          buttonContent: 'Enable Notifications',
          isPushEnabled: false
        })
        break
      case 'computing':
        this.setState({ buttonDisabled: true, buttonContent: 'Please wait' })
        break
      case 'incompatible':
        this.setState({
          buttonDisabled: true,
          buttonContent:
            'Push notifications are not compatible with this browser'
        })
        break
      default:
        console.error('Unhandled push button state', state)
        break
    }
  }

  push_unsubscribe() {
    this.changePushButtonState('computing')

    // To unsubscribe from push messaging, you need to get the subscription object
    navigator.serviceWorker.ready
      .then(serviceWorkerRegistration =>
        serviceWorkerRegistration.pushManager.getSubscription()
      )
      .then(subscription => {
        // Check that we have a subscription to unsubscribe
        if (!subscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          this.changePushButtonState('disabled')
          return
        }

        // We have a subscription, unsubscribe
        // Remove push subscription from server
        let body = generateSubscriptionBody(subscription)

        return sendPushToServer('DELETE', body).then(() => subscription)
      })
      .then(subscription => subscription.unsubscribe())
      .then(() => this.changePushButtonState('disabled'))
      .catch(e => {
        // We failed to unsubscribe, this can lead to
        // an unusual state, so  it may be best to remove
        // the users data from your data store and
        // inform the user that you have done so
        console.error('Error when unsubscribing the user', e)
        this.changePushButtonState('disabled')
      })
  }
}

const mapStateToProps = state => {
  return {
    subEvents: state.push.events
  }
}

export default connect(mapStateToProps)(PushSub)
