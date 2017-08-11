import { REQUEST, RECEIVE } from '../types/comments'

function requestComments(postid) {
  return {
    type: REQUEST,
    postid
  }
}

function receiveComments(postid, json) {
  return {
    type: RECEIVE,
    postid,
    comments: json
  }
}

function fetchComments(postid) {
  return dispatch => {
    dispatch(requestComments(postid))
    return fetch(
      `https://jsonplaceholder.typicode.com/posts/${postid}/comments`
    )
      .then(response => response.json())
      .then(json => dispatch(receiveComments(postid, json)))
  }
}

function shouldFetchComments(postid, state) {
  const comments = state.comments.byPost[postid]

  if (!comments) {
    return true
  }
  if (comments.items || comments.isFetching) {
    return false
  }

  return true
}

export function fetchCommentsIfNeeded(postid) {
  return (dispatch, getState) => {
    if (shouldFetchComments(postid, getState())) {
      return dispatch(fetchComments(postid))
    }
  }
}
