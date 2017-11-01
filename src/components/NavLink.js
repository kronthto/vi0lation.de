import React, { Component } from 'react'
import ReactRouterNavLink from 'react-router-dom/NavLink'

import classNames from 'classnames'

class NavLink extends Component {
  //shouldComponentUpdate() { // TODO
  //  return false
  //}

  render() {
    return (
      <ReactRouterNavLink
        {...this.props}
        activeClassName="is-active"
        className={classNames('navbar-item', this.props.className)}
      />
    )
  }
}

export default NavLink
