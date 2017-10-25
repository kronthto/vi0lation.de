import { REQUEST, RECEIVE, REQFAIL } from '../types/highscores'

const initialState = {
  de: {}
}

export default function reducer(state = initialState, action) {
  let { region, date } = action
  let regionData = Object.assign({}, state[region])
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        [region]: Object.assign(regionData, {
          [date]: {
            isFetching: true
          }
        })
      })
    case RECEIVE:
      return Object.assign({}, state, {
        [region]: Object.assign(regionData, {
          [date]: {
            isFetching: false,
            data: action.response
          }
        })
      })
    case REQFAIL:
      const { error } = action
      const errorResponse = error.response
      if (errorResponse && errorResponse.status === 404) {
        return Object.assign({}, state, {
          [region]: Object.assign(regionData, {
            [date]: {
              isFetching: false,
              data: false
            }
          })
        })
      }
      return state
    default:
      return state
  }
}
