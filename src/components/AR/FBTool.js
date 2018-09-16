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

        <FrameBreakCalculator />
      </div>
    )
  }
}

export default FBTool
