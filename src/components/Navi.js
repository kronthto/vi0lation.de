import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import NavLink from './NavLink'

import classNames from 'classnames'

class Navi extends Component {
  //shouldComponentUpdate() { // TODO
  //  return false
  //}

  constructor(props) {
    super(props)
    this.state = { toggled: false }
  }

  toggleMenu() {
    this.setState({ toggled: !this.state.toggled })
  }

  componentDidUpdate(prevProps) {
    // Hide the responsive (burger) menu again after switching pages
    if (this.props.location !== prevProps.location) {
      this.setState({ toggled: false })
    }
  }

  render() {
    let { toggled } = this.state

    return (
      <nav className="navbar has-shadow is-primary" id="top">
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/" exact className="is-tab">
              Vi0
            </NavLink>
            <div
              className={classNames('navbar-burger', 'burger', {
                'is-active': toggled
              })}
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
            className={classNames('navbar-menu', { 'is-active': toggled })}
            style={{ paddingBottom: 0 }}
          >
            <div className="navbar-start">
              <div className="navbar-item has-dropdown is-hoverable">
                <NavLink to="/ranking" className="is-tab">
                  AR Ranking
                </NavLink>
                <div className="navbar-dropdown">
                  <NavLink to="/ranking/sub">Sub TODO</NavLink>
                </div>
              </div>
            </div>
            <div className="navbar-end" />
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Navi)
