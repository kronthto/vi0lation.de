import { REQUEST, RECEIVE } from '../types/posts'

const initialState = {
  isFetching: false,
  items: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.posts
      })
    default:
      return state
  }
}
