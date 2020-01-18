import { callApiChecked } from '../middleware/api'
import config from '../config'

const applicationServerKey =
  'BKj3l3KSXQlD52OW8NszYbgGYmIuk_BUevF5u7TDTfaY9HDtPO_iwcYHgY1jpAkBouP5MwdQ2B-45acMXZMDVRg'

export function checkServiceWorkerSupported() {
  return 'serviceWorker' in navigator
}

export function checkPushNotificationsSupported() {
  return 'PushManager' in window
}

export function checkNotificationsSupported() {
  return 'showNotification' in ServiceWorkerRegistration.prototype
}

export function checkNotificationDeniedByUser() {
  // Check the current Notification permission.
  // If its denied, the button should appears as such, until the user changes the permission manually
  return Notification.permission !== 'denied'
}

export function canUsePush() {
  return (
    checkServiceWorkerSupported() &&
    checkPushNotificationsSupported() &&
    checkNotificationsSupported() &&
    checkNotificationDeniedByUser()
  )
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function generateSubscriptionBody(subscription) {
  const key = subscription.getKey('p256dh')
  const token = subscription.getKey('auth')
  return {
    endpoint: subscription.endpoint,
    key: key
      ? btoa(String.fromCharCode.apply(null, new Uint8Array(key)))
      : null,
    token: token
      ? btoa(String.fromCharCode.apply(null, new Uint8Array(token)))
      : null
  }
}

export function push_updateSubscription(stateCallback) {
  navigator.serviceWorker.ready
    .then(serviceWorkerRegistration =>
      serviceWorkerRegistration.pushManager.getSubscription()
    )
    .then(subscription => {
      if (!subscription) {
        stateCallback('disabled')
        // We aren't subscribed to push, so set UI to allow the user to enable push
        return
      }

      // Keep your server in sync with the latest endpoint
      let body = generateSubscriptionBody(subscription)

      return sendPushToServer('PUT', body).then(() => subscription)
    })
    .then(
      subscription =>
        subscription &&
        stateCallback('enabled', generateSubscriptionBody(subscription))
    ) // Set your UI to show they have subscribed for push messages
    .catch(e => {
      console.error('Error when updating the subscription', e)
    })
}

export function push_subscribe(stateCallback) {
  stateCallback('computing')

  navigator.serviceWorker.ready
    .then(serviceWorkerRegistration =>
      serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
      })
    )
    .then(subscription => {
      // Subscription was successful
      // create subscription on your server
      let body = generateSubscriptionBody(subscription)

      return sendPushToServer('POST', body).then(() => subscription)
    })
    .then(
      subscription =>
        subscription &&
        stateCallback('enabled', generateSubscriptionBody(subscription))
    ) // update your UI
    .catch(e => {
      if (Notification.permission === 'denied') {
        // The user denied the notification permission which
        // means we failed to subscribe and the user will need
        // to manually change the notification permission to
        // subscribe to push messages
        console.warn('Notifications are denied by the user :(')
        stateCallback('incompatible')
      } else {
        // A problem occurred with the subscription; common reasons
        // include network errors or the user skipped the permission
        console.error('Impossible to subscribe to push notifications', e)
        stateCallback('disabled')
      }
    })
}

export function sendPushToServer(method, body) {
  body.events = require('../index').store.getState().push.events
  return callApiChecked(config.apibase + 'pushsub', {
    method: method,
    body: JSON.stringify(body)
  })
}
