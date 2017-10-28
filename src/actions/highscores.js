import { REQUEST, RECEIVE, REQFAIL } from '../types/highscores'
import { CALL_API } from '../middleware/api'
import { isCurrentlyFetching } from '../utils/api'

function fetchHighscore(region, date) {
  return {
    [CALL_API]: {
      endpoint: 'ranking/highscore?date=' + date,
      types: [REQUEST, RECEIVE, REQFAIL]
    },
    date,
    region
  }
}

function shouldFetchHighscore(region, date, state) {
  const regionData = state.highscores[region]

  if (!regionData) {
    return true
  }

  const highscore = regionData[date]

  if (!highscore) {
    return true
  }

  const highscoreData = highscore.data
  if (
    highscoreData ||
    highscoreData === false ||
    isCurrentlyFetching(highscore)
  ) {
    return false
  }

  return true
}

export function fetchHighscoreIfNeeded(region, date) {
  return (dispatch, getState) => {
    if (shouldFetchHighscore(region, date, getState())) {
      return dispatch(fetchHighscore(region, date))
    }
  }
}
