import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

class NoMatch extends Component {
  shouldComponentUpdate() {
    return false
  }

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
    return (
      <div>
        <Helmet>
          <title>Not found</title>
        </Helmet>
        <h1 className="title">Not found</h1>
        <strong>We can't find that page you're looking for</strong>
        <p>
          Maybe you mistyped something, maybe the page isn't there anymore,
          maybe it did never exist and maybe it will in the future
        </p>
        <Link to={'/'} title="Home page">Go to home page</Link>
      </div>
    )
  }
}

export default NoMatch
