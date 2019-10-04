import { REQUESTDATES, RECEIVEDATES } from '../types/cr'
import { getCurrentTS } from '../utils/api'
import dayDiff from 'date-fns/difference_in_days'
import format from 'date-fns/format'
import sub_days from 'date-fns/sub_days'

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
      const twentyThreeHoursRegex = /^23:\d\d$/
      let nextDay // Skip for this day if 23:55

      return Object.assign({}, state, {
        dates: Object.assign({}, state.dates, {
          isFetching: false,
          data: response.playerfame.filter((date, i) => {
            if (i < 120) {
              return true
            }
            let dt = new Date(date)
            let dayDiffDt = dayDiff(now, dt)
            if (dayDiffDt <= 6) {
              return true
            }
            let dayFrmt = format(dt, 'YYYY-MM-DD')
            let dateHm = format(dt, 'HH:mm')
            if (days.indexOf(dayFrmt) !== -1) {
              if (midNightRegex.test(dateHm)) {
                nextDay = format(sub_days(dt, 1), 'YYYY-MM-DD')
              } else {
                return false
              }
            }
            days.push(dayFrmt)
            if (nextDay === dayFrmt && twentyThreeHoursRegex.test(dateHm)) {
              return false
            }
            return true
          })
        })
      })
    default:
      return state
  }
}
