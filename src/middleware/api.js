import config from '../config.js'
import { handleErrors } from '../utils/api'

function callApi(url, options = {}) {
  let headers = {
    Accept: 'application/json'
  }

  let fetchOpts = Object.assign(
    {
      headers
    },
    options
  )

  return fetch(url, fetchOpts)
    .then(handleErrors)
    .then(response => response.json())
}

export const CALL_API = 'CALL_API'

export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, types, additionalOpts } = callAPI

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types

  endpoint = config.apibase + endpoint

  next(actionWith({ type: requestType }))

  return callApi(endpoint, additionalOpts || {}).then(
    response =>
      next(
        actionWith({
          response,
          type: successType,
          receivedAt: Date.now()
        })
      ),
    error => {
      next(
        actionWith({
          type: failureType,
          error
        })
      )
    }
  )
}
