import { REQUEST, RECEIVE } from '../types/comments'

const initialState = {
  byPost: {}
}

export default function reducer(state = initialState, action) {
  let comments
  switch (action.type) {
    case REQUEST:
      comments = Object.assign({}, state.byPost)
      return Object.assign({}, state, {
        byPost: Object.assign(comments, {
          [action.postid]: {
            isFetching: true
          }
        })
      })
    case RECEIVE:
      comments = Object.assign({}, state.byPost)
      return Object.assign({}, state, {
        byPost: Object.assign(comments, {
          [action.postid]: {
            isFetching: false,
            items: action.comments
          }
        })
      })
    default:
      return state
  }
}
