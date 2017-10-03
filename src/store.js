import { createStore, applyMiddleware, compose } from 'redux'
import reducers from './reducers'
//import createLogger from 'redux-logger'
import { autoRehydrate } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'

//const logger = createLogger()

export default function configureStore(initialState = {}) {
  const middlewares = [
    thunkMiddleware
    //, logger
  ]

  const enhancers = [applyMiddleware(...middlewares), autoRehydrate()]

  const store = createStore(reducers, initialState, compose(...enhancers))

  return store
}
