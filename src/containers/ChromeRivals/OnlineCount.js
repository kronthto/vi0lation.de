import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import OnlineCountChart from '../../components/ChromeRivals/OnlineCountChart'
import debounce from 'lodash.debounce'

class OnlineCount extends Component {
  constructor(props) {
    super(props)
    this.state = { backdays: 3 }
  }

  daysInputChanged() {
    this.setState({ backdays: Number(this.refs.daysInput.value) })
  }

  renderForm() {
    return (
      <form onSubmit={e => e.preventDefault()} className="margin-bot">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label" htmlFor="backdays">
              Days in the past
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <input
                className="input"
                type="number"
                ref="daysInput"
                id="backdays"
                step="1"
                min="1"
                max="180"
                defaultValue={this.state.backdays}
                onChange={debounce(() => this.daysInputChanged(), 100)}
              />
            </div>
          </div>
        </div>
      </form>
    )
  }

  render() {
    const { backdays } = this.state
    const title = 'ChromeRivals: Player count'

    // TODO: Dynamically calc interval

    return (
      <div className="content">
        <Helmet>
          <meta name="description" content="Online count history in CR" />
          <title>{title}</title>
        </Helmet>

        <h1 className="title">{title}</h1>

        {this.renderForm()}

        {backdays > 0 && <OnlineCountChart backdays={backdays} />}
      </div>
    )
  }
}

export default OnlineCount
