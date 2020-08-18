import React, { Component } from 'react'
import aostats from 'aceonline-stats'
import { formatNum } from '../../utils/num'
import defaultCpus from '../../data/cpus'
import withRouter from 'react-router/withRouter'

const stats = ['atk', 'def', 'eva', 'fuel', 'spirit', 'shield']

const cardStyle = { height: '100%' }
const btnStyle = { width: '30px', borderRadius: '10%' }

const gearStatChange = {
  I: {
    atk: 4,
    def: 2,
    fuel: 3,
    spirit: 3,
    shield: 2,
    eva: 3
  },
  M: {
    atk: 2,
    def: 4,
    fuel: 3,
    spirit: 4,
    shield: 3,
    eva: 3
  },
  B: {
    atk: 3,
    def: 3,
    fuel: 3,
    spirit: 3,
    shield: 3,
    eva: 3
  },
  A: {
    atk: 4,
    def: 3,
    fuel: 3,
    spirit: 3,
    shield: 4,
    eva: 1
  }
}

const cap = 340

const defaultBonusStats = 144

const cappedDisplay = num => {
  if (num <= cap) {
    return num
  }
  return `${cap} (+${num - cap})`
}

class StatCalcTool extends Component {
  currentStatVals
  currentStatValsCalc
  pointsSet

  constructor(props) {
    super(props)

    let initState = {
      gear: 'B',
      cpus: defaultCpus,
      cpu: null,
      bonusstats: defaultBonusStats
    }
    stats.forEach(statName => (initState[statName] = 0))

    let hash = this.props.location.hash.substr(1)
    if (hash) {
      Object.assign(initState, JSON.parse(atob(hash)))
    }

    this.state = initState
  }

  componentDidUpdate() {
    this.props.history.replace({
      hash: btoa(JSON.stringify(this.serializeState()))
    })
  }

  serializeState() {
    let obj = Object.assign({}, this.state)
    delete obj.cpus
    if (!obj.cpu) {
      delete obj.cpu
    }
    stats.forEach(statName => {
      if (!obj[statName]) {
        delete obj[statName]
      }
    })
    if (obj.bonusstats === defaultBonusStats) {
      delete obj.bonusstats
    }
    return obj
  }

  statInput(id, label) {
    const { gear, bonusstats } = this.state
    const statByGear = gearStatChange[gear]
    let canIncrease = bonusstats - this.pointsSet > 0
    let canDecrease = this.state[id] > 0
    return (
      <div className="column is-half">
        <label className="label" htmlFor={id}>
          {label} ({statByGear[id]})
        </label>
        <span id={id}>{cappedDisplay(this.currentStatVals[id])}</span>
        <div
          className="buttons has-addons is-pulled-right"
          style={{ display: 'inline' }}
        >
          <button
            style={btnStyle}
            disabled={!canIncrease}
            type="button"
            className="button is-primary is-small"
            onClick={() => this.setState({ [id]: this.state[id] + 1 })}
            onContextMenu={e => {
              e.preventDefault()
              this.setState({
                [id]:
                  this.state[id] +
                  Math.min(
                    bonusstats - this.pointsSet,
                    Math.ceil((cap - this.currentStatVals[id]) / statByGear[id])
                  )
              })
            }}
          >
            +
          </button>
          <button
            style={btnStyle}
            disabled={!canDecrease}
            type="button"
            className="button is-primary is-small"
            onClick={() => this.setState({ [id]: this.state[id] - 1 })}
            onContextMenu={e => {
              e.preventDefault()
              this.setState({ [id]: 0 })
            }}
          >
            -
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { gear, cpus, cpu, bonusstats } = this.state
    const cpuData = cpus[cpu]

    this.currentStatVals = {}
    this.currentStatValsCalc = {}
    this.pointsSet = 0
    stats.forEach(statName => {
      this.pointsSet += this.state[statName]
      let statVal = (this.state[statName] + 1) * gearStatChange[gear][statName]
      if (cpuData && statName in cpuData.CPUStats) {
        statVal += cpuData.CPUStats[statName]
      }
      this.currentStatVals[statName] = statVal
      this.currentStatValsCalc[statName] = Math.min(statVal, cap)
    })

    return (
      <div>
        <div className="tabs is-toggle is-fullwidth">
          <ul style={{ margin: 0 }}>
            {Object.keys(gearStatChange).map(gearEach => (
              <li
                className={gear === gearEach ? 'is-active' : undefined}
                key={gearEach}
                style={{ marginTop: 0 }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => this.setState({ gear: gearEach })}>
                  <span>{`${gearEach}-Gear`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="columns">
          <div className="column">
            <label className="label" htmlFor="bonusstats">
              Total Statpoints available
            </label>
            <input
              type="number"
              className="input"
              step="1"
              value={bonusstats}
              ref="bonusstats"
              onChange={() =>
                this.setState({
                  bonusstats: Number(this.refs.bonusstats.value)
                })}
            />
          </div>

          <div className="column">
            <label className="label" htmlFor="cpusel">
              CPU
            </label>
            <div className="select is-fullwidth">
              <select
                id="cpusel"
                ref="cpusel"
                onChange={() => this.setState({ cpu: this.refs.cpusel.value })}
                value={cpu || ''}
              >
                <option value="">-</option>
                {Object.keys(cpus).map(cpuId => {
                  const cpu = cpus[cpuId]
                  return (
                    <option key={cpuId} value={cpuId}>
                      {cpu.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>

        <p>Remaining stats: {bonusstats - this.pointsSet}</p>

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
    const { atk, def, eva, fuel, spirit, shield } = this.currentStatValsCalc

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
                <dd>{Math.floor(aostats.pierce(atk))}</dd>
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

export default withRouter(StatCalcTool)
