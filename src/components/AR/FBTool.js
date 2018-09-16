import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import FrameBreakCalculator from './FrameBreakCalculator'

class FBTool extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="AirRivals/AceOnline std-weapon framebreaks calculation"
          />
          <title>AirRivals/AceOnline FrameBreak Tool</title>
        </Helmet>

        <h1 className="title">FrameBreak Tool</h1>

        <section className="section">
          Standard weapons in AceOnline / AirRivals / SCO (Space Cowboy Online)
          only profit from very specific values of enchanted reattack (so called
          "breakpoints") due to time quantization.<br />
          The following tool can be used to calculate the optimal re-attack
          enchants to use those breakpoints:
        </section>

        <FrameBreakCalculator />

        <p style={{ fontSize: '80%' }}>
          <a
            href="https://github.com/kronthto/ao-framebreak"
            target="_blank"
            title="AceOnline framebreak calculator Source-Code"
            rel="noopener noreferrer"
          >
            source on GitHub
          </a>
        </p>
      </div>
    )
  }
}

export default FBTool
