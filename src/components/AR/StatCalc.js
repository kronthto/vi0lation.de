import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import StatCalcTool from './StatCalcTool'

class StatCalc extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="AirRivals/AceOnline gear stat calculator"
          />
          <title>AirRivals/AceOnline StatCalc</title>
        </Helmet>

        <h1 className="title">Ace StatCalc</h1>

        <StatCalcTool />

        <p style={{ fontSize: '80%' }}>
          <a
            href="https://github.com/kronthto/ao-stats"
            target="_blank"
            title="Ace Stat Calculator"
            rel="noopener noreferrer"
          >
            source on GitHub
          </a>
        </p>
      </div>
    )
  }
}

export default StatCalc
