import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import WeaponCalcTool from './WeaponCalc/'

class WeaponCalc extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="AirRivals/AceOnline weapon calculator"
          />
          <title>AirRivals/AceOnline WeaponCalc</title>
        </Helmet>

        <h1 className="title">Ace WeaponCalc</h1>

        <WeaponCalcTool />
      </div>
    )
  }
}

export default WeaponCalc
