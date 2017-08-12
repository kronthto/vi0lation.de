import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavLink from './NavLink'

class Navi extends Component {
  //shouldComponentUpdate() { // TODO
  //  return false
  //}

  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { toggled: false }
  }

  toggleMenu() {
    this.setState({ toggled: !this.state.toggled })
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    // Hacky way to hide the responsive (burger) menu again after switching pages
    if (
      prevContext.router.route.location.key !==
      this.context.router.route.location.key
    ) {
      this.setState({ toggled: false })
    }
  }

  render() {
    return (
      <nav className="navbar has-shadow is-primary" id="top">
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/" exact>
              Vi0
            </NavLink>
            <div
              className={
                'navbar-burger burger ' +
                (this.state.toggled ? ' is-active' : '')
              }
              onClick={this.toggleMenu.bind(this)}
              data-target="mainNav"
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="mainNav"
            className={'navbar-menu' + (this.state.toggled ? ' is-active' : '')}
            style={{ paddingBottom: 0 }}
          >
            <div className="navbar-start">
              <NavLink to="/idontexist">Nonexisting page</NavLink>
            </div>
            <div className="navbar-end" />
          </div>
        </div>
      </nav>
    )
  }
}

export default Navi
