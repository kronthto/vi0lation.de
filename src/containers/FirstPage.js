import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

class FirstPage extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>First Page</title>
        </Helmet>

        <h1>First Page</h1>
        <Link to={'/posts'}>Posts API Example</Link>
      </div>
    )
  }
}

FirstPage.propTypes = {}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(FirstPage)
