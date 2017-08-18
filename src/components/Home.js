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

        <Link to="/ranking">
          <section className="hero is-primary is-bold">
            <div className="hero-body">
              <h1 className="title">AR Ranking</h1>
              <h2 className="subtitle">
                Recorded player Ranking-progress information
              </h2>
            </div>
          </section>
        </Link>
      </div>
    )
  }
}

export default Home
