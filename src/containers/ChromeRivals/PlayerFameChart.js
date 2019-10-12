import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import debounce from 'lodash.debounce'
import withRouter from 'react-router/withRouter'
import PlayerFameChartChart from '../../components/ChromeRivals/PlayerFameChart'
import { CRDisclaimer } from './KillsInInterval'
import { parse, stringify } from 'querystring'

class PlayerFameChart extends Component {
  constructor(props) {
    super(props)

    let qs = parse(this.props.location.search.substring(1))
    let initialName = ''
    let initialBrigSwitchSetting = 0
    if (qs.name) {
      initialName = qs.name
    }
    if (qs.brigade) {
      initialBrigSwitchSetting = qs.brigade
    }

    let { from, to } = qs

    this.state = {
      name: initialName,
      from,
      to,
      brigade: initialBrigSwitchSetting
    }
  }

  nameInputChanged() {
    let name = this.refs.nameInput.value
    this.setState({ name })
    this.props.history.replace({
      search: name ? stringify({ name }) : ''
    })
  }

  brigswitchChanged() {
    let mode = Number(this.refs.brigswitch.checked)
    this.setState({ brigade: mode })
    // todo: to uri, defaultValue
  }

  renderForm() {
    return (
      <form onSubmit={e => e.preventDefault()} className="margin-bot">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label" htmlFor="name">
              Names (split by <code>,</code>)
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <input
                className="input"
                type="text"
                ref="nameInput"
                id="name"
                defaultValue={this.state.name}
                onChange={debounce(() => this.nameInputChanged(), 480)}
              />
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="checkbox label" htmlFor="brigswitch">
              <input
                type="checkbox"
                id="brigswitch"
                ref="brigswitch"
                onChange={() => this.brigswitchChanged()}
              />{' '}
              Brigades
            </label>
          </div>
          <div className="field-body" />
        </div>
      </form>
    )
  }

  render() {
    const { name, from, to, brigade } = this.state
    const title = 'ChromeRivals: Fame growth chart'

    let splitNames = name
      .split(',')
      .map(function(e) {
        return e.trim()
      })
      .filter(function(e) {
        return e.length > 1
      })

    return (
      <div className="content">
        <Helmet>
          <meta
            name="description"
            content={'Fame history of ' + (name ? name : 'CR players')}
          />
          <title>{title}</title>
        </Helmet>

        <h1 className="title">{title}</h1>

        {this.renderForm()}

        {splitNames.length >= 1 && (
          <PlayerFameChartChart
            names={splitNames}
            from={from}
            to={to}
            brigade={brigade}
          />
        )}

        <CRDisclaimer />
      </div>
    )
  }
}

export default withRouter(PlayerFameChart)
