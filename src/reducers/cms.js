import { REQUEST, RECEIVE } from '../types/cms'
import { getCurrentTS } from '../utils/api'

const initialState = {
  requests: {},
  contents: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        requests: Object.assign({}, state.requests, {
          [action.page]: Object.assign({}, state.requests[action.page], {
            isFetching: getCurrentTS()
          })
        })
      })

    case RECEIVE:
      let { response, receivedAt } = action

      return Object.assign({}, state, {
        requests: Object.assign({}, state.requests, {
          [action.page]: Object.assign({}, state.requests[action.page], {
            isFetching: false,
            receivedAt
          })
        }),
        contents: Object.assign({}, state.contents, response)
      })

    default:
      return state
  }
}
