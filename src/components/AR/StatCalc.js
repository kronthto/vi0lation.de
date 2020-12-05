import React, { Component } from 'react'

import StatCalcTool from './StatCalcTool'

class StatCalc extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">OSR StatCalc</h1>

        <StatCalcTool />

        <p style={{ fontSize: '80%' }}>
          <a
            href="https://github.com/kronthto/ao-stats"
            target="_blank"
            title="Ace Stat Calculator source"
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
