import React, { Component } from 'react'
import NumTD from './NumTD'
import calcFbs from 'aceonline-framebreak'

const TableLegend = () => (
  <tr>
    <th className="has-text-right" scope="col">
      Rea Enchant
    </th>
    <th className="has-text-right" scope="col">
      Bullets per second
    </th>
  </tr>
)

class FrameBreakCalculator extends Component {
  constructor(props) {
    super(props)
    this.state = { baseRea: null, firingMode: null }
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.state.baseRea !== prevState.baseRea) {
      return true
    }
    if (this.state.firingMode !== prevState.firingMode) {
      return true
    }

    return false
  }

  calculate(e) {
    e.preventDefault()
    this.setState({
      baseRea: Number(this.refs.rea.value),
      firingMode: Number(this.refs.mode.value)
    })
  }

  render() {
    const { baseRea, firingMode } = this.state
    const legend = <TableLegend />
    let data
    if (baseRea && firingMode) {
      data = calcFbs(baseRea, firingMode)
    }

    // TODO: Auslagern von generischen Form Stuff
    return (
      <div>
        <form onSubmit={e => e.preventDefault()} className="margin-bot">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label" htmlFor="reainput">
                Base Rea (s)
              </label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <p className="control">
                  <input
                    className="input"
                    type="number"
                    id="reainput"
                    min="0"
                    max="3"
                    step="0.01"
                    placeholder="0.45"
                    aria-label="Base Rea"
                    ref="rea"
                    onChange={this.calculate.bind(this)}
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label" htmlFor="modeinput">
                Firing Mode (X*1)
              </label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <p className="control">
                  <input
                    className="input"
                    type="number"
                    id="modeinput"
                    min="1"
                    max="10"
                    step="1"
                    placeholder="3"
                    aria-label="Firing Mode"
                    ref="mode"
                    onChange={this.calculate.bind(this)}
                  />
                </p>
              </div>
            </div>
          </div>
        </form>
        <table className="table is-striped is-hoverable">
          <thead>{legend}</thead>
          <tbody>
            {data &&
              data.map(function(row) {
                return (
                  <tr key={row.rea}>
                    <NumTD num={row.rea} />
                    <NumTD num={row.bps} />
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default FrameBreakCalculator
