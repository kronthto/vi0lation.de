import { REQUEST, RECEIVE } from '../types/highscores'
import { getCurrentTS } from '../utils/api'

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
            isFetching: getCurrentTS()
          }
        })
      })
    case RECEIVE:
      const { response } = action
      return Object.assign({}, state, {
        [region]: Object.assign(regionData, {
          [date]: {
            isFetching: false,
            data: response.date ? false : response // object with date key -> an error occured
          }
        })
      })
    default:
      return state
  }
}
