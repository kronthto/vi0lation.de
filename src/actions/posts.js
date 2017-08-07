import { REQUEST, RECEIVE } from '../types/posts'

function requestPosts(subreddit) {
  return {
    type: REQUEST
  }
}

function receivePosts(json) {
  return {
    type: RECEIVE,
    posts: json
  }
}

function fetchPosts() {
  return dispatch => {
    dispatch(requestPosts())
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => dispatch(receivePosts(json)))
  }
}

function shouldFetchPosts(state) {
  const posts = state.posts

  if (posts.items || posts.isFetching) {
    return false
  }

  return true
}

export function fetchPostsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState())) {
      return dispatch(fetchPosts())
    }
  }
}
