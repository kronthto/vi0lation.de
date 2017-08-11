import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchCommentsIfNeeded } from '../actions/comments'

const isEqual = require('lodash.isequal')

class PostComments extends Component {
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props.comments, nextProps.comments)) {
      return true
    }

    return false
  }

  static fetchData(store, match) {
    return store.dispatch(fetchCommentsIfNeeded(match.params.id))
  }

  fetchCommentsData() {
    const { dispatch } = this.props
    dispatch(fetchCommentsIfNeeded(this.props.match.params.id))
  }

  componentDidMount() {
    this.fetchCommentsData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchCommentsData()
    }
  }

  render() {
    const { comments } = this.props

    return (
      <div>
        <h3>
          Comments to Post {this.props.match.params.id}
        </h3>
        <ul>
          {comments &&
            comments.map(comment =>
              <li key={comment.id}>
                <strong>{comment.email}</strong> {comment.body}
              </li>
            )}
        </ul>
      </div>
    )
  }
}

PostComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      body: PropTypes.string
    })
  )
}

const mapStateToProps = (state, ownProps) => {
  let byPostMatch = state.comments.byPost[ownProps.match.params.id]

  return {
    comments: byPostMatch ? byPostMatch.items : null
  }
}

export default connect(mapStateToProps)(PostComments)
