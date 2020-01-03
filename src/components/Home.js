import React, { Component } from 'react'
import Link from 'react-router-dom/Link'
import { crTopKillsIntervalUrl } from '../routes'

class Home extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">ChromeRivals Tools</h1>

        <div className="columns is-multiline">
          <div className="column is-half">
            <Link to={crTopKillsIntervalUrl}>
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h1 className="title">Fame Ranking</h1>
                  <h2 className="subtitle">Date comparison</h2>
                </div>
              </div>
            </Link>
          </div>
          <div className="column is-half">
            <Link to="/weaponcalc">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h1 className="title">WeaponCalc</h1>
                  <h2 className="subtitle">Item/gear stats</h2>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
