import { REQUESTDATES, RECEIVEDATES } from '../types/cr'
import { CALL_API } from '../middleware/api'
import { isCurrentlyFetching } from '../utils/api'

function fetchDates() {
  return {
    [CALL_API]: {
      endpoint: 'chromerivals/ranking-timestamps',
      types: [REQUESTDATES, RECEIVEDATES]
    }
  }
}

function shouldFetchDates(state) {
  const dateData = state.cr.dates

  if (!dateData) {
    return true
  }

  if (isCurrentlyFetching(dateData)) return false

  return true
}

export function fetchDatesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchDates(getState())) {
      return dispatch(fetchDates())
    }
  }
}
