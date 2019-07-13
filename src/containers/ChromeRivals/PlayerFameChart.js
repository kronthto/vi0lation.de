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
    if (qs.name) {
      initialName = qs.name
    }

    this.state = { name: initialName }
  }

  nameInputChanged() {
    let name = this.refs.nameInput.value
    this.setState({ name })
    this.props.history.replace({
      search: name ? stringify({ name }) : ''
    })
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
                defaultValue={this.state.name}
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
          <meta
            name="description"
            content={'Fame history of ' + (name ? name : 'CR players')}
          />
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

export default withRouter(PlayerFameChart)
