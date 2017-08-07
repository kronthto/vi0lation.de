import React, { Component } from 'react'
import PropTypes from 'prop-types'

class NoMatch extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      staticContext: PropTypes.object
    }).isRequired
  }

  componentWillMount() {
    if (this.context.router.staticContext)
      this.context.router.staticContext.statusCode = 404
  }

  render() {
    return <div>Sorry, page not found</div>
  }
}

export default NoMatch
