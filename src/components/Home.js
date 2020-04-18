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
                  <h2 className="title">Fame Ranking</h2>
                  <h3 className="subtitle">Date comparison</h3>
                </div>
              </div>
            </Link>
          </div>
          <div className="column is-half">
            <Link to="/topLists">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h2 className="title">Stats</h2>
                  <h3 className="subtitle">All time data</h3>
                </div>
              </div>
            </Link>
          </div>
          <div className="column is-half">
            <Link to="/usercount">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h2 className="title">Playercount</h2>
                  <h3 className="subtitle">Online history</h3>
                </div>
              </div>
            </Link>
          </div>
          <div className="column is-half">
            <Link to="/weaponcalc">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h2 className="title">WeaponCalc</h2>
                  <h3 className="subtitle">Item/gear stats</h3>
                </div>
              </div>
            </Link>
          </div>
          <div className="column is-half">
            <a href="https://beta.vi0lation.de/ranking/fbtool">
              <div className="hero is-primary is-bold vi0">
                <div className="hero-body">
                  <h2 className="title">Framebrake Tool</h2>
                  <h3 className="subtitle">Std. BPs</h3>
                </div>
              </div>
            </a>
          </div>
          <div className="column is-half">
            <a href="https://beta.vi0lation.de/ranking/statcalc">
              <div className="hero is-primary is-bold vi0">
                <div className="hero-body">
                  <h2 className="title">Stat Calc</h2>
                  <h3 className="subtitle">CPU builds</h3>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
