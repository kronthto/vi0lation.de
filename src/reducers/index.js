import { combineReducers } from 'redux'

import highscores from './highscores'
import cms from './cms'
import cr from './cr'

export default combineReducers({
  highscores,
  cms,
  cr
})
