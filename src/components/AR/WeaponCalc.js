import React, { Component } from 'react'

import WeaponCalcTool from './WeaponCalc/'

class WeaponCalc extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <h1 className="title">OSR WeaponCalc</h1>

        <WeaponCalcTool />
      </div>
    )
  }
}

export default WeaponCalc
