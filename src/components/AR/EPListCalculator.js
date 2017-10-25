import React, { Component } from 'react'
import { calcProgessBarByEp } from '../../utils/AR/ep'

class EPListCalculator extends Component {
  constructor(props) {
    super(props)
    this.state = { ep: null }
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.state.ep !== prevState.ep) {
      return true
    }

    return false
  }

  calculate(e) {
    e.preventDefault()
    this.setState({ ep: Number(this.refs.ep.value) })
  }

  ep2LevelResult() {
    let { ep } = this.state

    if (!ep) {
      return null
    }

    return <span>{calcProgessBarByEp(ep)}</span>
  }

  render() {
    return (
      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            className="input"
            type="number"
            id="epqueryinput"
            min="0"
            max="44219722864"
            placeholder="EP"
            aria-label="EP"
            ref="ep"
            onChange={this.calculate.bind(this)}
          />
        </div>
        <div className="control">
          <strong
            className="button is-static"
            style={{ color: 'inherit', minWidth: '9em' }}
          >
            {this.ep2LevelResult()}
          </strong>
        </div>
      </div>
    )
  }
}

export default EPListCalculator
