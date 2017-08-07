import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
    const { posts } = this.props

    return (
      <div>
        <Helmet>
          <title>Posts</title>
          <meta
            name="description"
            content={'Awesome ' + (posts ? posts.length : '') + ' posts'}
          />
        </Helmet>

        <h1>Posts</h1>
        <ul>
          {posts &&
            posts.map(post =>
              <li key={post.id}>
                {post.title}
              </li>
            )}
        </ul>
      </div>
    )
  }
}

PostsApiPage.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })
  )
}

const mapStateToProps = state => ({
  posts: state.posts.items
})

export default connect(mapStateToProps)(PostsApiPage)
