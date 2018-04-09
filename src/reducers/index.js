import { combineReducers } from 'redux'

import highscores from './highscores'
import cms from './cms'

export default combineReducers({
  highscores,
  cms
})
