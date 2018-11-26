import { REQUESTDATES, RECEIVEDATES } from '../types/cr'
import { getCurrentTS } from '../utils/api'

const initialState = {
  dates: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTDATES:
      return Object.assign({}, state, {
        dates: Object.assign({}, state.dates, {
          isFetching: getCurrentTS()
        })
      })
    case RECEIVEDATES:
      const { response } = action
      return Object.assign({}, state, {
        dates: Object.assign({}, state.dates, {
          isFetching: false,
          data: response.playerfame
        })
      })
    default:
      return state
  }
}
