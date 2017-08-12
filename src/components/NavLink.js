import React, { Component } from 'react'
import { NavLink as ReactRouterNavLink } from 'react-router-dom'

class NavLink extends Component {
  //shouldComponentUpdate() { // TODO
  //  return false
  //}

  render() {
    return (
      <ReactRouterNavLink
        {...this.props}
        activeClassName="is-active"
        className="navbar-item is-tab"
      />
    )
  }
}

export default NavLink
