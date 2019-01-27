import config from '../config.js'
import toast from '../utils/toast'

export function callApi(url, options = {}, acceptableErrorCodes = []) {
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
    .then(response => {
      if (
        !response.ok &&
        acceptableErrorCodes.indexOf(response.status) === -1
      ) {
        let err = new Error(response.statusText)
        err.response = response
        throw err
      }
      return response
    })
    .then(response => response.json())
}

function warnAboutError(error, options = {}, url) {
  if (typeof toast === 'undefined') {
    return
  }

  const errorResponse = error.response

  if (!errorResponse) {
    toast.error({
      title: 'Fetch Error',
      message: 'A network request failed. Check your internet connection.'
    })
    return
  }

  let method = options.method || 'GET'

  toast.error({
    title: 'Error ' + errorResponse.status,
    message: `${method} ${url}`
  })
}

export const CALL_API = 'CALL_API'

export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, types, additionalOpts, acceptableErrorCodes } = callAPI

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [requestType, successType, failureType] = types

  endpoint = config.apibase + endpoint

  next(actionWith({ type: requestType }))

  return callApi(endpoint, additionalOpts || {}, acceptableErrorCodes).then(
    response =>
      next(
        actionWith({
          response,
          type: successType,
          receivedAt: Date.now()
        })
      ),
    error => {
      warnAboutError(error, additionalOpts, endpoint)

      if (failureType) {
        next(
          actionWith({
            type: failureType,
            error
          })
        )
      }

      throw error
    }
  )
}
