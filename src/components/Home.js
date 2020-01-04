import React, { Component } from 'react'
import Link from 'react-router-dom/Link'

class Home extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">Vi0</h1>

        <div className="columns is-multiline">
          <div className="column is-half">
            <Link to="/ranking">
              <div className="hero is-primary is-bold">
                <div className="hero-body">
                  <h1 className="title">AirRivals/AceOnline</h1>
                  <h2 className="subtitle">Tools & Stats</h2>
                </div>
              </div>
            </Link>
          </div>

          <div className="column is-half">
            <a href="https://cr.vi0.de">
              <div className="hero is-primary is-bold crt">
                <div className="hero-body">
                  <h1 className="title">CR-Tools</h1>
                  <h2 className="subtitle">ChromeRivals apps</h2>
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
