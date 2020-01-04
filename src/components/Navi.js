import React, { Component } from 'react'
import withRouter from 'react-router/withRouter'
import NavLink from './NavLink'

import { crTopKillsIntervalUrl } from '../routes'

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
    this.refs[mainNav].classList.toggle(responsiveExpandedClass, state)
    this.refs[navToggle].classList.toggle(responsiveExpandedClass, state)
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
              CRT
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
              <NavLink to={crTopKillsIntervalUrl} className="is-tab">
                Ranking
              </NavLink>
              <NavLink to="/fameChart" className="is-tab">
                Fame-Chart
              </NavLink>
              <NavLink to="/usercount" className="is-tab">
                Playercount
              </NavLink>
              <NavLink to="/weaponcalc" className="is-tab">
                WeaponCalc
              </NavLink>
            </div>
            <div className="navbar-end" />
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Navi)
