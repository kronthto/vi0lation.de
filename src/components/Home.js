import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">Vi0</h1>

        <div className="columns">
          <div className="column">
            <Link to="/ranking">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h1 className="title">AR Ranking</h1>
                  <h2 className="subtitle">
                    Recorded player Ranking-progress information
                  </h2>
                </div>
              </div>
            </Link>
          </div>

          <div className="column">
            <Link to="/ts3">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h1 className="title">TeamSpeak 3</h1>
                  <h2 className="subtitle">Listing of the TS3 Servers</h2>
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
