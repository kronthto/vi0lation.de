import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PostList from '../components/PostList'

import { renderRoutes } from 'react-router-config'

import { fetchPostsIfNeeded } from '../actions/posts'

class PostsApiPage extends Component {
  static fetchData(store) {
    return store.dispatch(fetchPostsIfNeeded())
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchPostsIfNeeded())
  }

  render() {
    const { posts, route } = this.props

    return (
      <div>
        <Helmet>
          <title>Posts</title>
        </Helmet>

        <h1>Posts</h1>
        {renderRoutes(route.routes)}
        <PostList posts={posts} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  posts: state.posts.items
})

export default connect(mapStateToProps)(PostsApiPage)
