import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import debounce from 'lodash.debounce'
import PlayerFameChartChart from '../../components/ChromeRivals/PlayerFameChart'
import { CRDisclaimer } from './KillsInInterval'

class PlayerFameChart extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '' }
  }

  nameInputChanged() {
    this.setState({ name: this.refs.nameInput.value })
  }

  renderForm() {
    return (
      <form onSubmit={e => e.preventDefault()} className="margin-bot">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label" htmlFor="name">
              Player name
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <input
                className="input"
                type="text"
                ref="nameInput"
                id="name"
                onChange={debounce(() => this.nameInputChanged(), 480)}
              />
            </div>
          </div>
        </div>
      </form>
    )
  }

  render() {
    const name = this.state.name
    const title = 'ChromeRivals: Player fame growth'

    return (
      <div className="content">
        <Helmet>
          <meta name="description" content={'Fame history of CR players'} />
          <title>{title}</title>
        </Helmet>

        <h1 className="title">{title}</h1>

        {this.renderForm()}

        {name.length > 1 && <PlayerFameChartChart names={[name]} />}

        <CRDisclaimer />
      </div>
    )
  }
}

export default PlayerFameChart
