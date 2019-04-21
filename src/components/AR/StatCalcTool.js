import React, { Component } from 'react'
import aostats from 'aceonline-stats'
import { formatNum } from '../../utils/num'

const stats = ['atk', 'def', 'eva', 'fuel', 'spirit', 'shield']
const cardStyle = { height: '100%' }

class StatCalcTool extends Component {
  constructor(props) {
    super(props)

    let initState = {}
    stats.forEach(statName => (initState[statName] = 0))
    this.state = initState
  }

  calculate(e) {
    e.preventDefault()

    let stateUpdate = {}
    stats.forEach(
      statName => (stateUpdate[statName] = Number(this.refs[statName].value))
    )
    this.setState(stateUpdate)
  }

  statInput(id, label) {
    return (
      <div className="column is-half">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        <input
          className="input"
          type="number"
          id={id}
          min="0"
          max="340"
          step="1"
          defaultValue={this.state[id]}
          aria-label={label}
          ref={id}
          onChange={this.calculate.bind(this)}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="columns is-multiline">
          {this.statInput('atk', 'Attack')}
          {this.statInput('fuel', 'Fuel')}
          {this.statInput('def', 'Defense')}
          {this.statInput('spirit', 'Spirit')}
          {this.statInput('eva', 'Evasion')}
          {this.statInput('shield', 'Shield')}
        </div>

        {this.result()}

        <hr />
      </div>
    )
  }

  result() {
    const { atk, def, eva, fuel, spirit, shield } = this.state

    return (
      <div className="columns">
        <div className="column">
          <div className="card" style={cardStyle}>
            <header className="card-header">
              <span className="card-header-title">Attack</span>
            </header>
            <div className="card-content">
              <dl>
                <dt>Accuracy</dt>
                <dd>{formatNum(aostats.prob(atk))}</dd>
                <dt>Pierce</dt>
                <dd>{formatNum(aostats.pierce(atk))}</dd>
                <dt>Power Increase</dt>
                <dd>{formatNum(100 * aostats.dmgInc(atk))}%</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card" style={cardStyle}>
            <header className="card-header">
              <span className="card-header-title">Defense</span>
            </header>
            <div className="card-content">
              <dl>
                <dt>Defense</dt>
                <dd>{aostats.defense(def)}</dd>
                <dt>Evasion</dt>
                <dd>{formatNum(aostats.evasion(eva))}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card" style={cardStyle}>
            <header className="card-header">
              <span className="card-header-title">Misc</span>
            </header>
            <div className="card-content">
              <dl>
                <dt>Skillpoints</dt>
                <dd>{aostats.skillpoints(spirit)}</dd>
                <dt>Shield</dt>
                <dd>{aostats.shield(shield)}</dd>
                <dt>Fuel</dt>
                <dd>{aostats.fuel(fuel)}</dd>
                <dt>Capacity</dt>
                <dd>{aostats.capacity(fuel)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StatCalcTool
