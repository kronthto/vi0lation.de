import { REQUESTDATES, RECEIVEDATES } from '../types/cr'
import { getCurrentTS } from '../utils/api'
import dayDiff from 'date-fns/difference_in_days'
import format from 'date-fns/format'

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

      let now = new Date()
      let days = []

      const midNightRegex = /^00:0[0-5]$/

      return Object.assign({}, state, {
        dates: Object.assign({}, state.dates, {
          isFetching: false,
          data: response.playerfame.filter((date, i) => {
            if (i < 120) {
              return true
            }
            let dt = new Date(date)
            if (dayDiff(now, dt) <= 10) {
              return true
            }
            let dayFrmt = format(dt, 'YYYY-MM-DD')
            if (days.indexOf(dayFrmt) !== -1) {
              let dateHm = format(dt, 'HH:mm')
              if (midNightRegex.test(dateHm)) {
              } else {
                return false
              }
            }
            days.push(dayFrmt)
            return true
          })
        })
      })
    default:
      return state
  }
}
