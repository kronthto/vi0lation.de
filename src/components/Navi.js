import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import NavLink from './NavLink'

import classNames from 'classnames'

const NavTab = props => {
  return (
    <div className={classNames('navbar-item has-dropdown', props.addClass)}>
      {props.children}
    </div>
  )
}

const responsiveExpandedClass = 'is-active'
const mainNav = 'mainNav'
const navToggle = 'navToggle'

class Navi extends Component {
  //shouldComponentUpdate() { // TODO
  //  return false
  //}

  toggleMenu() {
    this.toggleMenuState()
  }

  toggleMenuState(state) {
    this.refs[mainNav].classList.toggle(responsiveExpandedClass)
    this.refs[navToggle].classList.toggle(responsiveExpandedClass)
  }

  componentDidUpdate(prevProps) {
    // Hide the responsive (burger) menu again after switching pages
    if (this.props.location !== prevProps.location) {
      this.toggleMenuState(false)
    }
  }

  render() {
    return (
      <nav className="navbar has-shadow is-primary" id="top">
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/" exact className="is-tab">
              Vi0
            </NavLink>
            <div
              className="navbar-burger burger"
              onClick={this.toggleMenu.bind(this)}
              ref={navToggle}
              data-target={mainNav}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            ref={mainNav}
            id={mainNav}
            className="navbar-menu"
            style={{ paddingBottom: 0 }}
          >
            <div className="navbar-start">
              <NavTab addClass="is-hoverable">
                <NavLink to="/ranking" className="is-tab">
                  AR Ranking
                </NavLink>
                <div className="navbar-dropdown">
                  <NavLink to="/ranking/eplist">EP List</NavLink>
                </div>
              </NavTab>
              <NavTab>
                <NavLink to="/ts3" className="is-tab">
                  TeamSpeak 3
                </NavLink>
              </NavTab>
            </div>
            <div className="navbar-end" />
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Navi)
