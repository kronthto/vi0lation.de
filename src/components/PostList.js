import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

const isEqual = require('lodash.isequal')

class PostList extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.posts, nextProps.posts)) {
      return true
    }

    return false
  }

  render() {
    const { posts } = this.props

    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content={'Awesome ' + (posts ? posts.length : '') + ' posts'}
          />
        </Helmet>

        <ul>
          {posts &&
            posts.map(post =>
              <Link key={post.id} to={`/posts/withcommentsfor/${post.id}`}>
                <li>
                  {post.title}
                </li>
              </Link>
            )}
        </ul>
      </div>
    )
  }
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })
  )
}

export default PostList
